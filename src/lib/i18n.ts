import type { AppLanguage } from '../types';

export interface Translations {
  // Common
  save: string;
  cancel: string;
  delete: string;
  noData: string;

  // Navigation
  navToday: string;
  navLog: string;
  navHistory: string;
  navBody: string;
  navCharts: string;
  navSettings: string;

  // Dashboard
  bodyNudgeText: string;
  bodyNudgeAction: string;
  today: string;
  mealsToday: string;
  noMealsYet: string;
  logFirstMeal: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;

  // Chat
  logMeal: string;
  chatWelcome: string;
  chatSuggestionLogMeal: string;
  chatSuggestionHowAmIDoing: string;
  chatSuggestionProtein: string;
  chatSuggestionSummary: string;
  chatSuggestionWeightLoss: string;
  describeWhatYouAte: string;
  analyzing: string;
  gotIt: string;
  hereIsWhatIFound: string;
  total: string;
  saveBtn: string;
  discard: string;
  logManually: string;
  foodName: string;
  saveManually: string;
  offlineManualEntry: string;
  noApiKey: string;
  invalidApiKey: string;
  rateLimit: string;
  parseError: string;

  // History
  history: string;
  thisWeek: string;
  lastWeek: string;
  noDataLabel: string;
  meals: string;
  meal: string;
  ofGoal: string;

  // Measurements
  measurements: string;
  logMeasurements: string;
  recentLogs: string;
  noMeasurementsYet: string;
  logFirstMeasurement: string;
  notes: string;
  optionalNotes: string;
  saving: string;
  editMeal: string;
  mealDescription: string;
  nutrients: string;
  editSuggestion: string;

  // Measurement labels
  weight: string;
  waist: string;
  chest: string;
  hips: string;
  arm: string;
  thigh: string;

  // Settings
  settings: string;
  geminiApiKey: string;
  pasteApiKey: string;
  getKeyAt: string;
  keyStoredLocally: string;
  dailyGoals: string;
  saveSettings: string;
  saved: string;
  data: string;
  exportJson: string;
  clearAllData: string;
  clearAllDataConfirm: string;
  clearAllDataDesc: string;
  deleteEverything: string;
  language: string;

  // API key setup wizard (shown inline in Chat when no key is set)
  apiKeySetupTitle: string;
  apiKeySetupFree: string;
  apiKeyOpenStudio: string;
  apiKeyOnceThereTitle: string;
  apiKeyStep1: string;
  apiKeyStep2: string;
  apiKeyStep3: string;
  apiKeyStep4: string;
  apiKeySaveAndContinue: string;

  // Voice & photo input
  micTapToSpeak: string;
  micListening: string;
  micNotSupported: string;
  photoAttached: string;
  photoRemove: string;
  takePhotoOrChoose: string;

  // Chat history & Q&A
  chatTitle: string;
  chatInputPlaceholder: string;
  chatClearHistory: string;
  chatClearHistoryConfirm: string;
  chatAnswerError: string;

  // Articles
  navArticles: string;
  articlesTitle: string;
  articlesSubtitle: string;
  readMore: string;
  minRead: string;
  backToArticles: string;
  articleNotFound: string;

  // Analytics
  analytics: string;
  nutrition: string;
  body: string;
  daily30d: string;
  monthly12m: string;
  caloriesLast30: string;
  macrosLast30: string;
  avgCalories12m: string;
  avgMacros12m: string;
  chartPlaceholder: string;
  chartPlaceholderSub: string;
  last30Days: string;
  last12Months: string;

  // Onboarding
  onboardingWelcomeTitle: string;
  onboardingWelcomeSubtitle: string;
  onboardingGetStarted: string;
  onboardingSkip: string;
  onboardingNutritionTitle: string;
  onboardingNutritionSubtitle: string;
  onboardingProteinDesc: string;
  onboardingFatDesc: string;
  onboardingCarbsDesc: string;
  onboardingReadFullGuide: string;
  onboardingBodyStatsTitle: string;
  onboardingMale: string;
  onboardingFemale: string;
  onboardingAge: string;
  onboardingWeight: string;
  onboardingWeightHint: string;
  onboardingHeight: string;
  onboardingHeightHint: string;
  onboardingActivityTitle: string;
  onboardingActivitySedentary: string;
  onboardingActivitySedentaryDesc: string;
  onboardingActivityLight: string;
  onboardingActivityLightDesc: string;
  onboardingActivityModerate: string;
  onboardingActivityModerateDesc: string;
  onboardingActivityActive: string;
  onboardingActivityActiveDesc: string;
  onboardingActivityVeryActive: string;
  onboardingActivityVeryActiveDesc: string;
  onboardingGoalTitle: string;
  onboardingGoalLose: string;
  onboardingGoalLoseDesc: string;
  onboardingGoalMaintain: string;
  onboardingGoalMaintainDesc: string;
  onboardingGoalGain: string;
  onboardingGoalGainDesc: string;
  onboardingResultsTitle: string;
  onboardingTdeeLabel: string;
  onboardingAdjustMacros: string;
  onboardingCarbsDerived: string;
  onboardingLowCarbsWarning: string;
  onboardingDoneTitle: string;
  onboardingDoneSummary: string;
  onboardingStartTracking: string;
  onboardingNext: string;
  onboardingBack: string;
  onboardingValidationAge: string;
  onboardingValidationWeight: string;
  onboardingValidationHeight: string;

  // Onboarding macro insights
  macroInsightLowProtein: string;
  macroInsightHighProtein: string;
  macroInsightLowFat: string;
  macroInsightHighFat: string;
  macroInsightLowCarbs: string;
  macroInsightBalanced: string;

  // API key explainer modal
  apiKeyWhatIsThis: string;
  apiKeyExplainTitle: string;
  apiKeyExplainBody: string;
  apiKeyExplainStep1: string;
  apiKeyExplainStep2: string;
  apiKeyExplainStep3: string;
  apiKeyExplainGotIt: string;
  apiKeyQuotaNote: string;
  apiKeyViewUsage: string;

  // Clear data archive
  clearAllDataArchiveDesc: string;
  archiveEverything: string;
}

const en: Translations = {
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  noData: 'No data',

  navToday: 'Today',
  navLog: 'Log & Ask',
  navHistory: 'History',
  navBody: 'Body',
  navCharts: 'Charts',
  navSettings: 'Settings',

  bodyNudgeText: 'No body measurements in the last 2 weeks. Log to track your progress.',
  bodyNudgeAction: 'Log now',

  today: 'Today',
  mealsToday: 'Meals today',
  noMealsYet: 'No meals logged yet today.',
  logFirstMeal: 'Log your first meal →',
  calories: 'Calories',
  protein: 'Protein',
  carbs: 'Carbs',
  fat: 'Fat',

  logMeal: 'Log a Meal',
  chatWelcome: 'Describe what you ate and I\'ll calculate the macros — or ask me anything about your nutrition.',
  chatSuggestionLogMeal: '2 eggs and toast 🍳',
  chatSuggestionHowAmIDoing: 'How am I doing today? 📊',
  chatSuggestionProtein: 'Is my protein high enough?',
  chatSuggestionSummary: 'Summarise this week',
  chatSuggestionWeightLoss: 'When will I finally lose weight? ⚖️',
  describeWhatYouAte: 'Describe what you ate...',
  analyzing: 'Analyzing...',
  gotIt: 'Got it! Here\'s what I found:',
  hereIsWhatIFound: 'Here\'s what I found:',
  total: 'Total',
  saveBtn: 'Save',
  discard: 'Discard',
  logManually: 'Log manually',
  foodName: 'Food name',
  saveManually: 'Save manually',
  offlineManualEntry: 'Offline — using manual entry',
  noApiKey: 'No Gemini API key configured. Go to Settings and add your key.',
  invalidApiKey: 'Invalid API key. Check your key in Settings — it should start with "AIza".',
  rateLimit: 'API quota exceeded (rate limit or daily cap). Log manually below or try again in a minute.',
  parseError: 'Unexpected response from Gemini. Try rephrasing or log manually.',

  micTapToSpeak: 'Tap to speak',
  micListening: 'Listening...',
  micNotSupported: 'Speech recognition not supported in this browser.',
  photoAttached: 'Photo attached',
  photoRemove: 'Remove',
  takePhotoOrChoose: 'Take a photo or choose from library',

  chatTitle: 'Nutrition Assistant',
  chatInputPlaceholder: 'Log a meal or ask a question...',
  chatClearHistory: 'Clear chat',
  chatClearHistoryConfirm: 'Clear chat history?',
  chatAnswerError: 'Could not get an answer. Try again or check your API key.',

  history: 'History',
  thisWeek: 'This week',
  lastWeek: 'Last week',
  noDataLabel: 'No data',
  meals: 'meals',
  meal: 'meal',
  ofGoal: '% of goal',

  measurements: 'Measurements',
  logMeasurements: 'Log Measurements',
  recentLogs: 'Recent Logs',
  noMeasurementsYet: 'No measurements logged yet.',
  logFirstMeasurement: 'Log your first measurement →',
  notes: 'Notes',
  optionalNotes: 'Optional notes',
  saving: 'Saving...',
  editMeal: 'Edit Meal',
  mealDescription: 'Meal description',
  nutrients: 'Nutrients',
  editSuggestion: 'Edit',

  weight: 'Weight',
  waist: 'Waist',
  chest: 'Chest',
  hips: 'Hips',
  arm: 'Arm',
  thigh: 'Thigh',

  settings: 'Settings',
  geminiApiKey: 'Gemini API Key',
  pasteApiKey: 'Paste your API key here',
  getKeyAt: 'Get your free key at Google AI Studio',
  keyStoredLocally: 'Stored locally in your browser only. Never sent anywhere except Google\'s API.',
  dailyGoals: 'Daily Goals',
  saveSettings: 'Save Settings',
  saved: 'Saved!',
  data: 'Data',
  exportJson: 'Export data as JSON',
  clearAllData: 'Clear all data',
  clearAllDataConfirm: 'Clear all data?',
  clearAllDataDesc: 'This will permanently delete all your meals and measurements. This cannot be undone.',
  deleteEverything: 'Delete everything',
  language: 'Language',

  apiKeySetupTitle: 'AI meal logging needs a Google API key',
  apiKeySetupFree: "It's free and takes about 30 seconds to set up.",
  apiKeyOpenStudio: 'Open Google AI Studio',
  apiKeyOnceThereTitle: 'Once there:',
  apiKeyStep1: 'Sign in with any Google account',
  apiKeyStep2: 'Tap "Create API key"',
  apiKeyStep3: 'Copy the key (it starts with AIza)',
  apiKeyStep4: 'Paste it below and tap Save',
  apiKeySaveAndContinue: 'Save & continue',

  navArticles: 'Learn',
  articlesTitle: 'Nutrition Guides',
  articlesSubtitle: 'Evidence-based articles on nutrition science',
  readMore: 'Read article',
  minRead: 'min read',
  backToArticles: '← Articles',
  articleNotFound: 'Article not found.',

  analytics: 'Analytics',
  nutrition: 'Nutrition',
  body: 'Body',
  daily30d: 'Daily (30d)',
  monthly12m: 'Monthly (12m)',
  caloriesLast30: 'Calories — last 30 days',
  macrosLast30: 'Macros — last 30 days',
  avgCalories12m: 'Avg daily calories — last 12 months',
  avgMacros12m: 'Avg daily macros — last 12 months',
  chartPlaceholder: 'Your charts will appear here',
  chartPlaceholderSub: 'Log at least 2 meals to see your nutrition trends',
  last30Days: 'last 30 days',
  last12Months: 'last 12 months',

  onboardingWelcomeTitle: 'Welcome to Diet Tracker',
  onboardingWelcomeSubtitle: 'Track your nutrition effortlessly. Describe meals in plain text and AI calculates your calories and macros — or log manually. Everything stays on your device.',
  onboardingGetStarted: 'Get started →',
  onboardingSkip: 'Skip setup',
  onboardingNutritionTitle: 'How nutrition works',
  onboardingNutritionSubtitle: 'Food gives you energy through three macronutrients. Each plays a unique role:',
  onboardingProteinDesc: 'Builds and repairs muscle. Essential for feeling full. The most important macro to hit.',
  onboardingFatDesc: 'Supports hormones and absorbs vitamins. Keeps you satisfied between meals.',
  onboardingCarbsDesc: 'Your body\'s preferred fuel source. Powers your brain and workouts.',
  onboardingReadFullGuide: '→ Read the full nutrition guide',
  onboardingBodyStatsTitle: 'Tell us about you',
  onboardingMale: 'Male',
  onboardingFemale: 'Female',
  onboardingAge: 'Age (years)',
  onboardingWeight: 'Weight (kg)',
  onboardingWeightHint: 'To convert from lbs: divide by 2.2',
  onboardingHeight: 'Height (cm)',
  onboardingHeightHint: 'To convert from ft/in: feet × 30.5 + inches × 2.54',
  onboardingActivityTitle: 'How active are you?',
  onboardingActivitySedentary: 'Sedentary',
  onboardingActivitySedentaryDesc: 'Desk job, little or no exercise',
  onboardingActivityLight: 'Lightly active',
  onboardingActivityLightDesc: 'Light exercise 1–3 days/week',
  onboardingActivityModerate: 'Moderately active',
  onboardingActivityModerateDesc: 'Moderate exercise 3–5 days/week',
  onboardingActivityActive: 'Active',
  onboardingActivityActiveDesc: 'Hard exercise 6–7 days/week',
  onboardingActivityVeryActive: 'Very active',
  onboardingActivityVeryActiveDesc: 'Physical job or 2× daily training',
  onboardingGoalTitle: 'What\'s your goal?',
  onboardingGoalLose: 'Lose weight',
  onboardingGoalLoseDesc: 'Eat ~400 kcal less than you burn',
  onboardingGoalMaintain: 'Maintain weight',
  onboardingGoalMaintainDesc: 'Eat roughly what you burn',
  onboardingGoalGain: 'Gain muscle',
  onboardingGoalGainDesc: 'Eat ~250 kcal more than you burn',
  onboardingResultsTitle: 'Your daily targets',
  onboardingTdeeLabel: 'Your maintenance calories (TDEE):',
  onboardingAdjustMacros: 'Fine-tune your macros',
  onboardingCarbsDerived: 'Carbs (auto-calculated)',
  onboardingLowCarbsWarning: 'Carbs are very low. Consider reducing protein or fat slightly.',
  onboardingDoneTitle: 'You\'re all set!',
  onboardingDoneSummary: 'Your daily goal:',
  onboardingStartTracking: 'Start tracking →',
  onboardingNext: 'Next →',
  onboardingBack: '← Back',
  onboardingValidationAge: 'Please enter a valid age (10–99)',
  onboardingValidationWeight: 'Please enter a valid weight (30–300 kg)',
  onboardingValidationHeight: 'Please enter a valid height (100–250 cm)',

  macroInsightLowProtein: 'Low protein may lead to muscle loss and poor recovery. Aim for at least 1.2g per kg of body weight.',
  macroInsightHighProtein: 'High protein helps preserve muscle and keeps you full. A great choice for active lifestyles.',
  macroInsightLowFat: 'Very low fat can disrupt hormone production and reduce absorption of fat-soluble vitamins (A, D, E, K).',
  macroInsightHighFat: 'High fat with low carbs is a ketogenic-style split. Good for some people, but requires adaptation.',
  macroInsightLowCarbs: 'Under 80g of carbs puts you in low-carb territory. Brain and high-intensity workouts run best on carbs.',
  macroInsightBalanced: 'Well-balanced split. Good protein for muscle, enough fat for hormones, and carbs for energy.',

  apiKeyWhatIsThis: 'Uff, what is an API key?',
  apiKeyExplainTitle: 'What is an API key?',
  apiKeyExplainBody: 'An API key is a free password that lets this app talk to Google\'s AI. You create it in about 30 seconds — no credit card needed.',
  apiKeyExplainStep1: 'Go to aistudio.google.com and sign in with any Google account',
  apiKeyExplainStep2: 'Click "Create API key" and copy the key (starts with AIza...)',
  apiKeyExplainStep3: 'Paste the key here and tap Save',
  apiKeyExplainGotIt: 'Got it',
  apiKeyQuotaNote: 'Free tier: 1,500 requests/day. Normal personal use (3–10 meals/day) stays well under 100.',
  apiKeyViewUsage: 'View your usage in AI Studio',

  clearAllDataArchiveDesc: 'Your data will be archived (not permanently deleted) and you will be returned to the setup screen. You can contact support to recover archived data.',
  archiveEverything: 'Archive & reset',
};

const ru: Translations = {
  save: 'Сохранить',
  cancel: 'Отмена',
  delete: 'Удалить',
  noData: 'Нет данных',

  navToday: 'Сегодня',
  navLog: 'Записать',
  navHistory: 'История',
  navBody: 'Тело',
  navCharts: 'Графики',
  navSettings: 'Настройки',

  bodyNudgeText: 'Нет измерений тела за последние 2 недели. Запишите, чтобы отслеживать прогресс.',
  bodyNudgeAction: 'Записать',

  today: 'Сегодня',
  mealsToday: 'Приёмы пищи',
  noMealsYet: 'Сегодня ничего не записано.',
  logFirstMeal: 'Записать первый приём →',
  calories: 'Калории',
  protein: 'Белки',
  carbs: 'Углеводы',
  fat: 'Жиры',

  logMeal: 'Записать приём пищи',
  chatWelcome: 'Опишите, что вы ели — я посчитаю макросы. Или задайте любой вопрос о питании.',
  chatSuggestionLogMeal: '2 яйца и тост 🍳',
  chatSuggestionHowAmIDoing: 'Как я питаюсь сегодня? 📊',
  chatSuggestionProtein: 'Достаточно ли у меня белка?',
  chatSuggestionSummary: 'Итоги недели',
  chatSuggestionWeightLoss: 'Когда я наконец похудею? ⚖️',
  describeWhatYouAte: 'Опишите, что вы ели...',
  analyzing: 'Анализирую...',
  gotIt: 'Понял! Вот что нашёл:',
  hereIsWhatIFound: 'Вот что нашёл:',
  total: 'Итого',
  saveBtn: 'Сохранить',
  discard: 'Отменить',
  logManually: 'Ввести вручную',
  foodName: 'Название продукта',
  saveManually: 'Сохранить вручную',
  offlineManualEntry: 'Офлайн — ручной ввод',
  noApiKey: 'Ключ Gemini API не настроен. Перейдите в Настройки.',
  invalidApiKey: 'Неверный API-ключ. Он должен начинаться с «AIza».',
  rateLimit: 'Превышена квота API. Введите вручную или подождите минуту.',
  parseError: 'Неожиданный ответ от Gemini. Перефразируйте или введите вручную.',

  micTapToSpeak: 'Нажмите для голосового ввода',
  micListening: 'Слушаю...',
  micNotSupported: 'Голосовой ввод не поддерживается в этом браузере.',
  photoAttached: 'Фото прикреплено',
  photoRemove: 'Удалить',
  takePhotoOrChoose: 'Сделать фото или выбрать из галереи',

  chatTitle: 'Ассистент по питанию',
  chatInputPlaceholder: 'Запишите приём пищи или задайте вопрос...',
  chatClearHistory: 'Очистить чат',
  chatClearHistoryConfirm: 'Очистить историю чата?',
  chatAnswerError: 'Не удалось получить ответ. Попробуйте ещё раз или проверьте ключ API.',

  history: 'История',
  thisWeek: 'Эта неделя',
  lastWeek: 'Прошлая неделя',
  noDataLabel: 'Нет данных',
  meals: 'приёмов',
  meal: 'приём',
  ofGoal: '% от цели',

  measurements: 'Измерения',
  logMeasurements: 'Записать измерения',
  recentLogs: 'Последние записи',
  noMeasurementsYet: 'Измерения пока не записаны.',
  logFirstMeasurement: 'Записать первое измерение →',
  notes: 'Заметки',
  optionalNotes: 'Заметки (необязательно)',
  saving: 'Сохраняю...',
  editMeal: 'Редактировать приём',
  mealDescription: 'Описание приёма',
  nutrients: 'Нутриенты',
  editSuggestion: 'Изменить',

  weight: 'Вес',
  waist: 'Талия',
  chest: 'Грудь',
  hips: 'Бёдра',
  arm: 'Рука',
  thigh: 'Бедро',

  settings: 'Настройки',
  geminiApiKey: 'Ключ Gemini API',
  pasteApiKey: 'Вставьте ваш API-ключ',
  getKeyAt: 'Получить бесплатный ключ в Google AI Studio',
  keyStoredLocally: 'Хранится локально в браузере. Никуда не передаётся, кроме API Google.',
  dailyGoals: 'Дневные цели',
  saveSettings: 'Сохранить настройки',
  saved: 'Сохранено!',
  data: 'Данные',
  exportJson: 'Экспорт данных в JSON',
  clearAllData: 'Очистить все данные',
  clearAllDataConfirm: 'Очистить все данные?',
  clearAllDataDesc: 'Это удалит все приёмы пищи и измерения. Это действие нельзя отменить.',
  deleteEverything: 'Удалить всё',
  language: 'Язык',

  apiKeySetupTitle: 'Для ИИ-записи нужен Google API-ключ',
  apiKeySetupFree: 'Это бесплатно и займёт около 30 секунд.',
  apiKeyOpenStudio: 'Открыть Google AI Studio',
  apiKeyOnceThereTitle: 'Там нужно:',
  apiKeyStep1: 'Войти через любой Google-аккаунт',
  apiKeyStep2: 'Нажать «Create API key»',
  apiKeyStep3: 'Скопировать ключ (начинается с AIza)',
  apiKeyStep4: 'Вставить его ниже и нажать «Сохранить»',
  apiKeySaveAndContinue: 'Сохранить и продолжить',

  navArticles: 'Статьи',
  articlesTitle: 'Статьи о питании',
  articlesSubtitle: 'Научно обоснованные материалы о диетологии',
  readMore: 'Читать статью',
  minRead: 'мин. чтения',
  backToArticles: '← Статьи',
  articleNotFound: 'Статья не найдена.',

  analytics: 'Аналитика',
  nutrition: 'Питание',
  body: 'Тело',
  daily30d: 'По дням (30д)',
  monthly12m: 'По месяцам (12м)',
  caloriesLast30: 'Калории — последние 30 дней',
  macrosLast30: 'Макронутриенты — последние 30 дней',
  avgCalories12m: 'Средние калории в день — 12 месяцев',
  avgMacros12m: 'Средние макронутриенты — 12 месяцев',
  chartPlaceholder: 'Здесь появятся ваши графики',
  chartPlaceholderSub: 'Запишите хотя бы 2 приёма пищи, чтобы увидеть тренды',
  last30Days: 'последние 30 дней',
  last12Months: 'последние 12 месяцев',

  onboardingWelcomeTitle: 'Добро пожаловать в Diet Tracker',
  onboardingWelcomeSubtitle: 'Легко отслеживайте питание. Опишите приём пищи, и ИИ посчитает калории и макронутриенты — или введите вручную. Все данные хранятся на устройстве.',
  onboardingGetStarted: 'Начать →',
  onboardingSkip: 'Пропустить настройку',
  onboardingNutritionTitle: 'Как работает питание',
  onboardingNutritionSubtitle: 'Еда даёт энергию через три макронутриента. Каждый играет свою роль:',
  onboardingProteinDesc: 'Строит и восстанавливает мышцы. Важен для чувства сытости. Самый важный макронутриент.',
  onboardingFatDesc: 'Поддерживает гормоны и усваивает витамины. Даёт длительное насыщение.',
  onboardingCarbsDesc: 'Основной источник энергии для тела. Питает мозг и тренировки.',
  onboardingReadFullGuide: '→ Читать полное руководство',
  onboardingBodyStatsTitle: 'Расскажите о себе',
  onboardingMale: 'Мужчина',
  onboardingFemale: 'Женщина',
  onboardingAge: 'Возраст (лет)',
  onboardingWeight: 'Вес (кг)',
  onboardingWeightHint: 'Перевод из фунтов: разделить на 2,2',
  onboardingHeight: 'Рост (см)',
  onboardingHeightHint: 'Перевод из футов/дюймов: футы × 30,5 + дюймы × 2,54',
  onboardingActivityTitle: 'Насколько вы активны?',
  onboardingActivitySedentary: 'Малоподвижный',
  onboardingActivitySedentaryDesc: 'Сидячая работа, почти нет тренировок',
  onboardingActivityLight: 'Умеренно активный',
  onboardingActivityLightDesc: 'Лёгкие тренировки 1–3 дня в неделю',
  onboardingActivityModerate: 'Активный',
  onboardingActivityModerateDesc: 'Умеренные тренировки 3–5 дней в неделю',
  onboardingActivityActive: 'Очень активный',
  onboardingActivityActiveDesc: 'Интенсивные тренировки 6–7 дней в неделю',
  onboardingActivityVeryActive: 'Чрезвычайно активный',
  onboardingActivityVeryActiveDesc: 'Физический труд или двойные тренировки',
  onboardingGoalTitle: 'Какова ваша цель?',
  onboardingGoalLose: 'Похудеть',
  onboardingGoalLoseDesc: 'Есть ~400 ккал меньше, чем сжигаете',
  onboardingGoalMaintain: 'Поддерживать вес',
  onboardingGoalMaintainDesc: 'Есть примерно столько, сколько сжигаете',
  onboardingGoalGain: 'Набрать мышечную массу',
  onboardingGoalGainDesc: 'Есть ~250 ккал больше, чем сжигаете',
  onboardingResultsTitle: 'Ваши дневные цели',
  onboardingTdeeLabel: 'Ваши поддерживающие калории (TDEE):',
  onboardingAdjustMacros: 'Настроить макронутриенты',
  onboardingCarbsDerived: 'Углеводы (рассчитываются автоматически)',
  onboardingLowCarbsWarning: 'Углеводов очень мало. Попробуйте немного снизить белки или жиры.',
  onboardingDoneTitle: 'Всё готово!',
  onboardingDoneSummary: 'Ваша дневная цель:',
  onboardingStartTracking: 'Начать отслеживать →',
  onboardingNext: 'Далее →',
  onboardingBack: '← Назад',
  onboardingValidationAge: 'Введите корректный возраст (10–99)',
  onboardingValidationWeight: 'Введите корректный вес (30–300 кг)',
  onboardingValidationHeight: 'Введите корректный рост (100–250 см)',

  macroInsightLowProtein: 'Мало белка — риск потери мышечной массы и плохого восстановления. Старайтесь получать хотя бы 1,2г на кг веса.',
  macroInsightHighProtein: 'Много белка помогает сохранять мышцы и дольше насыщает. Отличный выбор для активного образа жизни.',
  macroInsightLowFat: 'Очень мало жиров может нарушить выработку гормонов и усвоение жирорастворимых витаминов (A, D, E, K).',
  macroInsightHighFat: 'Много жиров при малом количестве углеводов — это кетогенная диета. Подходит некоторым, но требует адаптации.',
  macroInsightLowCarbs: 'Менее 80г углеводов — это низкоуглеводный режим. Мозг и интенсивные тренировки лучше работают на углеводах.',
  macroInsightBalanced: 'Сбалансированное распределение. Достаточно белка для мышц, жиров для гормонов и углеводов для энергии.',

  apiKeyWhatIsThis: 'Что такое API-ключ?',
  apiKeyExplainTitle: 'Что такое API-ключ?',
  apiKeyExplainBody: 'API-ключ — это бесплатный пароль, позволяющий приложению общаться с ИИ Google. Создаётся за 30 секунд — без банковской карты.',
  apiKeyExplainStep1: 'Перейдите на aistudio.google.com и войдите через Google-аккаунт',
  apiKeyExplainStep2: 'Нажмите «Create API key» и скопируйте ключ (начинается с AIza...)',
  apiKeyExplainStep3: 'Вставьте ключ здесь и нажмите «Сохранить»',
  apiKeyExplainGotIt: 'Понятно',
  apiKeyQuotaNote: 'Бесплатный лимит: 1 500 запросов в день. Для личного использования (3–10 приёмов пищи) хватит с запасом.',
  apiKeyViewUsage: 'Посмотреть расход в AI Studio',

  clearAllDataArchiveDesc: 'Данные будут заархивированы (не удалены навсегда), и вы вернётесь к экрану настройки. Архивные данные можно восстановить.',
  archiveEverything: 'Архивировать и сбросить',
};

const cs: Translations = {
  save: 'Uložit',
  cancel: 'Zrušit',
  delete: 'Smazat',
  noData: 'Žádná data',

  navToday: 'Dnes',
  navLog: 'Záznam',
  navHistory: 'Historie',
  navBody: 'Tělo',
  navCharts: 'Grafy',
  navSettings: 'Nastavení',

  bodyNudgeText: 'Žádná tělesná měření za poslední 2 týdny. Zaznamenejte pro sledování pokroku.',
  bodyNudgeAction: 'Zaznamenat',

  today: 'Dnes',
  mealsToday: 'Jídla dnes',
  noMealsYet: 'Dnes zatím žádné jídlo nezaznamenáno.',
  logFirstMeal: 'Zaznamenat první jídlo →',
  calories: 'Kalorie',
  protein: 'Bílkoviny',
  carbs: 'Sacharidy',
  fat: 'Tuky',

  logMeal: 'Zaznamenat jídlo',
  chatWelcome: 'Popište, co jste jedli, a já spočítám makra — nebo se mě zeptejte na cokoliv o výživě.',
  chatSuggestionLogMeal: '2 vejce a toast 🍳',
  chatSuggestionHowAmIDoing: 'Jak se dnes stravuji? 📊',
  chatSuggestionProtein: 'Mám dostatek bílkovin?',
  chatSuggestionSummary: 'Shrnutí tohoto týdne',
  chatSuggestionWeightLoss: 'Kdy konečně zhubnu? ⚖️',
  describeWhatYouAte: 'Popište, co jste jedli...',
  analyzing: 'Analyzuji...',
  gotIt: 'Rozumím! Tady je, co jsem našel:',
  hereIsWhatIFound: 'Tady je, co jsem našel:',
  total: 'Celkem',
  saveBtn: 'Uložit',
  discard: 'Zrušit',
  logManually: 'Zadat ručně',
  foodName: 'Název jídla',
  saveManually: 'Uložit ručně',
  offlineManualEntry: 'Offline — ruční zadání',
  noApiKey: 'Klíč Gemini API není nastaven. Přejděte do Nastavení.',
  invalidApiKey: 'Neplatný API klíč. Měl by začínat "AIza".',
  rateLimit: 'Překročena kvóta API. Zadejte ručně nebo zkuste za chvíli.',
  parseError: 'Neočekávaná odpověď od Gemini. Přeformulujte nebo zadejte ručně.',

  micTapToSpeak: 'Klepněte pro hlasový vstup',
  micListening: 'Poslouchám...',
  micNotSupported: 'Rozpoznávání řeči není v tomto prohlížeči podporováno.',
  photoAttached: 'Foto přiloženo',
  photoRemove: 'Odebrat',
  takePhotoOrChoose: 'Vyfotografujte nebo vyberte z galerie',

  chatTitle: 'Nutriční asistent',
  chatInputPlaceholder: 'Zaznamenejte jídlo nebo se zeptejte...',
  chatClearHistory: 'Smazat chat',
  chatClearHistoryConfirm: 'Smazat historii chatu?',
  chatAnswerError: 'Odpověď se nepodařilo získat. Zkuste znovu nebo zkontrolujte API klíč.',

  history: 'Historie',
  thisWeek: 'Tento týden',
  lastWeek: 'Minulý týden',
  noDataLabel: 'Žádná data',
  meals: 'jídel',
  meal: 'jídlo',
  ofGoal: '% cíle',

  measurements: 'Měření',
  logMeasurements: 'Zaznamenat měření',
  recentLogs: 'Poslední záznamy',
  noMeasurementsYet: 'Zatím žádná měření.',
  logFirstMeasurement: 'Zaznamenat první měření →',
  notes: 'Poznámky',
  optionalNotes: 'Poznámky (volitelné)',
  saving: 'Ukládám...',
  editMeal: 'Upravit jídlo',
  mealDescription: 'Popis jídla',
  nutrients: 'Živiny',
  editSuggestion: 'Upravit',

  weight: 'Hmotnost',
  waist: 'Pas',
  chest: 'Hrudník',
  hips: 'Boky',
  arm: 'Paže',
  thigh: 'Stehno',

  settings: 'Nastavení',
  geminiApiKey: 'Klíč Gemini API',
  pasteApiKey: 'Vložte váš API klíč',
  getKeyAt: 'Získejte klíč zdarma v Google AI Studio',
  keyStoredLocally: 'Uloženo pouze lokálně. Nikam se neposílá kromě Google API.',
  dailyGoals: 'Denní cíle',
  saveSettings: 'Uložit nastavení',
  saved: 'Uloženo!',
  data: 'Data',
  exportJson: 'Exportovat data jako JSON',
  clearAllData: 'Smazat vše',
  clearAllDataConfirm: 'Smazat všechna data?',
  clearAllDataDesc: 'Trvale smaže všechna jídla a měření. Nelze vrátit zpět.',
  deleteEverything: 'Smazat vše',
  language: 'Jazyk',

  apiKeySetupTitle: 'AI záznam potřebuje Google API klíč',
  apiKeySetupFree: 'Je to zdarma a zabere asi 30 sekund.',
  apiKeyOpenStudio: 'Otevřít Google AI Studio',
  apiKeyOnceThereTitle: 'Tam je potřeba:',
  apiKeyStep1: 'Přihlásit se libovolným Google účtem',
  apiKeyStep2: 'Klepnout na „Create API key"',
  apiKeyStep3: 'Zkopírovat klíč (začíná AIza)',
  apiKeyStep4: 'Vložit ho níže a klepnout na Uložit',
  apiKeySaveAndContinue: 'Uložit a pokračovat',

  navArticles: 'Články',
  articlesTitle: 'Nutriční průvodci',
  articlesSubtitle: 'Vědecky podložené články o výživě',
  readMore: 'Číst článek',
  minRead: 'min čtení',
  backToArticles: '← Články',
  articleNotFound: 'Článek nenalezen.',

  analytics: 'Analytika',
  nutrition: 'Výživa',
  body: 'Tělo',
  daily30d: 'Denně (30d)',
  monthly12m: 'Měsíčně (12m)',
  caloriesLast30: 'Kalorie — posledních 30 dní',
  macrosLast30: 'Makronutrienty — posledních 30 dní',
  avgCalories12m: 'Průměrné denní kalorie — 12 měsíců',
  avgMacros12m: 'Průměrné makronutrienty — 12 měsíců',
  chartPlaceholder: 'Vaše grafy se zobrazí zde',
  chartPlaceholderSub: 'Zaznamenejte alespoň 2 jídla, abyste viděli trendy',
  last30Days: 'posledních 30 dní',
  last12Months: 'posledních 12 měsíců',

  onboardingWelcomeTitle: 'Vítejte v Diet Tracker',
  onboardingWelcomeSubtitle: 'Sledujte výživu snadno. Popište jídlo a AI spočítá kalorie a makra — nebo zadejte ručně. Vše zůstává v zařízení.',
  onboardingGetStarted: 'Začít →',
  onboardingSkip: 'Přeskočit nastavení',
  onboardingNutritionTitle: 'Jak funguje výživa',
  onboardingNutritionSubtitle: 'Jídlo poskytuje energii prostřednictvím tří makronutrientů:',
  onboardingProteinDesc: 'Buduje a opravuje svaly. Pomáhá zasytit. Nejdůležitější makronutrient.',
  onboardingFatDesc: 'Podporuje hormony a vstřebávání vitamínů. Zajišťuje delší sytost.',
  onboardingCarbsDesc: 'Primární zdroj energie. Pohání mozek i trénink.',
  onboardingReadFullGuide: '→ Přečíst celého průvodce',
  onboardingBodyStatsTitle: 'Řekněte nám o sobě',
  onboardingMale: 'Muž',
  onboardingFemale: 'Žena',
  onboardingAge: 'Věk (roky)',
  onboardingWeight: 'Hmotnost (kg)',
  onboardingWeightHint: 'Převod z liber: vydělit 2,2',
  onboardingHeight: 'Výška (cm)',
  onboardingHeightHint: 'Převod ze stop/palců: stopy × 30,5 + palce × 2,54',
  onboardingActivityTitle: 'Jak jste aktivní?',
  onboardingActivitySedentary: 'Sedavý',
  onboardingActivitySedentaryDesc: 'Kancelářská práce, téměř žádný pohyb',
  onboardingActivityLight: 'Mírně aktivní',
  onboardingActivityLightDesc: 'Lehké cvičení 1–3 dny v týdnu',
  onboardingActivityModerate: 'Středně aktivní',
  onboardingActivityModerateDesc: 'Umírněné cvičení 3–5 dní v týdnu',
  onboardingActivityActive: 'Aktivní',
  onboardingActivityActiveDesc: 'Intenzivní cvičení 6–7 dní v týdnu',
  onboardingActivityVeryActive: 'Velmi aktivní',
  onboardingActivityVeryActiveDesc: 'Fyzická práce nebo dvojí trénink',
  onboardingGoalTitle: 'Jaký je váš cíl?',
  onboardingGoalLose: 'Zhubnout',
  onboardingGoalLoseDesc: 'Jíst ~400 kcal méně, než spálíte',
  onboardingGoalMaintain: 'Udržet váhu',
  onboardingGoalMaintainDesc: 'Jíst přibližně tolik, kolik spálíte',
  onboardingGoalGain: 'Nabrat svaly',
  onboardingGoalGainDesc: 'Jíst ~250 kcal více, než spálíte',
  onboardingResultsTitle: 'Vaše denní cíle',
  onboardingTdeeLabel: 'Vaše udržovací kalorie (TDEE):',
  onboardingAdjustMacros: 'Upravit makronutrienty',
  onboardingCarbsDerived: 'Sacharidy (vypočítány automaticky)',
  onboardingLowCarbsWarning: 'Sacharidů je velmi málo. Zkuste mírně snížit bílkoviny nebo tuky.',
  onboardingDoneTitle: 'Vše je připraveno!',
  onboardingDoneSummary: 'Váš denní cíl:',
  onboardingStartTracking: 'Začít sledovat →',
  onboardingNext: 'Dále →',
  onboardingBack: '← Zpět',
  onboardingValidationAge: 'Zadejte platný věk (10–99)',
  onboardingValidationWeight: 'Zadejte platnou hmotnost (30–300 kg)',
  onboardingValidationHeight: 'Zadejte platnou výšku (100–250 cm)',

  macroInsightLowProtein: 'Málo bílkovin může vést ke ztrátě svalové hmoty a špatnému zotavení. Snažte se o alespoň 1,2g na kg tělesné hmotnosti.',
  macroInsightHighProtein: 'Vysoký příjem bílkovin pomáhá zachovat svaly a udržuje sytost. Skvělá volba pro aktivní životní styl.',
  macroInsightLowFat: 'Velmi málo tuků může narušit produkci hormonů a vstřebávání vitamínů rozpustných v tucích (A, D, E, K).',
  macroInsightHighFat: 'Hodně tuků s málo sacharidy je ketogenní styl. Pro někoho vhodné, ale vyžaduje adaptaci.',
  macroInsightLowCarbs: 'Méně než 80g sacharidů je nízkosacharidový režim. Mozek a intenzivní tréninky fungují nejlépe na sacharidech.',
  macroInsightBalanced: 'Vyvážené rozložení. Dostatek bílkovin pro svaly, tuků pro hormony a sacharidů pro energii.',

  apiKeyWhatIsThis: 'Co je to API klíč?',
  apiKeyExplainTitle: 'Co je to API klíč?',
  apiKeyExplainBody: 'API klíč je bezplatné heslo, které umožňuje aplikaci komunikovat s AI od Google. Vytvoříte ho za 30 sekund — bez platební karty.',
  apiKeyExplainStep1: 'Přejděte na aistudio.google.com a přihlaste se Google účtem',
  apiKeyExplainStep2: 'Klikněte na „Create API key" a zkopírujte klíč (začíná AIza...)',
  apiKeyExplainStep3: 'Vložte klíč zde a klepněte na Uložit',
  apiKeyExplainGotIt: 'Rozumím',
  apiKeyQuotaNote: 'Bezplatný limit: 1 500 požadavků/den. Běžné osobní použití (3–10 jídel/den) je hluboko pod 100.',
  apiKeyViewUsage: 'Zobrazit využití v AI Studio',

  clearAllDataArchiveDesc: 'Vaše data budou archivována (ne trvale smazána) a vrátíte se na obrazovku nastavení.',
  archiveEverything: 'Archivovat a resetovat',
};

const de: Translations = {
  save: 'Speichern',
  cancel: 'Abbrechen',
  delete: 'Löschen',
  noData: 'Keine Daten',

  navToday: 'Heute',
  navLog: 'Erfassen',
  navHistory: 'Verlauf',
  navBody: 'Körper',
  navCharts: 'Charts',
  navSettings: 'Einstellungen',

  bodyNudgeText: 'Keine Körpermessungen in den letzten 2 Wochen. Erfassen Sie jetzt, um Fortschritte zu verfolgen.',
  bodyNudgeAction: 'Jetzt erfassen',

  today: 'Heute',
  mealsToday: 'Heutige Mahlzeiten',
  noMealsYet: 'Heute noch keine Mahlzeiten erfasst.',
  logFirstMeal: 'Erste Mahlzeit erfassen →',
  calories: 'Kalorien',
  protein: 'Protein',
  carbs: 'Kohlenhydrate',
  fat: 'Fett',

  logMeal: 'Mahlzeit erfassen',
  chatWelcome: 'Beschreiben Sie, was Sie gegessen haben — ich berechne die Makros. Oder stellen Sie mir Fragen zur Ernährung.',
  chatSuggestionLogMeal: '2 Eier und Toast 🍳',
  chatSuggestionHowAmIDoing: 'Wie läuft es heute? 📊',
  chatSuggestionProtein: 'Nehme ich genug Protein zu mir?',
  chatSuggestionSummary: 'Zusammenfassung dieser Woche',
  chatSuggestionWeightLoss: 'Wann nehme ich endlich ab? ⚖️',
  describeWhatYouAte: 'Beschreiben Sie, was Sie gegessen haben...',
  analyzing: 'Analysiere...',
  gotIt: 'Verstanden! Hier ist, was ich gefunden habe:',
  hereIsWhatIFound: 'Hier ist, was ich gefunden habe:',
  total: 'Gesamt',
  saveBtn: 'Speichern',
  discard: 'Verwerfen',
  logManually: 'Manuell eingeben',
  foodName: 'Lebensmittelname',
  saveManually: 'Manuell speichern',
  offlineManualEntry: 'Offline — manuelle Eingabe',
  noApiKey: 'Kein Gemini API-Schlüssel konfiguriert. Gehen Sie zu Einstellungen.',
  invalidApiKey: 'Ungültiger API-Schlüssel. Er sollte mit "AIza" beginnen.',
  rateLimit: 'API-Kontingent überschritten. Manuell eingeben oder in einer Minute erneut versuchen.',
  parseError: 'Unerwartete Antwort von Gemini. Umformulieren oder manuell eingeben.',

  micTapToSpeak: 'Zum Sprechen tippen',
  micListening: 'Höre zu...',
  micNotSupported: 'Spracherkennung wird in diesem Browser nicht unterstützt.',
  photoAttached: 'Foto angehängt',
  photoRemove: 'Entfernen',
  takePhotoOrChoose: 'Foto aufnehmen oder aus Galerie wählen',

  chatTitle: 'Ernährungs-Assistent',
  chatInputPlaceholder: 'Mahlzeit erfassen oder Frage stellen...',
  chatClearHistory: 'Chat löschen',
  chatClearHistoryConfirm: 'Chatverlauf löschen?',
  chatAnswerError: 'Antwort konnte nicht abgerufen werden. Erneut versuchen oder API-Schlüssel prüfen.',

  history: 'Verlauf',
  thisWeek: 'Diese Woche',
  lastWeek: 'Letzte Woche',
  noDataLabel: 'Keine Daten',
  meals: 'Mahlzeiten',
  meal: 'Mahlzeit',
  ofGoal: '% des Ziels',

  measurements: 'Messungen',
  logMeasurements: 'Messungen erfassen',
  recentLogs: 'Letzte Einträge',
  noMeasurementsYet: 'Noch keine Messungen erfasst.',
  logFirstMeasurement: 'Erste Messung erfassen →',
  notes: 'Notizen',
  optionalNotes: 'Notizen (optional)',
  saving: 'Speichern...',
  editMeal: 'Mahlzeit bearbeiten',
  mealDescription: 'Mahlzeitbeschreibung',
  nutrients: 'Nährstoffe',
  editSuggestion: 'Bearbeiten',

  weight: 'Gewicht',
  waist: 'Taille',
  chest: 'Brust',
  hips: 'Hüfte',
  arm: 'Arm',
  thigh: 'Oberschenkel',

  settings: 'Einstellungen',
  geminiApiKey: 'Gemini API-Schlüssel',
  pasteApiKey: 'API-Schlüssel einfügen',
  getKeyAt: 'Kostenlosen Schlüssel bei Google AI Studio holen',
  keyStoredLocally: 'Nur lokal gespeichert. Wird nirgendwo außer Google API gesendet.',
  dailyGoals: 'Tagesziele',
  saveSettings: 'Einstellungen speichern',
  saved: 'Gespeichert!',
  data: 'Daten',
  exportJson: 'Daten als JSON exportieren',
  clearAllData: 'Alle Daten löschen',
  clearAllDataConfirm: 'Alle Daten löschen?',
  clearAllDataDesc: 'Löscht alle Mahlzeiten und Messungen dauerhaft. Kann nicht rückgängig gemacht werden.',
  deleteEverything: 'Alles löschen',
  language: 'Sprache',

  apiKeySetupTitle: 'KI-Protokollierung benötigt einen Google API-Schlüssel',
  apiKeySetupFree: 'Es ist kostenlos und dauert etwa 30 Sekunden.',
  apiKeyOpenStudio: 'Google AI Studio öffnen',
  apiKeyOnceThereTitle: 'Dort:',
  apiKeyStep1: 'Mit einem beliebigen Google-Konto anmelden',
  apiKeyStep2: 'Auf „Create API key" tippen',
  apiKeyStep3: 'Den Schlüssel kopieren (beginnt mit AIza)',
  apiKeyStep4: 'Hier einfügen und Speichern tippen',
  apiKeySaveAndContinue: 'Speichern & fortfahren',

  navArticles: 'Lernen',
  articlesTitle: 'Ernährungsratgeber',
  articlesSubtitle: 'Wissenschaftlich fundierte Artikel zur Ernährung',
  readMore: 'Artikel lesen',
  minRead: 'Min. Lesezeit',
  backToArticles: '← Artikel',
  articleNotFound: 'Artikel nicht gefunden.',

  analytics: 'Analytik',
  nutrition: 'Ernährung',
  body: 'Körper',
  daily30d: 'Täglich (30T)',
  monthly12m: 'Monatlich (12M)',
  caloriesLast30: 'Kalorien — letzte 30 Tage',
  macrosLast30: 'Makros — letzte 30 Tage',
  avgCalories12m: 'Ø Tägliche Kalorien — 12 Monate',
  avgMacros12m: 'Ø Tägliche Makros — 12 Monate',
  chartPlaceholder: 'Ihre Charts erscheinen hier',
  chartPlaceholderSub: 'Erfassen Sie mindestens 2 Mahlzeiten für Trends',
  last30Days: 'letzte 30 Tage',
  last12Months: 'letzte 12 Monate',

  onboardingWelcomeTitle: 'Willkommen bei Diet Tracker',
  onboardingWelcomeSubtitle: 'Verfolgen Sie Ihre Ernährung mühelos. Beschreiben Sie Mahlzeiten in natürlicher Sprache und die KI berechnet Kalorien und Makros — oder manuell eingeben. Alles bleibt auf Ihrem Gerät.',
  onboardingGetStarted: 'Loslegen →',
  onboardingSkip: 'Einrichtung überspringen',
  onboardingNutritionTitle: 'Wie Ernährung funktioniert',
  onboardingNutritionSubtitle: 'Essen liefert Energie durch drei Makronährstoffe:',
  onboardingProteinDesc: 'Baut Muskeln auf und repariert sie. Wichtig für Sättigung. Der wichtigste Makronährstoff.',
  onboardingFatDesc: 'Unterstützt Hormone und Vitaminaufnahme. Hält länger satt.',
  onboardingCarbsDesc: 'Bevorzugter Brennstoff des Körpers. Treibt Gehirn und Training an.',
  onboardingReadFullGuide: '→ Vollständigen Leitfaden lesen',
  onboardingBodyStatsTitle: 'Erzählen Sie uns von sich',
  onboardingMale: 'Mann',
  onboardingFemale: 'Frau',
  onboardingAge: 'Alter (Jahre)',
  onboardingWeight: 'Gewicht (kg)',
  onboardingWeightHint: 'Umrechnung aus Pfund: durch 2,2 dividieren',
  onboardingHeight: 'Größe (cm)',
  onboardingHeightHint: 'Umrechnung aus Fuß/Zoll: Fuß × 30,5 + Zoll × 2,54',
  onboardingActivityTitle: 'Wie aktiv sind Sie?',
  onboardingActivitySedentary: 'Sitzend',
  onboardingActivitySedentaryDesc: 'Büroarbeit, kaum Sport',
  onboardingActivityLight: 'Leicht aktiv',
  onboardingActivityLightDesc: 'Leichter Sport 1–3 Tage/Woche',
  onboardingActivityModerate: 'Mäßig aktiv',
  onboardingActivityModerateDesc: 'Moderater Sport 3–5 Tage/Woche',
  onboardingActivityActive: 'Aktiv',
  onboardingActivityActiveDesc: 'Intensiver Sport 6–7 Tage/Woche',
  onboardingActivityVeryActive: 'Sehr aktiv',
  onboardingActivityVeryActiveDesc: 'Körperliche Arbeit oder doppeltes Training',
  onboardingGoalTitle: 'Was ist Ihr Ziel?',
  onboardingGoalLose: 'Abnehmen',
  onboardingGoalLoseDesc: '~400 kcal weniger als verbraucht essen',
  onboardingGoalMaintain: 'Gewicht halten',
  onboardingGoalMaintainDesc: 'Ungefähr so viel essen wie verbraucht',
  onboardingGoalGain: 'Muskeln aufbauen',
  onboardingGoalGainDesc: '~250 kcal mehr als verbraucht essen',
  onboardingResultsTitle: 'Ihre Tagesziele',
  onboardingTdeeLabel: 'Ihre Erhaltungskalorien (TDEE):',
  onboardingAdjustMacros: 'Makros anpassen',
  onboardingCarbsDerived: 'Kohlenhydrate (automatisch berechnet)',
  onboardingLowCarbsWarning: 'Sehr wenig Kohlenhydrate. Erwägen Sie, Protein oder Fett leicht zu reduzieren.',
  onboardingDoneTitle: 'Alles bereit!',
  onboardingDoneSummary: 'Ihr Tagesziel:',
  onboardingStartTracking: 'Tracking starten →',
  onboardingNext: 'Weiter →',
  onboardingBack: '← Zurück',
  onboardingValidationAge: 'Bitte ein gültiges Alter eingeben (10–99)',
  onboardingValidationWeight: 'Bitte ein gültiges Gewicht eingeben (30–300 kg)',
  onboardingValidationHeight: 'Bitte eine gültige Größe eingeben (100–250 cm)',

  macroInsightLowProtein: 'Zu wenig Protein kann zu Muskelverlust und schlechter Erholung führen. Mindestens 1,2g pro kg Körpergewicht anstreben.',
  macroInsightHighProtein: 'Viel Protein hilft, Muskeln zu erhalten und macht länger satt. Ideal für aktive Lebensweise.',
  macroInsightLowFat: 'Sehr wenig Fett kann die Hormonproduktion stören und die Aufnahme fettlöslicher Vitamine (A, D, E, K) beeinträchtigen.',
  macroInsightHighFat: 'Viel Fett bei wenig Kohlenhydraten ist ein ketogener Ansatz. Für manche geeignet, braucht aber Anpassungszeit.',
  macroInsightLowCarbs: 'Unter 80g Kohlenhydrate ist Low-Carb-Bereich. Gehirn und intensive Workouts laufen am besten mit Kohlenhydraten.',
  macroInsightBalanced: 'Ausgewogene Verteilung. Genug Protein für Muskeln, Fett für Hormone und Kohlenhydrate für Energie.',

  apiKeyWhatIsThis: 'Was ist ein API-Schlüssel?',
  apiKeyExplainTitle: 'Was ist ein API-Schlüssel?',
  apiKeyExplainBody: 'Ein API-Schlüssel ist ein kostenloses Passwort, das der App erlaubt, mit Googles KI zu kommunizieren. Erstellt in 30 Sekunden — keine Kreditkarte nötig.',
  apiKeyExplainStep1: 'Gehen Sie zu aistudio.google.com und melden Sie sich mit einem Google-Konto an',
  apiKeyExplainStep2: 'Klicken Sie auf „Create API key" und kopieren Sie den Schlüssel (beginnt mit AIza...)',
  apiKeyExplainStep3: 'Fügen Sie den Schlüssel hier ein und tippen Sie auf Speichern',
  apiKeyExplainGotIt: 'Verstanden',
  apiKeyQuotaNote: 'Kostenloses Kontingent: 1.500 Anfragen/Tag. Normaler persönlicher Gebrauch (3–10 Mahlzeiten/Tag) bleibt weit unter 100.',
  apiKeyViewUsage: 'Nutzung in AI Studio ansehen',

  clearAllDataArchiveDesc: 'Ihre Daten werden archiviert (nicht dauerhaft gelöscht) und Sie kehren zum Einrichtungsbildschirm zurück.',
  archiveEverything: 'Archivieren & zurücksetzen',
};

const fr: Translations = {
  save: 'Enregistrer',
  cancel: 'Annuler',
  delete: 'Supprimer',
  noData: 'Aucune donnée',

  navToday: 'Aujourd\'hui',
  navLog: 'Saisir',
  navHistory: 'Historique',
  navBody: 'Corps',
  navCharts: 'Graphiques',
  navSettings: 'Paramètres',

  bodyNudgeText: 'Aucune mesure corporelle depuis 2 semaines. Enregistrez pour suivre vos progrès.',
  bodyNudgeAction: 'Enregistrer',

  today: 'Aujourd\'hui',
  mealsToday: 'Repas aujourd\'hui',
  noMealsYet: 'Aucun repas enregistré aujourd\'hui.',
  logFirstMeal: 'Enregistrer le premier repas →',
  calories: 'Calories',
  protein: 'Protéines',
  carbs: 'Glucides',
  fat: 'Lipides',

  logMeal: 'Saisir un repas',
  chatWelcome: 'Décrivez ce que vous avez mangé et je calculerai les macros — ou posez-moi n\'importe quelle question sur votre nutrition.',
  chatSuggestionLogMeal: '2 œufs et toast 🍳',
  chatSuggestionHowAmIDoing: 'Comment je m\'en sors aujourd\'hui ? 📊',
  chatSuggestionProtein: 'Mon apport en protéines est-il suffisant ?',
  chatSuggestionSummary: 'Résumé de cette semaine',
  chatSuggestionWeightLoss: 'Quand vais-je enfin maigrir ? ⚖️',
  describeWhatYouAte: 'Décrivez ce que vous avez mangé...',
  analyzing: 'Analyse en cours...',
  gotIt: 'Compris ! Voici ce que j\'ai trouvé :',
  hereIsWhatIFound: 'Voici ce que j\'ai trouvé :',
  total: 'Total',
  saveBtn: 'Enregistrer',
  discard: 'Annuler',
  logManually: 'Saisir manuellement',
  foodName: 'Nom de l\'aliment',
  saveManually: 'Enregistrer manuellement',
  offlineManualEntry: 'Hors ligne — saisie manuelle',
  noApiKey: 'Clé API Gemini non configurée. Allez dans Paramètres.',
  invalidApiKey: 'Clé API invalide. Elle doit commencer par "AIza".',
  rateLimit: 'Quota API dépassé. Saisir manuellement ou réessayer dans une minute.',
  parseError: 'Réponse inattendue de Gemini. Reformulez ou saisissez manuellement.',

  micTapToSpeak: 'Appuyez pour parler',
  micListening: 'Écoute en cours...',
  micNotSupported: 'La reconnaissance vocale n\'est pas prise en charge dans ce navigateur.',
  photoAttached: 'Photo jointe',
  photoRemove: 'Supprimer',
  takePhotoOrChoose: 'Prendre une photo ou choisir dans la bibliothèque',

  chatTitle: 'Assistant nutrition',
  chatInputPlaceholder: 'Enregistrer un repas ou poser une question...',
  chatClearHistory: 'Effacer le chat',
  chatClearHistoryConfirm: 'Effacer l\'historique du chat ?',
  chatAnswerError: 'Impossible d\'obtenir une réponse. Réessayez ou vérifiez votre clé API.',

  history: 'Historique',
  thisWeek: 'Cette semaine',
  lastWeek: 'Semaine dernière',
  noDataLabel: 'Aucune donnée',
  meals: 'repas',
  meal: 'repas',
  ofGoal: '% de l\'objectif',

  measurements: 'Mesures',
  logMeasurements: 'Enregistrer des mesures',
  recentLogs: 'Derniers enregistrements',
  noMeasurementsYet: 'Aucune mesure enregistrée.',
  logFirstMeasurement: 'Enregistrer la première mesure →',
  notes: 'Notes',
  optionalNotes: 'Notes (optionnel)',
  saving: 'Enregistrement...',
  editMeal: 'Modifier le repas',
  mealDescription: 'Description du repas',
  nutrients: 'Nutriments',
  editSuggestion: 'Modifier',

  weight: 'Poids',
  waist: 'Taille',
  chest: 'Poitrine',
  hips: 'Hanches',
  arm: 'Bras',
  thigh: 'Cuisse',

  settings: 'Paramètres',
  geminiApiKey: 'Clé API Gemini',
  pasteApiKey: 'Collez votre clé API',
  getKeyAt: 'Obtenez votre clé gratuite sur Google AI Studio',
  keyStoredLocally: 'Stocké localement uniquement. Jamais envoyé sauf à l\'API Google.',
  dailyGoals: 'Objectifs quotidiens',
  saveSettings: 'Enregistrer les paramètres',
  saved: 'Enregistré !',
  data: 'Données',
  exportJson: 'Exporter en JSON',
  clearAllData: 'Effacer toutes les données',
  clearAllDataConfirm: 'Effacer toutes les données ?',
  clearAllDataDesc: 'Supprime définitivement tous les repas et mesures. Irréversible.',
  deleteEverything: 'Tout supprimer',
  language: 'Langue',

  apiKeySetupTitle: "L'enregistrement IA nécessite une clé API Google",
  apiKeySetupFree: "C'est gratuit et prend environ 30 secondes.",
  apiKeyOpenStudio: 'Ouvrir Google AI Studio',
  apiKeyOnceThereTitle: 'Une fois là :',
  apiKeyStep1: 'Connectez-vous avec n\'importe quel compte Google',
  apiKeyStep2: 'Appuyez sur « Create API key »',
  apiKeyStep3: 'Copiez la clé (commence par AIza)',
  apiKeyStep4: 'Collez-la ci-dessous et appuyez sur Enregistrer',
  apiKeySaveAndContinue: 'Enregistrer & continuer',

  navArticles: 'Apprendre',
  articlesTitle: 'Guides nutrition',
  articlesSubtitle: 'Articles scientifiques sur la nutrition',
  readMore: 'Lire l\'article',
  minRead: 'min de lecture',
  backToArticles: '← Articles',
  articleNotFound: 'Article introuvable.',

  analytics: 'Analytique',
  nutrition: 'Nutrition',
  body: 'Corps',
  daily30d: 'Quotidien (30j)',
  monthly12m: 'Mensuel (12m)',
  caloriesLast30: 'Calories — 30 derniers jours',
  macrosLast30: 'Macros — 30 derniers jours',
  avgCalories12m: 'Calories quotidiennes moy. — 12 mois',
  avgMacros12m: 'Macros quotidiens moy. — 12 mois',
  chartPlaceholder: 'Vos graphiques apparaîtront ici',
  chartPlaceholderSub: 'Enregistrez au moins 2 repas pour voir les tendances',
  last30Days: '30 derniers jours',
  last12Months: '12 derniers mois',

  onboardingWelcomeTitle: 'Bienvenue dans Diet Tracker',
  onboardingWelcomeSubtitle: 'Suivez votre nutrition facilement. Décrivez vos repas en langage naturel et l\'IA calcule calories et macros — ou saisie manuelle. Tout reste sur votre appareil.',
  onboardingGetStarted: 'Commencer →',
  onboardingSkip: 'Passer la configuration',
  onboardingNutritionTitle: 'Comment fonctionne la nutrition',
  onboardingNutritionSubtitle: 'La nourriture fournit de l\'énergie via trois macronutriments :',
  onboardingProteinDesc: 'Construit et répare les muscles. Essentiel pour la satiété. Le macronutriment le plus important.',
  onboardingFatDesc: 'Soutient les hormones et absorbe les vitamines. Procure une satiété durable.',
  onboardingCarbsDesc: 'Source d\'énergie préférée du corps. Alimente le cerveau et l\'entraînement.',
  onboardingReadFullGuide: '→ Lire le guide complet',
  onboardingBodyStatsTitle: 'Parlez-nous de vous',
  onboardingMale: 'Homme',
  onboardingFemale: 'Femme',
  onboardingAge: 'Âge (années)',
  onboardingWeight: 'Poids (kg)',
  onboardingWeightHint: 'Conversion depuis les livres : diviser par 2,2',
  onboardingHeight: 'Taille (cm)',
  onboardingHeightHint: 'Conversion depuis pieds/pouces : pieds × 30,5 + pouces × 2,54',
  onboardingActivityTitle: 'Quel est votre niveau d\'activité ?',
  onboardingActivitySedentary: 'Sédentaire',
  onboardingActivitySedentaryDesc: 'Travail de bureau, peu ou pas d\'exercice',
  onboardingActivityLight: 'Légèrement actif',
  onboardingActivityLightDesc: 'Exercice léger 1–3 jours/semaine',
  onboardingActivityModerate: 'Modérément actif',
  onboardingActivityModerateDesc: 'Exercice modéré 3–5 jours/semaine',
  onboardingActivityActive: 'Actif',
  onboardingActivityActiveDesc: 'Exercice intense 6–7 jours/semaine',
  onboardingActivityVeryActive: 'Très actif',
  onboardingActivityVeryActiveDesc: 'Travail physique ou double entraînement',
  onboardingGoalTitle: 'Quel est votre objectif ?',
  onboardingGoalLose: 'Perdre du poids',
  onboardingGoalLoseDesc: 'Manger ~400 kcal de moins que vous brûlez',
  onboardingGoalMaintain: 'Maintenir le poids',
  onboardingGoalMaintainDesc: 'Manger environ ce que vous brûlez',
  onboardingGoalGain: 'Prendre de la masse',
  onboardingGoalGainDesc: 'Manger ~250 kcal de plus que vous brûlez',
  onboardingResultsTitle: 'Vos objectifs quotidiens',
  onboardingTdeeLabel: 'Vos calories de maintien (TDEE) :',
  onboardingAdjustMacros: 'Ajuster les macros',
  onboardingCarbsDerived: 'Glucides (calculés automatiquement)',
  onboardingLowCarbsWarning: 'Glucides très bas. Réduisez légèrement les protéines ou les lipides.',
  onboardingDoneTitle: 'Vous êtes prêt !',
  onboardingDoneSummary: 'Votre objectif quotidien :',
  onboardingStartTracking: 'Commencer le suivi →',
  onboardingNext: 'Suivant →',
  onboardingBack: '← Retour',
  onboardingValidationAge: 'Veuillez entrer un âge valide (10–99)',
  onboardingValidationWeight: 'Veuillez entrer un poids valide (30–300 kg)',
  onboardingValidationHeight: 'Veuillez entrer une taille valide (100–250 cm)',

  macroInsightLowProtein: 'Peu de protéines peut entraîner une perte musculaire et une mauvaise récupération. Visez au moins 1,2g par kg de poids corporel.',
  macroInsightHighProtein: 'Beaucoup de protéines aide à préserver les muscles et procure une meilleure satiété. Excellent pour un mode de vie actif.',
  macroInsightLowFat: 'Très peu de lipides peut perturber la production hormonale et réduire l\'absorption des vitamines liposolubles (A, D, E, K).',
  macroInsightHighFat: 'Beaucoup de lipides avec peu de glucides est une approche cétogène. Convient à certains mais nécessite une adaptation.',
  macroInsightLowCarbs: 'Moins de 80g de glucides vous place en régime low-carb. Le cerveau et les exercices intenses fonctionnent mieux avec des glucides.',
  macroInsightBalanced: 'Répartition équilibrée. Assez de protéines pour les muscles, de lipides pour les hormones et de glucides pour l\'énergie.',

  apiKeyWhatIsThis: 'C\'est quoi une clé API ?',
  apiKeyExplainTitle: 'C\'est quoi une clé API ?',
  apiKeyExplainBody: 'Une clé API est un mot de passe gratuit qui permet à l\'application de communiquer avec l\'IA de Google. Elle se crée en 30 secondes — sans carte bancaire.',
  apiKeyExplainStep1: 'Allez sur aistudio.google.com et connectez-vous avec un compte Google',
  apiKeyExplainStep2: 'Cliquez sur « Create API key » et copiez la clé (commence par AIza...)',
  apiKeyExplainStep3: 'Collez la clé ici et appuyez sur Enregistrer',
  apiKeyExplainGotIt: 'Compris',
  apiKeyQuotaNote: 'Quota gratuit : 1 500 requêtes/jour. Une utilisation personnelle normale (3–10 repas/jour) reste bien en dessous de 100.',
  apiKeyViewUsage: 'Voir l\'utilisation dans AI Studio',

  clearAllDataArchiveDesc: 'Vos données seront archivées (pas définitivement supprimées) et vous reviendrez à l\'écran de configuration.',
  archiveEverything: 'Archiver et réinitialiser',
};

const es: Translations = {
  save: 'Guardar',
  cancel: 'Cancelar',
  delete: 'Eliminar',
  noData: 'Sin datos',

  navToday: 'Hoy',
  navLog: 'Registrar',
  navHistory: 'Historial',
  navBody: 'Cuerpo',
  navCharts: 'Gráficos',
  navSettings: 'Ajustes',

  bodyNudgeText: 'Sin medidas corporales en las últimas 2 semanas. Regístralas para seguir tu progreso.',
  bodyNudgeAction: 'Registrar ahora',

  today: 'Hoy',
  mealsToday: 'Comidas de hoy',
  noMealsYet: 'No hay comidas registradas hoy.',
  logFirstMeal: 'Registrar primera comida →',
  calories: 'Calorías',
  protein: 'Proteína',
  carbs: 'Carbohidratos',
  fat: 'Grasa',

  logMeal: 'Registrar comida',
  chatWelcome: 'Describe lo que comiste y calcularé los macros — o hazme cualquier pregunta sobre tu nutrición.',
  chatSuggestionLogMeal: '2 huevos y tostada 🍳',
  chatSuggestionHowAmIDoing: '¿Cómo voy hoy? 📊',
  chatSuggestionProtein: '¿Tomo suficiente proteína?',
  chatSuggestionSummary: 'Resumen de esta semana',
  chatSuggestionWeightLoss: '¿Cuándo voy a adelgazar de una vez? ⚖️',
  describeWhatYouAte: 'Describe lo que comiste...',
  analyzing: 'Analizando...',
  gotIt: '¡Entendido! Esto es lo que encontré:',
  hereIsWhatIFound: 'Esto es lo que encontré:',
  total: 'Total',
  saveBtn: 'Guardar',
  discard: 'Descartar',
  logManually: 'Ingresar manualmente',
  foodName: 'Nombre del alimento',
  saveManually: 'Guardar manualmente',
  offlineManualEntry: 'Sin conexión — entrada manual',
  noApiKey: 'No hay clave API de Gemini configurada. Ve a Configuración.',
  invalidApiKey: 'Clave API inválida. Debe comenzar con "AIza".',
  rateLimit: 'Cuota de API excedida. Ingresa manualmente o intenta en un minuto.',
  parseError: 'Respuesta inesperada de Gemini. Reformula o ingresa manualmente.',

  micTapToSpeak: 'Toca para hablar',
  micListening: 'Escuchando...',
  micNotSupported: 'El reconocimiento de voz no es compatible con este navegador.',
  photoAttached: 'Foto adjunta',
  photoRemove: 'Eliminar',
  takePhotoOrChoose: 'Tomar foto o elegir de la galería',

  chatTitle: 'Asistente de nutrición',
  chatInputPlaceholder: 'Registrar una comida o hacer una pregunta...',
  chatClearHistory: 'Borrar chat',
  chatClearHistoryConfirm: '¿Borrar historial del chat?',
  chatAnswerError: 'No se pudo obtener respuesta. Inténtalo de nuevo o verifica tu clave API.',

  history: 'Historial',
  thisWeek: 'Esta semana',
  lastWeek: 'Semana pasada',
  noDataLabel: 'Sin datos',
  meals: 'comidas',
  meal: 'comida',
  ofGoal: '% del objetivo',

  measurements: 'Medidas',
  logMeasurements: 'Registrar medidas',
  recentLogs: 'Registros recientes',
  noMeasurementsYet: 'No hay medidas registradas aún.',
  logFirstMeasurement: 'Registrar primera medida →',
  notes: 'Notas',
  optionalNotes: 'Notas (opcional)',
  saving: 'Guardando...',
  editMeal: 'Editar comida',
  mealDescription: 'Descripción de la comida',
  nutrients: 'Nutrientes',
  editSuggestion: 'Editar',

  weight: 'Peso',
  waist: 'Cintura',
  chest: 'Pecho',
  hips: 'Caderas',
  arm: 'Brazo',
  thigh: 'Muslo',

  settings: 'Configuración',
  geminiApiKey: 'Clave API de Gemini',
  pasteApiKey: 'Pega tu clave API aquí',
  getKeyAt: 'Obtén tu clave gratis en Google AI Studio',
  keyStoredLocally: 'Almacenado solo localmente. Nunca se envía excepto a la API de Google.',
  dailyGoals: 'Objetivos diarios',
  saveSettings: 'Guardar configuración',
  saved: '¡Guardado!',
  data: 'Datos',
  exportJson: 'Exportar datos como JSON',
  clearAllData: 'Borrar todos los datos',
  clearAllDataConfirm: '¿Borrar todos los datos?',
  clearAllDataDesc: 'Eliminará permanentemente todas las comidas y medidas. No se puede deshacer.',
  deleteEverything: 'Eliminar todo',
  language: 'Idioma',

  apiKeySetupTitle: 'El registro con IA necesita una clave API de Google',
  apiKeySetupFree: 'Es gratis y tarda unos 30 segundos en configurarse.',
  apiKeyOpenStudio: 'Abrir Google AI Studio',
  apiKeyOnceThereTitle: 'Una vez allí:',
  apiKeyStep1: 'Inicia sesión con cualquier cuenta de Google',
  apiKeyStep2: 'Toca "Create API key"',
  apiKeyStep3: 'Copia la clave (empieza con AIza)',
  apiKeyStep4: 'Pégala abajo y toca Guardar',
  apiKeySaveAndContinue: 'Guardar y continuar',

  navArticles: 'Aprender',
  articlesTitle: 'Guías de nutrición',
  articlesSubtitle: 'Artículos científicos sobre nutrición',
  readMore: 'Leer artículo',
  minRead: 'min de lectura',
  backToArticles: '← Artículos',
  articleNotFound: 'Artículo no encontrado.',

  analytics: 'Analítica',
  nutrition: 'Nutrición',
  body: 'Cuerpo',
  daily30d: 'Diario (30d)',
  monthly12m: 'Mensual (12m)',
  caloriesLast30: 'Calorías — últimos 30 días',
  macrosLast30: 'Macros — últimos 30 días',
  avgCalories12m: 'Calorías diarias prom. — 12 meses',
  avgMacros12m: 'Macros diarios prom. — 12 meses',
  chartPlaceholder: 'Tus gráficos aparecerán aquí',
  chartPlaceholderSub: 'Registra al menos 2 comidas para ver las tendencias',
  last30Days: 'últimos 30 días',
  last12Months: 'últimos 12 meses',

  onboardingWelcomeTitle: 'Bienvenido a Diet Tracker',
  onboardingWelcomeSubtitle: 'Rastrea tu nutrición fácilmente. Describe tus comidas en lenguaje natural y la IA calcula calorías y macros — o ingresa manualmente. Todo permanece en tu dispositivo.',
  onboardingGetStarted: 'Comenzar →',
  onboardingSkip: 'Omitir configuración',
  onboardingNutritionTitle: 'Cómo funciona la nutrición',
  onboardingNutritionSubtitle: 'Los alimentos proporcionan energía a través de tres macronutrientes:',
  onboardingProteinDesc: 'Construye y repara músculos. Esencial para la saciedad. El macronutriente más importante.',
  onboardingFatDesc: 'Apoya las hormonas y absorbe vitaminas. Proporciona saciedad duradera.',
  onboardingCarbsDesc: 'La fuente de energía preferida del cuerpo. Impulsa el cerebro y los entrenamientos.',
  onboardingReadFullGuide: '→ Leer la guía completa',
  onboardingBodyStatsTitle: 'Cuéntanos sobre ti',
  onboardingMale: 'Hombre',
  onboardingFemale: 'Mujer',
  onboardingAge: 'Edad (años)',
  onboardingWeight: 'Peso (kg)',
  onboardingWeightHint: 'Conversión desde libras: dividir entre 2,2',
  onboardingHeight: 'Altura (cm)',
  onboardingHeightHint: 'Conversión desde pies/pulgadas: pies × 30,5 + pulgadas × 2,54',
  onboardingActivityTitle: '¿Qué tan activo eres?',
  onboardingActivitySedentary: 'Sedentario',
  onboardingActivitySedentaryDesc: 'Trabajo de escritorio, poco o ningún ejercicio',
  onboardingActivityLight: 'Ligeramente activo',
  onboardingActivityLightDesc: 'Ejercicio ligero 1–3 días/semana',
  onboardingActivityModerate: 'Moderadamente activo',
  onboardingActivityModerateDesc: 'Ejercicio moderado 3–5 días/semana',
  onboardingActivityActive: 'Activo',
  onboardingActivityActiveDesc: 'Ejercicio intenso 6–7 días/semana',
  onboardingActivityVeryActive: 'Muy activo',
  onboardingActivityVeryActiveDesc: 'Trabajo físico o entrenamiento doble',
  onboardingGoalTitle: '¿Cuál es tu objetivo?',
  onboardingGoalLose: 'Perder peso',
  onboardingGoalLoseDesc: 'Comer ~400 kcal menos de lo que quemas',
  onboardingGoalMaintain: 'Mantener el peso',
  onboardingGoalMaintainDesc: 'Comer aproximadamente lo que quemas',
  onboardingGoalGain: 'Ganar músculo',
  onboardingGoalGainDesc: 'Comer ~250 kcal más de lo que quemas',
  onboardingResultsTitle: 'Tus objetivos diarios',
  onboardingTdeeLabel: 'Tus calorías de mantenimiento (TDEE):',
  onboardingAdjustMacros: 'Ajustar macros',
  onboardingCarbsDerived: 'Carbohidratos (calculados automáticamente)',
  onboardingLowCarbsWarning: 'Carbohidratos muy bajos. Considera reducir proteínas o grasas ligeramente.',
  onboardingDoneTitle: '¡Estás listo!',
  onboardingDoneSummary: 'Tu objetivo diario:',
  onboardingStartTracking: 'Empezar a rastrear →',
  onboardingNext: 'Siguiente →',
  onboardingBack: '← Atrás',
  onboardingValidationAge: 'Ingresa una edad válida (10–99)',
  onboardingValidationWeight: 'Ingresa un peso válido (30–300 kg)',
  onboardingValidationHeight: 'Ingresa una altura válida (100–250 cm)',

  macroInsightLowProtein: 'Poca proteína puede causar pérdida muscular y mala recuperación. Apunta a al menos 1,2g por kg de peso corporal.',
  macroInsightHighProtein: 'Alta proteína ayuda a preservar músculo y mantiene la saciedad. Excelente para estilos de vida activos.',
  macroInsightLowFat: 'Muy poca grasa puede alterar la producción hormonal y reducir la absorción de vitaminas liposolubles (A, D, E, K).',
  macroInsightHighFat: 'Mucha grasa con pocos carbohidratos es un enfoque cetogénico. Funciona para algunos, pero requiere adaptación.',
  macroInsightLowCarbs: 'Menos de 80g de carbohidratos te sitúa en zona baja en carbos. El cerebro y los ejercicios intensos funcionan mejor con carbohidratos.',
  macroInsightBalanced: 'Distribución equilibrada. Suficiente proteína para músculos, grasa para hormonas y carbohidratos para energía.',

  apiKeyWhatIsThis: '¿Qué es una clave API?',
  apiKeyExplainTitle: '¿Qué es una clave API?',
  apiKeyExplainBody: 'Una clave API es una contraseña gratuita que permite a la app comunicarse con la IA de Google. Se crea en 30 segundos — sin tarjeta de crédito.',
  apiKeyExplainStep1: 'Ve a aistudio.google.com e inicia sesión con una cuenta de Google',
  apiKeyExplainStep2: 'Haz clic en "Create API key" y copia la clave (empieza con AIza...)',
  apiKeyExplainStep3: 'Pega la clave aquí y toca Guardar',
  apiKeyExplainGotIt: 'Entendido',
  apiKeyQuotaNote: 'Cuota gratuita: 1.500 solicitudes/día. El uso personal normal (3–10 comidas/día) queda muy por debajo de 100.',
  apiKeyViewUsage: 'Ver uso en AI Studio',

  clearAllDataArchiveDesc: 'Tus datos serán archivados (no eliminados permanentemente) y volverás a la pantalla de configuración.',
  archiveEverything: 'Archivar y restablecer',
};

const uk: Translations = {
  save: 'Зберегти',
  cancel: 'Скасувати',
  delete: 'Видалити',
  noData: 'Немає даних',

  navToday: 'Сьогодні',
  navLog: 'Записати',
  navHistory: 'Історія',
  navBody: 'Тіло',
  navCharts: 'Графіки',
  navSettings: 'Налаштування',

  bodyNudgeText: 'Немає вимірювань тіла за останні 2 тижні. Запишіть, щоб відстежувати прогрес.',
  bodyNudgeAction: 'Записати',

  today: 'Сьогодні',
  mealsToday: 'Прийоми їжі',
  noMealsYet: 'Сьогодні нічого не записано.',
  logFirstMeal: 'Записати перший прийом →',
  calories: 'Калорії',
  protein: 'Білки',
  carbs: 'Вуглеводи',
  fat: 'Жири',

  logMeal: 'Записати прийом їжі',
  chatWelcome: 'Опишіть, що ви їли — я порахую макроси. Або поставте будь-яке питання про своє харчування.',
  chatSuggestionLogMeal: '2 яйця та тост 🍳',
  chatSuggestionHowAmIDoing: 'Як я харчуюся сьогодні? 📊',
  chatSuggestionProtein: 'Чи достатньо у мене білка?',
  chatSuggestionSummary: 'Підсумок тижня',
  chatSuggestionWeightLoss: 'Коли я нарешті схудну? ⚖️',
  describeWhatYouAte: 'Опишіть, що ви їли...',
  analyzing: 'Аналізую...',
  gotIt: 'Зрозумів! Ось що знайшов:',
  hereIsWhatIFound: 'Ось що знайшов:',
  total: 'Разом',
  saveBtn: 'Зберегти',
  discard: 'Відмінити',
  logManually: 'Ввести вручну',
  foodName: 'Назва продукту',
  saveManually: 'Зберегти вручну',
  offlineManualEntry: 'Офлайн — ручне введення',
  noApiKey: 'Ключ Gemini API не налаштований. Перейдіть до Налаштувань.',
  invalidApiKey: 'Невірний API-ключ. Він має починатися з «AIza».',
  rateLimit: 'Перевищено квоту API. Введіть вручну або спробуйте за хвилину.',
  parseError: 'Несподівана відповідь від Gemini. Перефразуйте або введіть вручну.',

  micTapToSpeak: 'Натисніть для голосового вводу',
  micListening: 'Слухаю...',
  micNotSupported: 'Голосовий ввід не підтримується в цьому браузері.',
  photoAttached: 'Фото додано',
  photoRemove: 'Видалити',
  takePhotoOrChoose: 'Зробити фото або вибрати з галереї',

  chatTitle: 'Асистент з харчування',
  chatInputPlaceholder: 'Запишіть прийом їжі або поставте запитання...',
  chatClearHistory: 'Очистити чат',
  chatClearHistoryConfirm: 'Очистити історію чату?',
  chatAnswerError: 'Не вдалося отримати відповідь. Спробуйте ще раз або перевірте ключ API.',

  history: 'Історія',
  thisWeek: 'Цей тиждень',
  lastWeek: 'Минулий тиждень',
  noDataLabel: 'Немає даних',
  meals: 'прийомів',
  meal: 'прийом',
  ofGoal: '% від мети',

  measurements: 'Вимірювання',
  logMeasurements: 'Записати вимірювання',
  recentLogs: 'Останні записи',
  noMeasurementsYet: 'Вимірювань ще немає.',
  logFirstMeasurement: 'Записати перше вимірювання →',
  notes: 'Нотатки',
  optionalNotes: 'Нотатки (необов\'язково)',
  saving: 'Зберігаю...',
  editMeal: 'Редагувати прийом',
  mealDescription: 'Опис прийому',
  nutrients: 'Нутрієнти',
  editSuggestion: 'Змінити',

  weight: 'Вага',
  waist: 'Талія',
  chest: 'Груди',
  hips: 'Стегна',
  arm: 'Рука',
  thigh: 'Стегно',

  settings: 'Налаштування',
  geminiApiKey: 'Ключ Gemini API',
  pasteApiKey: 'Вставте ваш API-ключ',
  getKeyAt: 'Отримати безкоштовний ключ у Google AI Studio',
  keyStoredLocally: 'Зберігається лише локально. Нікуди не надсилається, крім API Google.',
  dailyGoals: 'Денні цілі',
  saveSettings: 'Зберегти налаштування',
  saved: 'Збережено!',
  data: 'Дані',
  exportJson: 'Експорт даних у JSON',
  clearAllData: 'Очистити всі дані',
  clearAllDataConfirm: 'Очистити всі дані?',
  clearAllDataDesc: 'Це назавжди видалить усі прийоми їжі та вимірювання. Скасувати неможливо.',
  deleteEverything: 'Видалити все',
  language: 'Мова',

  apiKeySetupTitle: 'ІІ-запис потребує Google API-ключа',
  apiKeySetupFree: 'Це безкоштовно і займе близько 30 секунд.',
  apiKeyOpenStudio: 'Відкрити Google AI Studio',
  apiKeyOnceThereTitle: 'Там потрібно:',
  apiKeyStep1: 'Увійти з будь-якого Google-акаунту',
  apiKeyStep2: 'Натиснути «Create API key»',
  apiKeyStep3: 'Скопіювати ключ (починається з AIza)',
  apiKeyStep4: 'Вставити нижче і натиснути Зберегти',
  apiKeySaveAndContinue: 'Зберегти та продовжити',

  navArticles: 'Статті',
  articlesTitle: 'Статті про харчування',
  articlesSubtitle: 'Науково обґрунтовані матеріали про дієтологію',
  readMore: 'Читати статтю',
  minRead: 'хв читання',
  backToArticles: '← Статті',
  articleNotFound: 'Статтю не знайдено.',

  analytics: 'Аналітика',
  nutrition: 'Харчування',
  body: 'Тіло',
  daily30d: 'По днях (30д)',
  monthly12m: 'По місяцях (12м)',
  caloriesLast30: 'Калорії — останні 30 днів',
  macrosLast30: 'Макронутрієнти — останні 30 днів',
  avgCalories12m: 'Середні калорії на день — 12 місяців',
  avgMacros12m: 'Середні макронутрієнти — 12 місяців',
  chartPlaceholder: 'Тут з\'являться ваші графіки',
  chartPlaceholderSub: 'Запишіть хоча б 2 прийоми їжі, щоб побачити тренди',
  last30Days: 'останні 30 днів',
  last12Months: 'останні 12 місяців',

  onboardingWelcomeTitle: 'Ласкаво просимо до Diet Tracker',
  onboardingWelcomeSubtitle: 'Відстежуйте харчування легко. Опишіть їжу, і ШІ порахує калорії та макронутрієнти — або введіть вручну. Усі дані зберігаються на пристрої.',
  onboardingGetStarted: 'Почати →',
  onboardingSkip: 'Пропустити налаштування',
  onboardingNutritionTitle: 'Як працює харчування',
  onboardingNutritionSubtitle: 'Їжа дає енергію через три макронутрієнти. Кожен виконує свою роль:',
  onboardingProteinDesc: 'Будує та відновлює м\'язи. Важливий для відчуття ситості. Найважливіший макронутрієнт.',
  onboardingFatDesc: 'Підтримує гормони та засвоєння вітамінів. Забезпечує тривале насичення.',
  onboardingCarbsDesc: 'Основне джерело енергії для тіла. Живить мозок і тренування.',
  onboardingReadFullGuide: '→ Читати повний посібник',
  onboardingBodyStatsTitle: 'Розкажіть про себе',
  onboardingMale: 'Чоловік',
  onboardingFemale: 'Жінка',
  onboardingAge: 'Вік (роки)',
  onboardingWeight: 'Вага (кг)',
  onboardingWeightHint: 'Перевід із фунтів: поділити на 2,2',
  onboardingHeight: 'Зріст (см)',
  onboardingHeightHint: 'Перевід із футів/дюймів: фути × 30,5 + дюйми × 2,54',
  onboardingActivityTitle: 'Наскільки ви активні?',
  onboardingActivitySedentary: 'Малорухливий',
  onboardingActivitySedentaryDesc: 'Сидяча робота, майже немає тренувань',
  onboardingActivityLight: 'Помірно активний',
  onboardingActivityLightDesc: 'Легкі тренування 1–3 дні на тиждень',
  onboardingActivityModerate: 'Активний',
  onboardingActivityModerateDesc: 'Помірні тренування 3–5 днів на тиждень',
  onboardingActivityActive: 'Дуже активний',
  onboardingActivityActiveDesc: 'Інтенсивні тренування 6–7 днів на тиждень',
  onboardingActivityVeryActive: 'Надзвичайно активний',
  onboardingActivityVeryActiveDesc: 'Фізична праця або подвійні тренування',
  onboardingGoalTitle: 'Яка ваша мета?',
  onboardingGoalLose: 'Схуднути',
  onboardingGoalLoseDesc: 'Їсти ~400 ккал менше, ніж спалюєте',
  onboardingGoalMaintain: 'Підтримувати вагу',
  onboardingGoalMaintainDesc: 'Їсти приблизно стільки, скільки спалюєте',
  onboardingGoalGain: 'Набрати м\'язову масу',
  onboardingGoalGainDesc: 'Їсти ~250 ккал більше, ніж спалюєте',
  onboardingResultsTitle: 'Ваші денні цілі',
  onboardingTdeeLabel: 'Ваші підтримуючі калорії (TDEE):',
  onboardingAdjustMacros: 'Налаштувати макронутрієнти',
  onboardingCarbsDerived: 'Вуглеводи (розраховуються автоматично)',
  onboardingLowCarbsWarning: 'Вуглеводів дуже мало. Спробуйте трохи знизити білки або жири.',
  onboardingDoneTitle: 'Усе готово!',
  onboardingDoneSummary: 'Ваша денна ціль:',
  onboardingStartTracking: 'Почати відстежувати →',
  onboardingNext: 'Далі →',
  onboardingBack: '← Назад',
  onboardingValidationAge: 'Введіть коректний вік (10–99)',
  onboardingValidationWeight: 'Введіть коректну вагу (30–300 кг)',
  onboardingValidationHeight: 'Введіть коректний зріст (100–250 см)',

  macroInsightLowProtein: 'Мало білка — ризик втрати м\'язів і поганого відновлення. Намагайтеся отримувати хоча б 1,2г на кг ваги.',
  macroInsightHighProtein: 'Багато білка допомагає зберегти м\'язи та довше насичує. Чудовий вибір для активного способу життя.',
  macroInsightLowFat: 'Дуже мало жирів може порушити вироблення гормонів та засвоєння жиророзчинних вітамінів (A, D, E, K).',
  macroInsightHighFat: 'Багато жирів при малій кількості вуглеводів — це кетогенний підхід. Підходить деяким, але потребує адаптації.',
  macroInsightLowCarbs: 'Менше 80г вуглеводів — низьковуглеводний режим. Мозок та інтенсивні тренування працюють краще на вуглеводах.',
  macroInsightBalanced: 'Збалансований розподіл. Достатньо білка для м\'язів, жирів для гормонів і вуглеводів для енергії.',

  apiKeyWhatIsThis: 'Що таке API-ключ?',
  apiKeyExplainTitle: 'Що таке API-ключ?',
  apiKeyExplainBody: 'API-ключ — це безкоштовний пароль, що дозволяє додатку спілкуватися з ШІ Google. Створюється за 30 секунд — без банківської картки.',
  apiKeyExplainStep1: 'Перейдіть на aistudio.google.com та увійдіть через Google-акаунт',
  apiKeyExplainStep2: 'Натисніть «Create API key» та скопіюйте ключ (починається з AIza...)',
  apiKeyExplainStep3: 'Вставте ключ тут і натисніть «Зберегти»',
  apiKeyExplainGotIt: 'Зрозуміло',
  apiKeyQuotaNote: 'Безкоштовний ліміт: 1 500 запитів на день. Звичайне особисте використання (3–10 прийомів їжі) займає менше 100.',
  apiKeyViewUsage: 'Переглянути використання в AI Studio',

  clearAllDataArchiveDesc: 'Ваші дані будуть заархівовані (не видалені назавжди), і ви повернетеся до екрана налаштування.',
  archiveEverything: 'Архівувати та скинути',
};

export const TRANSLATIONS: Record<AppLanguage, Translations> = { en, ru, cs, de, fr, es, uk };

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: 'English',
  ru: 'Русский',
  cs: 'Čeština',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  uk: 'Українська',
};

export function getTranslations(lang: AppLanguage): Translations {
  return TRANSLATIONS[lang] ?? TRANSLATIONS.en;
}

export function getGeminiLanguageInstruction(lang: AppLanguage): string {
  if (lang === 'en') return '';
  const names: Record<AppLanguage, string> = {
    en: 'English',
    ru: 'Russian',
    cs: 'Czech',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    uk: 'Ukrainian',
  };
  return `\n- Respond with food names, quantity descriptions, and notes in ${names[lang]}.`;
}
