import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKey } from '../store/settings';
import type { FoodItem, AppLanguage } from '../types';
import { validateAndFixCalories, roundMacros } from './nutrition';
import { getGeminiLanguageInstruction } from './i18n';

export interface MealContext {
  goals: { calories: number; protein: number; fat: number; carbs: number };
  consumed: { calories: number; protein: number; fat: number; carbs: number };
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

export async function parseMealDescription(userInput: string, lang: AppLanguage = 'en', context?: MealContext): Promise<ParsedMeal> {
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
      maxOutputTokens: 1024,
    },
    systemInstruction: buildSystemPrompt(lang, context),
  });

  let result;
  try {
    result = await model.generateContent(userInput);
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

  const text = result.response.text().trim();
  // Strip markdown code fences if model wraps output anyway
  const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('PARSE_ERROR');
  }

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
