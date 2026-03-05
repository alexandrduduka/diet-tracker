# Product Documentation

## Overview

Diet Tracker is a personal nutrition tracking app that runs entirely in your browser as a Progressive Web App (PWA). It uses Google's Gemini AI to parse meal descriptions into structured nutrition data — just describe what you ate and the app calculates calories, protein, fat, and carbs automatically.

There is no sign-up, no cloud sync, and no subscription. Your data stays on your device.

---

## Installation

### iOS (Safari)

1. Open https://diet-tracker-f3b.pages.dev in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** — the app icon appears on your home screen

### Android (Chrome)

1. Open https://diet-tracker-f3b.pages.dev in Chrome
2. Tap the three-dot menu → **Add to Home screen** (or look for the install prompt in the address bar)
3. Tap **Install**

### Desktop (Chrome / Edge)

Look for the install icon in the browser's address bar and click it.

---

## First-Time Setup

### Onboarding wizard

New users see a 6-step onboarding flow on first launch:

1. **Welcome** — brief app description and language picker
2. **Nutrition basics** — protein, fat, and carbs explained visually with macro split illustration. Links to the in-app article library for a deeper dive.
3. **Your body stats** — sex, age, weight (kg), height (cm). Metric only; conversion hints provided.
4. **Activity & goal** — 5 activity levels + 3 goal options (lose / maintain / gain)
5. **Your targets** — calculated calorie goal (Mifflin-St Jeor BMR × activity TDEE ± goal offset). Connected sliders for protein and fat; carbs update automatically to fill the calorie budget. Slider bounds enforce healthy minimums (≥20% of calories from fat, ≥20g carbs).
6. **Done** — recap with daily targets; tap **Start tracking** to save and go to the Dashboard

Tapping **Skip setup** at any point takes you directly to the Dashboard with default goals.

### Get a free Gemini API key

The AI meal logging feature requires a Google Gemini API key. It's **free** and takes about **30 seconds** to set up.

The easiest way: just type any meal in the Chat screen. If no key is configured, the app shows a step-by-step setup card right there — tap **Open Google AI Studio**, sign in, tap **Create API key**, copy it, paste it back in the app, and tap **Save & continue**. Your meal is sent automatically without you having to do anything else.

Alternatively, you can set it up in advance:

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with any Google account
3. Tap **Create API key** and copy it (starts with `AIza`)
4. Open the app → **Settings** → paste the key → **Save**

### Configure the app

1. Open **Settings** (gear icon on Dashboard or Settings tab)
2. Set your daily nutrition goals (calories, protein, fat, carbs) — defaults are 2000 kcal / 150g protein / 65g fat / 250g carbs
3. Choose your preferred language

---

## Pages

### Dashboard

The main screen shows your nutrition progress for today.

**Calorie ring** — a circular progress indicator showing calories consumed vs. your daily goal. The color fills as you approach the goal.

**Macro bars** — progress bars for protein, fat, and carbs. Each bar shows grams consumed, grams remaining, and percentage of goal.

**Meal list** — all meals logged today, each showing:
- The foods parsed from your description
- Per-food calorie and macro breakdown
- Total meal macros
- LLM confidence level (high / medium / low) and any notes
- A delete button (swipe or tap trash icon)

**Log Meal button** — taps through to the Chat page.

---

### Chat (Nutrition Assistant)

The intelligent chat screen. You can both **log meals** and **ask nutrition questions** — the app automatically detects which one you mean and responds accordingly. Your full conversation history is preserved across sessions.

**Input methods:**

| Method | How to use |
|---|---|
| **Type** | Type your meal description or question in the text box and tap Send |
| **Voice** | Tap the mic icon, speak, tap again to stop — the transcript fills the text box |
| **Photo** | Tap the camera icon to take a photo or choose from your library — always treated as meal logging |
| **Photo + text** | Attach a photo and add a text description for best accuracy |

**Logging meals:**

| Input | What happens |
|---|---|
| `"2 scrambled eggs with butter"` | High confidence — common food with typical portion |
| `"200g grilled chicken breast"` | High confidence — explicit weight |
| `"a bowl of pasta"` | Medium confidence — typical portion assumed |
| `"homemade stew"` | Low confidence — estimated from generic recipe |
| `"30g ham, 60g oatmeal"` | Two items parsed as separate entries in one meal |

After the AI responds you see each food item with macros, a total, and Save / Discard buttons. Tapping **Save** adds the meal to today's log and shows a coaching message about your remaining budget.

**Asking questions:**

The AI recognises when you're asking a question rather than logging a meal. Example questions:

- *"How am I doing today?"* — shows today's progress vs. goals
- *"Summarise what I ate this week"* — uses your last 7 days of logs
- *"Why am I losing weight so slowly?"* — coaching advice based on your data
- *"Is my protein high enough?"* — analyses your current intake vs. goal
- *"When should I expect to see results?"* — evidence-based timeline

Answers appear as a distinct bubble (slightly darker background) and stay in the conversation history.

**Chat history:**

- Conversation is saved automatically and restored when you re-open the chat
- Tap the trash icon in the header to clear the history (confirmation required)
- Up to 100 messages are retained

**Coaching** — the AI knows your daily goals and what you've already eaten today. After each meal it tells you how many calories remain, whether you're on track for protein, and gives encouragement or a gentle warning if you're approaching a limit.

**No API key** — if you haven't set up a key yet, a guided setup card appears instead of an error. It walks you through getting a free key from Google AI Studio and lets you paste it inline without leaving the Chat screen.

**Manual fallback** — if the AI call fails (no internet, rate limit), a manual entry form appears where you can type in macros directly.

**Offline mode** — when there's no internet connection, the AI input is replaced with a prompt to use manual logging.

---

### History

Shows meal history by week.

**Week selector** — swipe or tap arrows to navigate between weeks. Shows "This week", "Last week", or a date range for older weeks.

**Day cards** — each day of the week shows:
- Total calories consumed vs. goal
- Macro totals (protein, fat, carbs)
- Individual meal entries for that day
- Empty state if no meals were logged

---

### Analytics

Charts for longer-term nutrition and body trends.

**Tabs:**
- **Nutrition** — calorie and macro trends
- **Body** — weight and measurement trends

**Period toggle:**
- **Daily** — last 30 days
- **Monthly** — last 12 months (averages per month)

**Nutrition charts:**
- *Calories* — area chart with a dashed reference line at your calorie goal
- *Macros* — line chart with three lines: protein (green), carbs (amber), fat (terracotta)

**Body charts:**
- Metric selector chips: Weight, Waist, Chest, Hips, Left/Right Arm, Left/Right Thigh
- Area chart for the selected metric over the selected period

Empty state is shown for periods with no data.

---

### Measurements

Log and track body measurements over time.

**Log button (+ icon)** — opens a drawer to record today's measurements. You can log any combination of:
- Weight (kg)
- Waist, chest, hips (cm)
- Left/right arm (cm)
- Left/right thigh (cm)
- Notes

**Recent entries list** — shows the last few logged measurements with timestamps.

The measurements are also visualized in the Analytics → Body tab.

---

### Settings

Configure the app.

**Gemini API Key** — paste your key here. The key is stored only in your browser's localStorage and is never sent anywhere except directly to the Gemini API.

**Daily Goals** — set your target calories and macros. These are used for the Dashboard progress indicators and the Analytics goal reference line.

**Language** — choose from English, Russian, Ukrainian, Czech, German, French, Spanish. The UI and Gemini responses both switch to the selected language.

**Export data** — downloads all meals and measurements as a JSON file.

**Clear all data** — permanently deletes all meals and measurements from IndexedDB. This cannot be undone.

---

## Offline Behavior

| Feature | Offline |
|---|---|
| Dashboard | Works — reads from local IndexedDB |
| History, Analytics, Measurements | Works — reads from local IndexedDB |
| Manual meal logging | Works |
| AI meal logging (Chat) | Disabled — shows manual fallback |
| Settings | Works |

The app shell (all HTML/CSS/JS) is cached by the service worker on first load, so the app opens instantly even without a network connection.

---

## Data & Privacy

- All data (meals, measurements) is stored in **IndexedDB** in your browser. It does not leave your device except for Gemini API calls.
- Gemini API calls send your **meal description text** to Google's API. Review Google's privacy policy at https://ai.google.dev/terms for details.
- Your **API key** is stored in `localStorage` and is only included in requests to `generativelanguage.googleapis.com`.
- No cookies, no analytics, no third-party tracking.

**Clearing data:** Settings → Clear All Data removes all IndexedDB records. Clearing browser site data also removes everything including the API key.

---

## Troubleshooting

**"API quota exceeded"** — you've hit the Gemini free tier rate limit (10 requests/minute) or daily limit (~250–500/day). Wait a minute and try again, or use manual logging.

**"Invalid API key"** — the key was entered incorrectly, or has been deleted in Google AI Studio. Go to Settings and re-enter a valid key.

**AI returns wrong macros** — the model estimates based on USDA data and typical portions. For precise tracking, include explicit weights in your description: *"150g brown rice"* instead of *"a cup of rice"*.

**App doesn't install on iOS** — installation requires Safari. Chrome and other browsers on iOS don't support PWA installation.

**Data is gone after clearing browser history** — clearing browser data removes IndexedDB storage. Use the Export function in Settings regularly if you want to keep a backup.
