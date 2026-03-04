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

  // Dashboard
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

  // Measurement labels
  weight: string;
  waist: string;
  chest: string;
  hips: string;
  leftArm: string;
  rightArm: string;
  leftThigh: string;
  rightThigh: string;

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
}

const en: Translations = {
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  noData: 'No data',

  navToday: 'Today',
  navLog: 'Log',
  navHistory: 'History',
  navBody: 'Body',
  navCharts: 'Charts',

  today: 'Today',
  mealsToday: 'Meals today',
  noMealsYet: 'No meals logged yet today.',
  logFirstMeal: 'Log your first meal →',
  calories: 'Calories',
  protein: 'Protein',
  carbs: 'Carbs',
  fat: 'Fat',

  logMeal: 'Log a Meal',
  chatWelcome: 'What did you eat? Describe it naturally — amounts, brand names, rough estimates, all fine. E.g. "had a banana, coffee with a splash of milk, and two eggs scrambled".',
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

  weight: 'Weight',
  waist: 'Waist',
  chest: 'Chest',
  hips: 'Hips',
  leftArm: 'Left Arm',
  rightArm: 'Right Arm',
  leftThigh: 'Left Thigh',
  rightThigh: 'Right Thigh',

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

  today: 'Сегодня',
  mealsToday: 'Приёмы пищи',
  noMealsYet: 'Сегодня ничего не записано.',
  logFirstMeal: 'Записать первый приём →',
  calories: 'Калории',
  protein: 'Белки',
  carbs: 'Углеводы',
  fat: 'Жиры',

  logMeal: 'Записать приём пищи',
  chatWelcome: 'Что вы ели? Опишите в свободной форме — количество, бренды, примерные оценки. Например: «банан, кофе с молоком и два яйца-скрамбл».',
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

  weight: 'Вес',
  waist: 'Талия',
  chest: 'Грудь',
  hips: 'Бёдра',
  leftArm: 'Лев. рука',
  rightArm: 'Прав. рука',
  leftThigh: 'Лев. бедро',
  rightThigh: 'Прав. бедро',

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

  today: 'Dnes',
  mealsToday: 'Jídla dnes',
  noMealsYet: 'Dnes zatím žádné jídlo nezaznamenáno.',
  logFirstMeal: 'Zaznamenat první jídlo →',
  calories: 'Kalorie',
  protein: 'Bílkoviny',
  carbs: 'Sacharidy',
  fat: 'Tuky',

  logMeal: 'Zaznamenat jídlo',
  chatWelcome: 'Co jste jedli? Popište volně — množství, značky, odhady jsou v pořádku. Např. "banán, káva s trochou mléka a dvě míchaná vejce".',
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

  weight: 'Hmotnost',
  waist: 'Pas',
  chest: 'Hrudník',
  hips: 'Boky',
  leftArm: 'Levá paže',
  rightArm: 'Pravá paže',
  leftThigh: 'Levé stehno',
  rightThigh: 'Pravé stehno',

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
};

const de: Translations = {
  save: 'Speichern',
  cancel: 'Abbrechen',
  delete: 'Löschen',
  noData: 'Keine Daten',

  navToday: 'Heute',
  navLog: 'Eintrag',
  navHistory: 'Verlauf',
  navBody: 'Körper',
  navCharts: 'Charts',

  today: 'Heute',
  mealsToday: 'Heutige Mahlzeiten',
  noMealsYet: 'Heute noch keine Mahlzeiten erfasst.',
  logFirstMeal: 'Erste Mahlzeit erfassen →',
  calories: 'Kalorien',
  protein: 'Protein',
  carbs: 'Kohlenhydrate',
  fat: 'Fett',

  logMeal: 'Mahlzeit erfassen',
  chatWelcome: 'Was haben Sie gegessen? Beschreiben Sie es frei — Mengen, Marken, grobe Schätzungen sind in Ordnung.',
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

  weight: 'Gewicht',
  waist: 'Taille',
  chest: 'Brust',
  hips: 'Hüfte',
  leftArm: 'Linker Arm',
  rightArm: 'Rechter Arm',
  leftThigh: 'Linker Oberschenkel',
  rightThigh: 'Rechter Oberschenkel',

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

  today: 'Aujourd\'hui',
  mealsToday: 'Repas aujourd\'hui',
  noMealsYet: 'Aucun repas enregistré aujourd\'hui.',
  logFirstMeal: 'Enregistrer le premier repas →',
  calories: 'Calories',
  protein: 'Protéines',
  carbs: 'Glucides',
  fat: 'Lipides',

  logMeal: 'Saisir un repas',
  chatWelcome: 'Qu\'avez-vous mangé ? Décrivez librement — quantités, marques, estimations sont OK.',
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

  weight: 'Poids',
  waist: 'Taille',
  chest: 'Poitrine',
  hips: 'Hanches',
  leftArm: 'Bras gauche',
  rightArm: 'Bras droit',
  leftThigh: 'Cuisse gauche',
  rightThigh: 'Cuisse droite',

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

  today: 'Hoy',
  mealsToday: 'Comidas de hoy',
  noMealsYet: 'No hay comidas registradas hoy.',
  logFirstMeal: 'Registrar primera comida →',
  calories: 'Calorías',
  protein: 'Proteína',
  carbs: 'Carbohidratos',
  fat: 'Grasa',

  logMeal: 'Registrar comida',
  chatWelcome: '¿Qué comiste? Descríbelo libremente — cantidades, marcas, estimaciones son válidas.',
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

  weight: 'Peso',
  waist: 'Cintura',
  chest: 'Pecho',
  hips: 'Caderas',
  leftArm: 'Brazo izq.',
  rightArm: 'Brazo der.',
  leftThigh: 'Muslo izq.',
  rightThigh: 'Muslo der.',

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

  today: 'Сьогодні',
  mealsToday: 'Прийоми їжі',
  noMealsYet: 'Сьогодні нічого не записано.',
  logFirstMeal: 'Записати перший прийом →',
  calories: 'Калорії',
  protein: 'Білки',
  carbs: 'Вуглеводи',
  fat: 'Жири',

  logMeal: 'Записати прийом їжі',
  chatWelcome: 'Що ви їли? Опишіть довільно — кількість, бренди, приблизні оцінки. Наприклад: «банан, кава з молоком і два яйця-скрамбл».',
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

  weight: 'Вага',
  waist: 'Талія',
  chest: 'Груди',
  hips: 'Стегна',
  leftArm: 'Лів. рука',
  rightArm: 'Пр. рука',
  leftThigh: 'Лів. стегно',
  rightThigh: 'Пр. стегно',

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
