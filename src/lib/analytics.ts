/**
 * Analytics helpers — wraps GA4 gtag() calls with typed event names.
 * All calls are no-ops if gtag is not available (e.g. during tests or
 * when blocked by an ad-blocker). No PII is ever sent.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

// ---------------------------------------------------------------------------
// Page views — called on every HashRouter navigation
// ---------------------------------------------------------------------------

export function trackPageView(path: string) {
  gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
  });
}

// ---------------------------------------------------------------------------
// Meal logging
// ---------------------------------------------------------------------------

/** User sent a message to log a meal (text or photo). */
export function trackMealLogStarted(method: 'text' | 'photo' | 'voice') {
  gtag('event', 'meal_log_started', { method });
}

/** Meal was parsed by Gemini and saved to the DB. */
export function trackMealSaved(source: 'ai' | 'manual', foodCount: number) {
  gtag('event', 'meal_saved', { source, food_count: foodCount });
}

/** User discarded an AI-parsed meal suggestion. */
export function trackMealDiscarded() {
  gtag('event', 'meal_discarded');
}

/** User edited the AI suggestion before saving. */
export function trackMealEdited() {
  gtag('event', 'meal_edited');
}

// ---------------------------------------------------------------------------
// Chat interactions
// ---------------------------------------------------------------------------

/** User asked a nutrition question (Q&A intent). */
export function trackNutritionQuestion() {
  gtag('event', 'nutrition_question_asked');
}

/** Chat history was cleared. */
export function trackChatCleared() {
  gtag('event', 'chat_history_cleared');
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

/** API key saved for the first time. */
export function trackApiKeySaved() {
  gtag('event', 'api_key_saved');
}

/** Goals updated in Settings. */
export function trackGoalsUpdated() {
  gtag('event', 'goals_updated');
}

/** Language changed. */
export function trackLanguageChanged(lang: string) {
  gtag('event', 'language_changed', { language: lang });
}

/** Data exported. */
export function trackDataExported() {
  gtag('event', 'data_exported');
}

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------

/** User completed onboarding. */
export function trackOnboardingCompleted() {
  gtag('event', 'onboarding_completed');
}

// ---------------------------------------------------------------------------
// Body measurements
// ---------------------------------------------------------------------------

/** A body measurement was logged. */
export function trackMeasurementLogged() {
  gtag('event', 'measurement_logged');
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

/** An article was opened. */
export function trackArticleOpened(slug: string) {
  gtag('event', 'article_opened', { article_slug: slug });
}
