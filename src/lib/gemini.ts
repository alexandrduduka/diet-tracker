import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKey } from '../store/settings';
import type { FoodItem, AppLanguage, OnboardingProfile } from '../types';
import { validateAndFixCalories, roundMacros } from './nutrition';
import { getGeminiLanguageInstruction } from './i18n';

function logTokens(label: string, response: { usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number; totalTokenCount?: number } }): void {
  const u = response.usageMetadata;
  if (!u) return;
  console.log(
    `[Gemini] ${label} — in: ${u.promptTokenCount ?? '?'} | thinking: ${u.thoughtsTokenCount ?? 0} | out: ${u.candidatesTokenCount ?? '?'} | total: ${u.totalTokenCount ?? '?'}`
  );
}

export interface MealContext {
  goals: { calories: number; protein: number; fat: number; carbs: number };
  consumed: { calories: number; protein: number; fat: number; carbs: number };
}

export interface NutritionContext extends MealContext {
  /** Recent daily totals (last 7 days), newest first */
  recentDays?: Array<{ dayKey: string; calories: number; protein: number; fat: number; carbs: number }>;
  /** Latest body measurement, if any */
  latestWeight?: number; // kg
}

function buildSystemPrompt(lang: AppLanguage, context?: MealContext): string {
  const langInstruction = getGeminiLanguageInstruction(lang);

  const langNames: Record<AppLanguage, string> = {
    en: 'English', ru: 'Russian', cs: 'Czech', de: 'German', fr: 'French', es: 'Spanish', uk: 'Ukrainian',
  };
  const langName = langNames[lang] ?? 'English';

  let contextBlock = '';
  if (context) {
    const remaining = {
      calories: Math.max(0, context.goals.calories - context.consumed.calories),
      protein: Math.max(0, context.goals.protein - context.consumed.protein),
      fat: Math.max(0, context.goals.fat - context.consumed.fat),
      carbs: Math.max(0, context.goals.carbs - context.consumed.carbs),
    };
    contextBlock = `

User's daily nutrition context:
- Daily goal: ${context.goals.calories} kcal | P:${context.goals.protein}g C:${context.goals.carbs}g F:${context.goals.fat}g
- Already consumed today: ${context.consumed.calories} kcal | P:${context.consumed.protein}g C:${context.consumed.carbs}g F:${context.consumed.fat}g
- Remaining today: ${remaining.calories} kcal | P:${remaining.protein}g C:${remaining.carbs}g F:${remaining.fat}g

After parsing the meal, add a "message" field: 2-3 sentences of friendly, motivational coaching in ${langName} that tells the user how this meal fits their remaining daily budget. Be positive and encouraging. Mention specific numbers (kcal remaining after this meal). Warn gently if a limit is close or exceeded.`;
  }

  return `You are a nutrition analysis assistant. Parse meal descriptions and return ONLY a JSON object — no markdown, no explanation, just raw JSON.

JSON format:
{
  "foods": [
    {
      "name": "food name",
      "quantity": "amount with units, e.g. 1 medium ~118g",
      "calories": 105,
      "protein": 1.3,
      "fat": 0.4,
      "carbs": 27
    }
  ],
  "confidence": "high" | "medium" | "low",
  "notes": "optional assumptions or caveats",
  "message": "optional coaching message (only when daily context is provided)"
}

Rules:
- When quantities are vague (e.g. "a banana"), use typical serving sizes and state your assumption in quantity field.
- When quantities are explicit (e.g. "200g chicken"), use them directly.
- Reference USDA nutrition data.
- For mixed dishes estimate based on typical recipes.
- Include milk, sugar, syrups in beverage calculations if mentioned.
- All macro values in grams. Calories = protein*4 + carbs*4 + fat*9 (round to nearest integer).
- confidence: "high" for explicit quantities, "medium" for typical portions, "low" for vague/unusual.
- Never refuse — always give your best estimate.
- Return ONLY the JSON object, nothing else.${langInstruction}${contextBlock}`;
}

export interface ParsedMeal {
  foods: FoodItem[];
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
  message?: string;
}

export interface ImageAttachment {
  base64: string;
  mimeType: string;
}

export async function parseMealDescription(userInput: string, lang: AppLanguage = 'en', context?: MealContext, image?: ImageAttachment): Promise<ParsedMeal> {
  const key = getApiKey();
  if (!key) {
    throw new Error('NO_API_KEY');
  }

  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: context ? 0.4 : 0.1,
      maxOutputTokens: 4096,
    },
    systemInstruction: buildSystemPrompt(lang, context),
  });

  let result;
  try {
    if (image) {
      const parts: any[] = [
        { inlineData: { data: image.base64, mimeType: image.mimeType } },
        { text: userInput.trim() || 'Identify the food in this image and estimate the nutrition.' },
      ];
      result = await model.generateContent(parts);
    } else {
      result = await model.generateContent(userInput);
    }
  } catch (err: any) {
    console.error('[Gemini] raw error:', err);
    const status = err?.status ?? err?.statusCode ?? err?.httpErrorCode;
    const msg = (err?.message ?? '').toLowerCase();
    if (status === 429 || msg.includes('resource_exhausted') || (msg.includes('quota') && msg.includes('exceeded'))) {
      throw new Error('RATE_LIMIT');
    }
    if (status === 400 && (msg.includes('api key') || msg.includes('api_key') || msg.includes('invalid key') || msg.includes('invalid argument'))) {
      throw new Error('INVALID_API_KEY');
    }
    if (status === 403 || msg.includes('api_key_invalid') || msg.includes('permission_denied')) {
      throw new Error('INVALID_API_KEY');
    }
    throw new Error(`API_ERROR: ${err?.message ?? 'Unknown error'}`);
  }

  function parseResponseText(raw: string): any {
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(cleaned);
  }

  function buildResult(parsed: any): ParsedMeal {
    if (!parsed.foods || !Array.isArray(parsed.foods) || parsed.foods.length === 0) {
      throw new Error('PARSE_ERROR');
    }
    const foods: FoodItem[] = parsed.foods.map((f: any) => ({
      name: String(f.name ?? 'Unknown'),
      quantity: String(f.quantity ?? '1 serving'),
      macros: validateAndFixCalories(
        roundMacros({
          calories: Number(f.calories) || 0,
          protein: Number(f.protein) || 0,
          fat: Number(f.fat) || 0,
          carbs: Number(f.carbs) || 0,
        })
      ),
    }));
    return {
      foods,
      confidence: ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium',
      notes: parsed.notes ? String(parsed.notes) : undefined,
      message: parsed.message ? String(parsed.message) : undefined,
    };
  }

  logTokens('parseMeal', result.response);
  const rawText = result.response.text().trim();
  let parsed: any;
  try {
    parsed = parseResponseText(rawText);
    return buildResult(parsed);
  } catch {
    // Response was likely truncated — retry once using a chat session so the
    // model can see what it already produced and complete the JSON.
    console.warn('[Gemini] PARSE_ERROR on first attempt, retrying. Raw:', rawText);
    try {
      const chat = model.startChat();
      // First turn: replicate the original request
      if (image) {
        await chat.sendMessage([
          { inlineData: { data: image.base64, mimeType: image.mimeType } },
          { text: userInput.trim() || 'Identify the food in this image and estimate the nutrition.' },
        ]);
      } else {
        await chat.sendMessage(userInput);
      }
      // Second turn: ask it to complete the truncated response
      const retryResult = await chat.sendMessage(
        'Your previous response was cut off before the JSON was complete. Please output the full, valid JSON object from the beginning — no truncation.'
      );
      logTokens('parseMeal/retry', retryResult.response);
      const retryText = retryResult.response.text().trim();
      const retryParsed = parseResponseText(retryText);
      return buildResult(retryParsed);
    } catch (retryErr: any) {
      console.error('[Gemini] PARSE_ERROR after retry. Original raw:', rawText);
      throw new Error('PARSE_ERROR');
    }
  }
}

// ─── Intent classification ────────────────────────────────────────────────────

/**
 * Quickly classifies whether a user message is a meal-logging intent or a
 * general nutrition/coaching question.  Returns 'log' | 'question'.
 *
 * Uses a lightweight JSON prompt so the main model call can be skipped when
 * the user is clearly asking a question.
 */
export async function classifyIntent(
  userInput: string,
  lang: AppLanguage = 'en',
): Promise<'log' | 'question' | 'edit'> {
  const key = getApiKey();
  if (!key) throw new Error('NO_API_KEY');

  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
      // gemini-2.5-flash uses thinking tokens internally; 64 is too few to
      // leave room for the actual JSON output after thinking completes.
      maxOutputTokens: 512,
    },
    systemInstruction: `Classify the user message into one of three intents.
Return ONLY a JSON object: {"intent": "log"}, {"intent": "question"}, or {"intent": "edit"}.
- "log": user is describing food they ate or want to log (e.g. "I had a banana and coffee", "150g chicken breast", "🍕")
- "question": user is asking a question or requesting analysis/advice (e.g. "how am I doing today?", "why am I losing weight slowly?", "summarise what I ate", "is my protein high enough?")
- "edit": user wants to correct or update a previously logged meal (e.g. "I made a mistake in my last entry", "edit my last meal", "change the meal I just logged", "correct my previous entry", "I entered the wrong amount", "it was actually 200g not 100g")
Lean towards "question" when the message is a question or does not contain food items.${getGeminiLanguageInstruction(lang)}`,
  });

  try {
    const result = await model.generateContent(userInput);
    logTokens('classifyIntent', result.response);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    if (parsed.intent === 'edit') return 'edit';
    return parsed.intent === 'log' ? 'log' : 'question';
  } catch {
    // On any failure, default to 'log' so the normal meal-parsing path handles it
    return 'log';
  }
}

// ─── Open-ended nutrition Q&A ────────────────────────────────────────────────

function buildQASystemPrompt(lang: AppLanguage, context: NutritionContext): string {
  const langNames: Record<AppLanguage, string> = {
    en: 'English', ru: 'Russian', cs: 'Czech', de: 'German', fr: 'French', es: 'Spanish', uk: 'Ukrainian',
  };
  const langName = langNames[lang] ?? 'English';
  const langInstruction = getGeminiLanguageInstruction(lang);

  const remaining = {
    calories: Math.max(0, context.goals.calories - context.consumed.calories),
    protein: Math.max(0, context.goals.protein - context.consumed.protein),
    fat: Math.max(0, context.goals.fat - context.consumed.fat),
    carbs: Math.max(0, context.goals.carbs - context.consumed.carbs),
  };

  let recentBlock = '';
  if (context.recentDays && context.recentDays.length > 0) {
    const rows = context.recentDays
      .map((d) => `  ${d.dayKey}: ${d.calories} kcal | P:${d.protein}g C:${d.carbs}g F:${d.fat}g`)
      .join('\n');
    recentBlock = `\n\nRecent daily totals (newest first):\n${rows}`;
  }

  let weightBlock = '';
  if (context.latestWeight) {
    weightBlock = `\n\nLatest logged body weight: ${context.latestWeight} kg`;
  }

  return `You are a friendly, knowledgeable nutrition coach. Answer the user's questions about nutrition, diet, and health progress in ${langName}.

User's current daily context:
- Daily goal: ${context.goals.calories} kcal | P:${context.goals.protein}g C:${context.goals.carbs}g F:${context.goals.fat}g
- Consumed today: ${context.consumed.calories} kcal | P:${context.consumed.protein}g C:${context.consumed.carbs}g F:${context.consumed.fat}g
- Remaining today: ${remaining.calories} kcal | P:${remaining.protein}g C:${remaining.carbs}g F:${remaining.fat}g${recentBlock}${weightBlock}

Guidelines:
- Be concise but thorough (3–6 sentences usually ideal, more when summarising).
- Use specific numbers from the context when relevant.
- Be encouraging and positive, but honest — if something is off-track, say so gently.
- Respond in plain text (no markdown). Speak directly to the user as "you".
- Answer in ${langName}.${langInstruction}`;
}

/**
 * Ask the nutrition coach a free-form question.
 * Returns a plain-text answer (not JSON).
 */
export async function askNutritionQuestion(
  question: string,
  lang: AppLanguage = 'en',
  context: NutritionContext,
): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error('NO_API_KEY');

  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 1024,
    },
    systemInstruction: buildQASystemPrompt(lang, context),
  });

  try {
    const result = await model.generateContent(question);
    logTokens('askQuestion', result.response);
    return result.response.text().trim();
  } catch (err: any) {
    const status = err?.status ?? err?.statusCode ?? err?.httpErrorCode;
    const msg = (err?.message ?? '').toLowerCase();
    if (status === 429 || msg.includes('resource_exhausted') || (msg.includes('quota') && msg.includes('exceeded'))) {
      throw new Error('RATE_LIMIT');
    }
    if (status === 400 && (msg.includes('api key') || msg.includes('api_key') || msg.includes('invalid key') || msg.includes('invalid argument'))) {
      throw new Error('INVALID_API_KEY');
    }
    if (status === 403 || msg.includes('api_key_invalid') || msg.includes('permission_denied')) {
      throw new Error('INVALID_API_KEY');
    }
    throw new Error(`API_ERROR: ${err?.message ?? 'Unknown error'}`);
  }
}

// ---------------------------------------------------------------------------
// Body photo analysis
// ---------------------------------------------------------------------------

export interface BodyAnalysisResult {
  estimatedWeight?: string;
  bodyFatPercentageRange?: string;
  bmiCategory?: string;
  notes: string;
  disclaimer: string;
}

export async function analyzeBodyPhoto(
  image: ImageAttachment,
  profile: OnboardingProfile | null,
  lang: AppLanguage
): Promise<BodyAnalysisResult> {
  const key = getApiKey();
  if (!key) throw new Error('NO_API_KEY');

  const langInstruction = getGeminiLanguageInstruction(lang);

  let profileBlock = '';
  if (profile) {
    profileBlock = `\nUser's known profile: sex=${profile.sex}, age=${profile.age}, weight=${profile.weightKg}kg, height=${profile.heightCm}cm.`;
  }

  const systemPrompt = `You are a body composition estimation assistant. You will be shown a photo of a person.
Provide rough visual estimates only. Always include a clear medical disclaimer.
${profileBlock}

Return ONLY a JSON object in this exact shape:
{
  "estimatedWeight": "optional string, e.g. '72–78 kg' — omit the field entirely if impossible to estimate",
  "bodyFatPercentageRange": "optional string, e.g. '18–22%' — omit if impossible",
  "bmiCategory": "optional string: one of 'Underweight', 'Normal weight', 'Overweight', 'Obese' — omit if impossible",
  "notes": "2–3 sentences describing what you observe in plain language, including uncertainty",
  "disclaimer": "1–2 sentence disclaimer: these are rough visual estimates only, not a substitute for medical assessment"
}

Rules:
- If the photo does not clearly show a person, set notes to explain that and omit all numeric/category fields.
- Never refuse — always provide your best estimate with appropriate uncertainty language.
- Do not include any text outside the JSON object.
${langInstruction}`;

  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
    systemInstruction: systemPrompt,
  });

  try {
    const parts = [
      { inlineData: { data: image.base64, mimeType: image.mimeType } },
      { text: 'Analyse this photo and return the JSON.' },
    ];
    const result = await model.generateContent(parts);
    logTokens('analyzeBody', result.response);
    const raw = result.response.text().trim();
    const parsed = JSON.parse(raw) as BodyAnalysisResult;
    if (!parsed.notes) parsed.notes = 'Unable to provide an estimate from this image.';
    if (!parsed.disclaimer) parsed.disclaimer = 'These are rough visual estimates only and are not a substitute for professional medical assessment.';
    return parsed;
  } catch (err: any) {
    const status = err?.status ?? err?.statusCode ?? err?.httpErrorCode;
    const msg = (err?.message ?? '').toLowerCase();
    if (!getApiKey()) throw new Error('NO_API_KEY');
    if (status === 429 || msg.includes('resource_exhausted') || (msg.includes('quota') && msg.includes('exceeded'))) {
      throw new Error('RATE_LIMIT');
    }
    if (status === 400 && (msg.includes('api key') || msg.includes('api_key') || msg.includes('invalid key') || msg.includes('invalid argument'))) {
      throw new Error('INVALID_API_KEY');
    }
    if (status === 403 || msg.includes('api_key_invalid') || msg.includes('permission_denied')) {
      throw new Error('INVALID_API_KEY');
    }
    if (msg.includes('json') || msg.includes('parse') || err instanceof SyntaxError) {
      throw new Error('PARSE_ERROR');
    }
    throw new Error(`API_ERROR: ${err?.message ?? 'Unknown error'}`);
  }
}
