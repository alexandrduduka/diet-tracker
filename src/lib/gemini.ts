import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKey } from '../store/settings';
import type { FoodItem, AppLanguage } from '../types';
import { validateAndFixCalories, roundMacros } from './nutrition';
import { getGeminiLanguageInstruction } from './i18n';

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
): Promise<'log' | 'question'> {
  const key = getApiKey();
  if (!key) throw new Error('NO_API_KEY');

  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
      maxOutputTokens: 64,
    },
    systemInstruction: `Classify the user message as either a meal-logging request or a nutrition/health question.
Return ONLY a JSON object: {"intent": "log"} or {"intent": "question"}.
- "log": user is describing food they ate or want to log (e.g. "I had a banana and coffee", "150g chicken breast", "🍕")
- "question": user is asking a question or requesting analysis/advice (e.g. "how am I doing today?", "why am I losing weight slowly?", "summarise what I ate", "is my protein high enough?")
Lean towards "question" when the message is a question or does not contain food items.${getGeminiLanguageInstruction(lang)}`,
  });

  try {
    const result = await model.generateContent(userInput);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);
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
