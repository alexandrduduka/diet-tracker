import type { AppLanguage } from '../types';

export type ArticleSection =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'formula'; label: string; formula: string; note?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; text: string }
  | { type: 'stat-row'; stats: { value: string; label: string }[] }
  | { type: 'visual-bar'; bars: { label: string; value: number; max: number; color: string; suffix?: string }[] };

export interface ArticleTranslation {
  title: string;
  excerpt: string;
  tags: string[];
  content: ArticleSection[];
}

export interface Article {
  slug: string;
  readTimeMinutes: number;
  emoji: string;
  translations: Partial<Record<AppLanguage, ArticleTranslation>>;
}

export interface LocalizedArticle {
  slug: string;
  readTimeMinutes: number;
  emoji: string;
  title: string;
  excerpt: string;
  tags: string[];
  content: ArticleSection[];
}

export const ARTICLES: Article[] = [
  // ─── Article 1: Calories ────────────────────────────────────────────────────
  {
    slug: 'how-to-calculate-daily-calories',
    readTimeMinutes: 4,
    emoji: '🔥',
    translations: {
      en: {
        title: 'How to Calculate Your Daily Calorie Needs',
        excerpt: 'BMR, TDEE, and how to set a calorie target that actually moves the needle.',
        tags: ['calories', 'TDEE', 'BMR'],
        content: [
          { type: 'stat-row', stats: [{ value: '60–70%', label: 'BMR share of total burn' }, { value: '±200–300', label: 'kcal formula margin of error' }, { value: '2–3 wks', label: 'to calibrate your real TDEE' }] },
          { type: 'h2', text: 'BMR — Your Resting Baseline' },
          { type: 'p', text: 'Basal Metabolic Rate is what your body burns doing nothing. It accounts for 60–70% of all calories you expend each day.' },
          { type: 'formula', label: 'BMR — Mifflin-St Jeor', formula: 'Men:   10×kg + 6.25×cm − 5×age + 5\nWomen: 10×kg + 6.25×cm − 5×age − 161', note: 'Example (80 kg, 180 cm, 30 y, male): 1780 kcal/day' },
          { type: 'h2', text: 'TDEE — Add Your Activity' },
          { type: 'table', headers: ['Level', 'Description', '×'], rows: [['Sedentary', 'Desk job, no exercise', '1.2'], ['Lightly active', 'Exercise 1–3×/week', '1.375'], ['Moderately active', 'Exercise 3–5×/week', '1.55'], ['Very active', 'Hard training 6–7×/week', '1.725']] },
          { type: 'h2', text: 'Adjust for Your Goal' },
          { type: 'visual-bar', bars: [{ label: 'Maintain', value: 0, max: 500, color: '#7cb87a', suffix: '± 0 kcal' }, { label: 'Lose fat', value: 400, max: 500, color: '#d4a24c', suffix: '−300–500 kcal' }, { label: 'Build muscle', value: 250, max: 500, color: '#c17a5a', suffix: '+200–300 kcal' }] },
          { type: 'callout', text: 'Formulas are estimates. Track weight for 2–3 weeks, then adjust your target by 100–200 kcal based on observed trend — this beats any formula.' },
        ],
      },
      ru: {
        title: 'Как рассчитать суточную норму калорий',
        excerpt: 'БМР, TDEE и как правильно задать калорийный коридор.',
        tags: ['калории', 'TDEE', 'БМР'],
        content: [
          { type: 'stat-row', stats: [{ value: '60–70%', label: 'доля БМР в общем расходе' }, { value: '±200–300', label: 'ккал погрешность формул' }, { value: '2–3 нед', label: 'для калибровки реального TDEE' }] },
          { type: 'h2', text: 'БМР — базовые расходы в покое' },
          { type: 'p', text: 'Базальный метаболизм — это калории, которые организм сжигает в полном покое. Он составляет 60–70% суточного расхода энергии.' },
          { type: 'formula', label: 'БМР — формула Миффлина-Сан Жеора', formula: 'Мужчины: 10×кг + 6.25×см − 5×лет + 5\nЖенщины: 10×кг + 6.25×см − 5×лет − 161', note: 'Пример (80 кг, 180 см, 30 лет, мужчина): 1780 ккал/день' },
          { type: 'h2', text: 'TDEE — добавляем активность' },
          { type: 'table', headers: ['Уровень', 'Описание', '×'], rows: [['Сидячий', 'Работа за столом, нет тренировок', '1.2'], ['Малоактивный', 'Упражнения 1–3 раза/нед', '1.375'], ['Умеренно активный', 'Упражнения 3–5 раз/нед', '1.55'], ['Очень активный', 'Интенсивные тренировки 6–7×/нед', '1.725']] },
          { type: 'h2', text: 'Корректируем под цель' },
          { type: 'visual-bar', bars: [{ label: 'Поддержание', value: 0, max: 500, color: '#7cb87a', suffix: '± 0 ккал' }, { label: 'Похудение', value: 400, max: 500, color: '#d4a24c', suffix: '−300–500 ккал' }, { label: 'Набор мышц', value: 250, max: 500, color: '#c17a5a', suffix: '+200–300 ккал' }] },
          { type: 'callout', text: 'Формулы дают оценку, а не точный ответ. Отслеживайте вес 2–3 недели, затем корректируйте цель на 100–200 ккал по фактической динамике.' },
        ],
      },
      uk: {
        title: 'Як розрахувати добову норму калорій',
        excerpt: 'БМР, TDEE та як правильно встановити калорійний коридор.',
        tags: ['калорії', 'TDEE', 'БМР'],
        content: [
          { type: 'stat-row', stats: [{ value: '60–70%', label: 'частка БМР у загальних витратах' }, { value: '±200–300', label: 'ккал похибка формул' }, { value: '2–3 тиж', label: 'для калібрування реального TDEE' }] },
          { type: 'h2', text: 'БМР — базові витрати в спокої' },
          { type: 'p', text: 'Базальний метаболізм — це калорії, які організм спалює в повному спокої. Він складає 60–70% добових витрат енергії.' },
          { type: 'formula', label: 'БМР — формула Міффліна-Сан Жеора', formula: 'Чоловіки: 10×кг + 6.25×см − 5×років + 5\nЖінки:    10×кг + 6.25×см − 5×років − 161', note: 'Приклад (80 кг, 180 см, 30 років, чоловік): 1780 ккал/день' },
          { type: 'h2', text: 'TDEE — додаємо активність' },
          { type: 'table', headers: ['Рівень', 'Опис', '×'], rows: [['Сидячий', 'Робота за столом, без тренувань', '1.2'], ['Малоактивний', 'Вправи 1–3 рази/тиж', '1.375'], ['Помірно активний', 'Вправи 3–5 разів/тиж', '1.55'], ['Дуже активний', 'Інтенсивні тренування 6–7×/тиж', '1.725']] },
          { type: 'h2', text: 'Коригуємо під мету' },
          { type: 'visual-bar', bars: [{ label: 'Підтримка', value: 0, max: 500, color: '#7cb87a', suffix: '± 0 ккал' }, { label: 'Схуднення', value: 400, max: 500, color: '#d4a24c', suffix: '−300–500 ккал' }, { label: 'Набір м\'язів', value: 250, max: 500, color: '#c17a5a', suffix: '+200–300 ккал' }] },
          { type: 'callout', text: 'Формули дають оцінку, а не точну відповідь. Відстежуйте вагу 2–3 тижні, потім коригуйте ціль на 100–200 ккал за фактичною динамікою.' },
        ],
      },
      cs: {
        title: 'Jak vypočítat denní potřebu kalorií',
        excerpt: 'BMR, TDEE a jak nastavit kalorický cíl, který opravdu funguje.',
        tags: ['kalorie', 'TDEE', 'BMR'],
        content: [
          { type: 'stat-row', stats: [{ value: '60–70%', label: 'podíl BMR na celkovém výdeji' }, { value: '±200–300', label: 'kcal chyba vzorců' }, { value: '2–3 týd', label: 'pro kalibraci reálného TDEE' }] },
          { type: 'h2', text: 'BMR — klidový základ' },
          { type: 'p', text: 'Bazální metabolismus je množství kalorií, které tělo spaluje v naprostém klidu. Tvoří 60–70 % celkového denního výdeje energie.' },
          { type: 'formula', label: 'BMR — Mifflin-St Jeor', formula: 'Muži:  10×kg + 6.25×cm − 5×věk + 5\nŽeny:  10×kg + 6.25×cm − 5×věk − 161', note: 'Příklad (80 kg, 180 cm, 30 let, muž): 1780 kcal/den' },
          { type: 'h2', text: 'TDEE — přičteme aktivitu' },
          { type: 'table', headers: ['Úroveň', 'Popis', '×'], rows: [['Sedavý', 'Kancelářská práce, žádný pohyb', '1.2'], ['Mírně aktivní', 'Cvičení 1–3×/týden', '1.375'], ['Středně aktivní', 'Cvičení 3–5×/týden', '1.55'], ['Velmi aktivní', 'Intenzivní trénink 6–7×/týden', '1.725']] },
          { type: 'h2', text: 'Upravíme pro váš cíl' },
          { type: 'visual-bar', bars: [{ label: 'Udržení', value: 0, max: 500, color: '#7cb87a', suffix: '± 0 kcal' }, { label: 'Hubnutí', value: 400, max: 500, color: '#d4a24c', suffix: '−300–500 kcal' }, { label: 'Nabírání svalů', value: 250, max: 500, color: '#c17a5a', suffix: '+200–300 kcal' }] },
          { type: 'callout', text: 'Vzorce jsou odhady. Sledujte váhu 2–3 týdny a upravte cíl o 100–200 kcal podle skutečného trendu — to překoná jakýkoliv vzorec.' },
        ],
      },
      de: {
        title: 'Wie du deinen täglichen Kalorienbedarf berechnest',
        excerpt: 'BMR, TDEE und wie du ein Kalorienziel setzt, das wirklich wirkt.',
        tags: ['Kalorien', 'TDEE', 'BMR'],
        content: [
          { type: 'stat-row', stats: [{ value: '60–70%', label: 'BMR-Anteil am Gesamtverbrauch' }, { value: '±200–300', label: 'kcal Formel-Fehlerbereich' }, { value: '2–3 Wo', label: 'zur Kalibrierung des echten TDEE' }] },
          { type: 'h2', text: 'BMR — dein Ruheumsatz' },
          { type: 'p', text: 'Der Grundumsatz ist die Energie, die dein Körper in völliger Ruhe verbrennt. Er macht 60–70 % deines täglichen Gesamtverbrauchs aus.' },
          { type: 'formula', label: 'BMR — Mifflin-St Jeor', formula: 'Männer: 10×kg + 6.25×cm − 5×Alter + 5\nFrauen: 10×kg + 6.25×cm − 5×Alter − 161', note: 'Beispiel (80 kg, 180 cm, 30 J., männlich): 1780 kcal/Tag' },
          { type: 'h2', text: 'TDEE — Aktivität hinzurechnen' },
          { type: 'table', headers: ['Niveau', 'Beschreibung', '×'], rows: [['Sitzend', 'Bürojob, keine Bewegung', '1.2'], ['Leicht aktiv', 'Sport 1–3×/Woche', '1.375'], ['Mäßig aktiv', 'Sport 3–5×/Woche', '1.55'], ['Sehr aktiv', 'Intensives Training 6–7×/Woche', '1.725']] },
          { type: 'h2', text: 'Anpassung ans Ziel' },
          { type: 'visual-bar', bars: [{ label: 'Halten', value: 0, max: 500, color: '#7cb87a', suffix: '± 0 kcal' }, { label: 'Abnehmen', value: 400, max: 500, color: '#d4a24c', suffix: '−300–500 kcal' }, { label: 'Muskelaufbau', value: 250, max: 500, color: '#c17a5a', suffix: '+200–300 kcal' }] },
          { type: 'callout', text: 'Formeln sind Schätzungen. Miss dein Gewicht 2–3 Wochen lang und passe das Ziel um 100–200 kcal anhand des echten Trends an.' },
        ],
      },
      fr: {
        title: 'Comment calculer vos besoins caloriques journaliers',
        excerpt: 'BMR, TDEE et comment fixer un objectif calorique qui fonctionne vraiment.',
        tags: ['calories', 'TDEE', 'BMR'],
        content: [
          { type: 'stat-row', stats: [{ value: '60–70%', label: 'part du BMR dans la dépense totale' }, { value: '±200–300', label: 'kcal marge d\'erreur des formules' }, { value: '2–3 sem', label: 'pour calibrer votre TDEE réel' }] },
          { type: 'h2', text: 'BMR — votre métabolisme de repos' },
          { type: 'p', text: 'Le métabolisme basal est l\'énergie brûlée par le corps au repos complet. Il représente 60–70 % de la dépense énergétique totale quotidienne.' },
          { type: 'formula', label: 'BMR — Mifflin-St Jeor', formula: 'Hommes: 10×kg + 6.25×cm − 5×âge + 5\nFemmes: 10×kg + 6.25×cm − 5×âge − 161', note: 'Exemple (80 kg, 180 cm, 30 ans, homme) : 1780 kcal/jour' },
          { type: 'h2', text: 'TDEE — ajout de l\'activité' },
          { type: 'table', headers: ['Niveau', 'Description', '×'], rows: [['Sédentaire', 'Bureau, aucun exercice', '1.2'], ['Peu actif', 'Exercice 1–3×/semaine', '1.375'], ['Modérément actif', 'Exercice 3–5×/semaine', '1.55'], ['Très actif', 'Entraînement intense 6–7×/semaine', '1.725']] },
          { type: 'h2', text: 'Ajuster selon l\'objectif' },
          { type: 'visual-bar', bars: [{ label: 'Maintien', value: 0, max: 500, color: '#7cb87a', suffix: '± 0 kcal' }, { label: 'Perte de poids', value: 400, max: 500, color: '#d4a24c', suffix: '−300–500 kcal' }, { label: 'Prise de muscle', value: 250, max: 500, color: '#c17a5a', suffix: '+200–300 kcal' }] },
          { type: 'callout', text: 'Les formules sont des estimations. Suivez votre poids pendant 2–3 semaines, puis ajustez l\'objectif de 100–200 kcal selon la tendance réelle.' },
        ],
      },
      es: {
        title: 'Cómo calcular tus necesidades calóricas diarias',
        excerpt: 'BMR, TDEE y cómo establecer un objetivo calórico que realmente funcione.',
        tags: ['calorías', 'TDEE', 'BMR'],
        content: [
          { type: 'stat-row', stats: [{ value: '60–70%', label: 'parte del BMR en el gasto total' }, { value: '±200–300', label: 'kcal margen de error de las fórmulas' }, { value: '2–3 sem', label: 'para calibrar tu TDEE real' }] },
          { type: 'h2', text: 'BMR — tu metabolismo en reposo' },
          { type: 'p', text: 'La tasa metabólica basal es la energía que tu cuerpo quema en reposo total. Representa el 60–70 % del gasto energético diario total.' },
          { type: 'formula', label: 'BMR — Mifflin-St Jeor', formula: 'Hombres: 10×kg + 6.25×cm − 5×edad + 5\nMujeres:  10×kg + 6.25×cm − 5×edad − 161', note: 'Ejemplo (80 kg, 180 cm, 30 años, hombre): 1780 kcal/día' },
          { type: 'h2', text: 'TDEE — añadir actividad' },
          { type: 'table', headers: ['Nivel', 'Descripción', '×'], rows: [['Sedentario', 'Trabajo de oficina, sin ejercicio', '1.2'], ['Poco activo', 'Ejercicio 1–3×/semana', '1.375'], ['Moderadamente activo', 'Ejercicio 3–5×/semana', '1.55'], ['Muy activo', 'Entrenamiento intenso 6–7×/semana', '1.725']] },
          { type: 'h2', text: 'Ajustar según el objetivo' },
          { type: 'visual-bar', bars: [{ label: 'Mantenimiento', value: 0, max: 500, color: '#7cb87a', suffix: '± 0 kcal' }, { label: 'Perder grasa', value: 400, max: 500, color: '#d4a24c', suffix: '−300–500 kcal' }, { label: 'Ganar músculo', value: 250, max: 500, color: '#c17a5a', suffix: '+200–300 kcal' }] },
          { type: 'callout', text: 'Las fórmulas son estimaciones. Sigue tu peso durante 2–3 semanas y ajusta el objetivo en 100–200 kcal según la tendencia real.' },
        ],
      },
    },
  },

  // ─── Article 2: Macros ──────────────────────────────────────────────────────
  {
    slug: 'understanding-macros',
    readTimeMinutes: 4,
    emoji: '⚖️',
    translations: {
      en: {
        title: 'Understanding Macros: Protein, Carbs & Fat',
        excerpt: 'What each macronutrient does, how many calories it carries, and how to set targets that work.',
        tags: ['macros', 'protein', 'carbs', 'fat'],
        content: [
          { type: 'stat-row', stats: [{ value: '4 kcal/g', label: 'protein & carbs' }, { value: '9 kcal/g', label: 'fat' }, { value: '20–30%', label: 'thermic effect of protein' }] },
          { type: 'h2', text: 'Calorie Density at a Glance' },
          { type: 'table', headers: ['Macro', 'kcal/g', 'Key role'], rows: [['Protein', '4', 'Muscle, enzymes, satiety'], ['Carbs', '4', 'Brain fuel, performance'], ['Fat', '9', 'Hormones, vitamins A/D/E/K']] },
          { type: 'h2', text: 'Protein — Set This First' },
          { type: 'p', text: 'Protein is the most important macro for body composition. It\'s the most satiating, has the highest thermic effect (20–30% burned during digestion), and is essential for muscle repair.' },
          { type: 'visual-bar', bars: [{ label: 'Sedentary', value: 0.8, max: 3, color: '#9a9680', suffix: '0.8 g/kg' }, { label: 'Active', value: 1.8, max: 3, color: '#7cb87a', suffix: '1.6–2.2 g/kg' }, { label: 'Cutting', value: 2.6, max: 3, color: '#d4a24c', suffix: '2.4–3.1 g/kg' }] },
          { type: 'h2', text: 'Fat — Essential, Not Optional' },
          { type: 'p', text: 'Fat enables absorption of vitamins A, D, E, K and drives hormone production. Never drop below ~0.5 g/kg — doing so disrupts hormones. Aim for 20–35% of total calories, favouring unsaturated sources (olive oil, avocado, oily fish).' },
          { type: 'h2', text: 'Carbs — Fill the Remainder' },
          { type: 'p', text: 'Carbs are not inherently fattening — excess calories are, regardless of source. Set protein and fat first, then fill remaining calories with mostly complex carbs (oats, rice, legumes).' },
          { type: 'callout', text: 'Diet Tracker validates AI-parsed calories using the formula: (protein × 4) + (carbs × 4) + (fat × 9). If the result differs by >10%, the app auto-corrects it.' },
        ],
      },
      ru: {
        title: 'Макронутриенты: белки, углеводы и жиры',
        excerpt: 'Что делает каждый макронутриент, сколько калорий он несёт и как ставить цели.',
        tags: ['макросы', 'белок', 'углеводы', 'жиры'],
        content: [
          { type: 'stat-row', stats: [{ value: '4 ккал/г', label: 'белки и углеводы' }, { value: '9 ккал/г', label: 'жиры' }, { value: '20–30%', label: 'термогенный эффект белка' }] },
          { type: 'h2', text: 'Калорийность макросов' },
          { type: 'table', headers: ['Макрос', 'ккал/г', 'Основная роль'], rows: [['Белок', '4', 'Мышцы, ферменты, насыщение'], ['Углеводы', '4', 'Топливо для мозга, результаты'], ['Жиры', '9', 'Гормоны, витамины A/D/E/K']] },
          { type: 'h2', text: 'Белок — устанавливаем первым' },
          { type: 'p', text: 'Белок — самый важный макрос для состава тела. Он лучше насыщает, имеет высокий термогенный эффект (20–30% сжигается при пищеварении) и необходим для восстановления мышц.' },
          { type: 'visual-bar', bars: [{ label: 'Малоактивные', value: 0.8, max: 3, color: '#9a9680', suffix: '0.8 г/кг' }, { label: 'Активные', value: 1.8, max: 3, color: '#7cb87a', suffix: '1.6–2.2 г/кг' }, { label: 'На сушке', value: 2.6, max: 3, color: '#d4a24c', suffix: '2.4–3.1 г/кг' }] },
          { type: 'h2', text: 'Жиры — обязательны, не опциональны' },
          { type: 'p', text: 'Жиры обеспечивают усвоение витаминов A, D, E, K и выработку гормонов. Никогда не снижайте потребление ниже ~0.5 г/кг — это нарушает гормональный фон. Цель: 20–35% от общей калорийности, предпочтительно ненасыщенные источники (оливковое масло, авокадо, жирная рыба).' },
          { type: 'h2', text: 'Углеводы — заполняем остаток' },
          { type: 'p', text: 'Углеводы сами по себе не приводят к ожирению — к нему приводит избыток калорий из любого источника. Сначала установите белки и жиры, затем оставшиеся калории заполните сложными углеводами (овсянка, рис, бобовые).' },
          { type: 'callout', text: 'Diet Tracker проверяет калории из ИИ по формуле: (белок × 4) + (углеводы × 4) + (жир × 9). Если расхождение >10%, приложение автоматически корректирует значение.' },
        ],
      },
      uk: {
        title: 'Макронутрієнти: білки, вуглеводи та жири',
        excerpt: 'Що робить кожен макронутрієнт, скільки калорій він несе і як ставити цілі.',
        tags: ['макроси', 'білок', 'вуглеводи', 'жири'],
        content: [
          { type: 'stat-row', stats: [{ value: '4 ккал/г', label: 'білки й вуглеводи' }, { value: '9 ккал/г', label: 'жири' }, { value: '20–30%', label: 'термогенний ефект білка' }] },
          { type: 'h2', text: 'Калорійність макросів' },
          { type: 'table', headers: ['Макрос', 'ккал/г', 'Основна роль'], rows: [['Білок', '4', 'М\'язи, ферменти, насичення'], ['Вуглеводи', '4', 'Паливо для мозку, результати'], ['Жири', '9', 'Гормони, вітаміни A/D/E/K']] },
          { type: 'h2', text: 'Білок — встановлюємо першим' },
          { type: 'p', text: 'Білок — найважливіший макрос для складу тіла. Він краще насичує, має високий термогенний ефект (20–30% спалюється під час травлення) і необхідний для відновлення м\'язів.' },
          { type: 'visual-bar', bars: [{ label: 'Малоактивні', value: 0.8, max: 3, color: '#9a9680', suffix: '0.8 г/кг' }, { label: 'Активні', value: 1.8, max: 3, color: '#7cb87a', suffix: '1.6–2.2 г/кг' }, { label: 'На сушці', value: 2.6, max: 3, color: '#d4a24c', suffix: '2.4–3.1 г/кг' }] },
          { type: 'h2', text: 'Жири — обов\'язкові, не опціональні' },
          { type: 'p', text: 'Жири забезпечують засвоєння вітамінів A, D, E, K та вироблення гормонів. Ніколи не знижуйте споживання нижче ~0.5 г/кг — це порушує гормональний фон. Ціль: 20–35% від загальної калорійності, переважно ненасичені джерела (оливкова олія, авокадо, жирна риба).' },
          { type: 'h2', text: 'Вуглеводи — заповнюємо залишок' },
          { type: 'p', text: 'Вуглеводи самі по собі не призводять до ожиріння — до нього призводить надлишок калорій з будь-якого джерела. Спочатку встановіть білки та жири, потім калорії, що залишилися, заповніть складними вуглеводами (вівсянка, рис, бобові).' },
          { type: 'callout', text: 'Diet Tracker перевіряє калорії з ШІ за формулою: (білок × 4) + (вуглеводи × 4) + (жир × 9). Якщо розбіжність >10%, застосунок автоматично виправляє значення.' },
        ],
      },
      cs: {
        title: 'Makronutrienty: bílkoviny, sacharidy a tuky',
        excerpt: 'Co každý makronutrient dělá, kolik kalorií nese a jak nastavit cíle.',
        tags: ['makra', 'bílkoviny', 'sacharidy', 'tuky'],
        content: [
          { type: 'stat-row', stats: [{ value: '4 kcal/g', label: 'bílkoviny a sacharidy' }, { value: '9 kcal/g', label: 'tuky' }, { value: '20–30%', label: 'termický efekt bílkovin' }] },
          { type: 'h2', text: 'Kalorická hustota maker' },
          { type: 'table', headers: ['Makro', 'kcal/g', 'Hlavní role'], rows: [['Bílkoviny', '4', 'Svaly, enzymy, sytost'], ['Sacharidy', '4', 'Palivo pro mozek, výkon'], ['Tuky', '9', 'Hormony, vitaminy A/D/E/K']] },
          { type: 'h2', text: 'Bílkoviny — nastavit jako první' },
          { type: 'p', text: 'Bílkoviny jsou nejdůležitější makro pro složení těla. Nejvíce zasytí, mají nejvyšší termický efekt (20–30 % se spálí při trávení) a jsou nezbytné pro obnovu svalů.' },
          { type: 'visual-bar', bars: [{ label: 'Nesportující', value: 0.8, max: 3, color: '#9a9680', suffix: '0.8 g/kg' }, { label: 'Aktivní', value: 1.8, max: 3, color: '#7cb87a', suffix: '1.6–2.2 g/kg' }, { label: 'Při deficitu', value: 2.6, max: 3, color: '#d4a24c', suffix: '2.4–3.1 g/kg' }] },
          { type: 'h2', text: 'Tuky — nezbytné, ne volitelné' },
          { type: 'p', text: 'Tuky umožňují vstřebávání vitaminů A, D, E, K a produkci hormonů. Nikdy nesnižujte příjem pod ~0.5 g/kg — narušíte hormonální rovnováhu. Cíl: 20–35 % celkových kalorií, přednostně nenasycené zdroje (olivový olej, avokádo, tučné ryby).' },
          { type: 'h2', text: 'Sacharidy — zbytek' },
          { type: 'p', text: 'Sacharidy nejsou ze své podstaty tučnící — tučnící je přebytek kalorií bez ohledu na zdroj. Nejprve nastavte bílkoviny a tuky, pak zbývající kalorie doplňte komplexními sacharidy (ovesné vločky, rýže, luštěniny).' },
          { type: 'callout', text: 'Diet Tracker ověřuje kalorie z AI vzorcem: (bílkoviny × 4) + (sacharidy × 4) + (tuky × 9). Pokud je odchylka >10 %, aplikace ji automaticky opraví.' },
        ],
      },
      de: {
        title: 'Makronährstoffe: Protein, Kohlenhydrate & Fett',
        excerpt: 'Was jeder Makronährstoff tut, wie viele Kalorien er enthält und wie man Ziele setzt.',
        tags: ['Makros', 'Protein', 'Kohlenhydrate', 'Fett'],
        content: [
          { type: 'stat-row', stats: [{ value: '4 kcal/g', label: 'Protein & Kohlenhydrate' }, { value: '9 kcal/g', label: 'Fett' }, { value: '20–30%', label: 'thermischer Effekt von Protein' }] },
          { type: 'h2', text: 'Kaloriendichte auf einen Blick' },
          { type: 'table', headers: ['Makro', 'kcal/g', 'Hauptrolle'], rows: [['Protein', '4', 'Muskeln, Enzyme, Sättigungsgefühl'], ['Kohlenhydrate', '4', 'Gehirnkraftstoff, Leistung'], ['Fett', '9', 'Hormone, Vitamine A/D/E/K']] },
          { type: 'h2', text: 'Protein — zuerst festlegen' },
          { type: 'p', text: 'Protein ist das wichtigste Makro für die Körperzusammensetzung. Es sättigt am stärksten, hat den höchsten thermischen Effekt (20–30 % verbrennen bei der Verdauung) und ist für die Muskelregeneration unerlässlich.' },
          { type: 'visual-bar', bars: [{ label: 'Inaktiv', value: 0.8, max: 3, color: '#9a9680', suffix: '0.8 g/kg' }, { label: 'Aktiv', value: 1.8, max: 3, color: '#7cb87a', suffix: '1.6–2.2 g/kg' }, { label: 'Diät', value: 2.6, max: 3, color: '#d4a24c', suffix: '2.4–3.1 g/kg' }] },
          { type: 'h2', text: 'Fett — unverzichtbar' },
          { type: 'p', text: 'Fett ermöglicht die Aufnahme der Vitamine A, D, E, K und die Hormonproduktion. Senke den Fettanteil nie unter ~0.5 g/kg — das stört den Hormonhaushalt. Ziel: 20–35 % der Gesamtkalorien, bevorzugt ungesättigte Quellen (Olivenöl, Avocado, Fisch).' },
          { type: 'h2', text: 'Kohlenhydrate — Rest auffüllen' },
          { type: 'p', text: 'Kohlenhydrate machen nicht per se dick — ein Kalorienüberschuss tut es, unabhängig von der Quelle. Lege zuerst Protein und Fett fest, dann fülle die restlichen Kalorien mit komplexen Kohlenhydraten (Haferflocken, Reis, Hülsenfrüchte).' },
          { type: 'callout', text: 'Diet Tracker prüft KI-Kalorien mit der Formel: (Protein × 4) + (KH × 4) + (Fett × 9). Bei >10 % Abweichung korrigiert die App automatisch.' },
        ],
      },
      fr: {
        title: 'Les macronutriments : protéines, glucides et graisses',
        excerpt: 'Ce que fait chaque macronutriment, combien de calories il apporte et comment fixer des objectifs.',
        tags: ['macros', 'protéines', 'glucides', 'graisses'],
        content: [
          { type: 'stat-row', stats: [{ value: '4 kcal/g', label: 'protéines et glucides' }, { value: '9 kcal/g', label: 'graisses' }, { value: '20–30%', label: 'effet thermique des protéines' }] },
          { type: 'h2', text: 'Densité calorique en un coup d\'œil' },
          { type: 'table', headers: ['Macro', 'kcal/g', 'Rôle principal'], rows: [['Protéines', '4', 'Muscles, enzymes, satiété'], ['Glucides', '4', 'Carburant cérébral, performance'], ['Graisses', '9', 'Hormones, vitamines A/D/E/K']] },
          { type: 'h2', text: 'Protéines — à définir en premier' },
          { type: 'p', text: 'Les protéines sont le macronutriment le plus important pour la composition corporelle. Elles rassasient le plus, ont le plus grand effet thermique (20–30 % brûlés lors de la digestion) et sont essentielles à la réparation musculaire.' },
          { type: 'visual-bar', bars: [{ label: 'Sédentaire', value: 0.8, max: 3, color: '#9a9680', suffix: '0.8 g/kg' }, { label: 'Actif', value: 1.8, max: 3, color: '#7cb87a', suffix: '1.6–2.2 g/kg' }, { label: 'En déficit', value: 2.6, max: 3, color: '#d4a24c', suffix: '2.4–3.1 g/kg' }] },
          { type: 'h2', text: 'Graisses — indispensables' },
          { type: 'p', text: 'Les graisses permettent l\'absorption des vitamines A, D, E, K et la production hormonale. Ne descendez jamais sous ~0.5 g/kg — cela perturbe les hormones. Objectif : 20–35 % des calories totales, en privilégiant les sources insaturées (huile d\'olive, avocat, poisson gras).' },
          { type: 'h2', text: 'Glucides — compléter le reste' },
          { type: 'p', text: 'Les glucides ne font pas grossir en soi — c\'est l\'excès de calories qui le fait, quelle qu\'en soit la source. Définissez d\'abord les protéines et les graisses, puis complétez les calories restantes avec des glucides complexes (flocons d\'avoine, riz, légumineuses).' },
          { type: 'callout', text: 'Diet Tracker valide les calories de l\'IA avec la formule : (protéines × 4) + (glucides × 4) + (graisses × 9). Si l\'écart dépasse 10 %, l\'application corrige automatiquement.' },
        ],
      },
      es: {
        title: 'Macronutrientes: proteínas, carbohidratos y grasas',
        excerpt: 'Qué hace cada macronutriente, cuántas calorías aporta y cómo fijar objetivos.',
        tags: ['macros', 'proteínas', 'carbohidratos', 'grasas'],
        content: [
          { type: 'stat-row', stats: [{ value: '4 kcal/g', label: 'proteínas y carbohidratos' }, { value: '9 kcal/g', label: 'grasas' }, { value: '20–30%', label: 'efecto térmico de las proteínas' }] },
          { type: 'h2', text: 'Densidad calórica de un vistazo' },
          { type: 'table', headers: ['Macro', 'kcal/g', 'Función principal'], rows: [['Proteínas', '4', 'Músculos, enzimas, saciedad'], ['Carbohidratos', '4', 'Combustible cerebral, rendimiento'], ['Grasas', '9', 'Hormonas, vitaminas A/D/E/K']] },
          { type: 'h2', text: 'Proteínas — establecer primero' },
          { type: 'p', text: 'Las proteínas son el macronutriente más importante para la composición corporal. Son las más saciantes, tienen el mayor efecto térmico (20–30 % se quema en la digestión) y son esenciales para la reparación muscular.' },
          { type: 'visual-bar', bars: [{ label: 'Sedentario', value: 0.8, max: 3, color: '#9a9680', suffix: '0.8 g/kg' }, { label: 'Activo', value: 1.8, max: 3, color: '#7cb87a', suffix: '1.6–2.2 g/kg' }, { label: 'En déficit', value: 2.6, max: 3, color: '#d4a24c', suffix: '2.4–3.1 g/kg' }] },
          { type: 'h2', text: 'Grasas — imprescindibles' },
          { type: 'p', text: 'Las grasas permiten la absorción de las vitaminas A, D, E, K y la producción hormonal. Nunca bajes de ~0.5 g/kg — altera las hormonas. Objetivo: 20–35 % de las calorías totales, priorizando fuentes insaturadas (aceite de oliva, aguacate, pescado azul).' },
          { type: 'h2', text: 'Carbohidratos — llenar el resto' },
          { type: 'p', text: 'Los carbohidratos no engordan por sí solos — lo hace el exceso de calorías, independientemente de la fuente. Establece primero proteínas y grasas, luego completa las calorías restantes con carbohidratos complejos (avena, arroz, legumbres).' },
          { type: 'callout', text: 'Diet Tracker valida las calorías de la IA con la fórmula: (proteínas × 4) + (carbohidratos × 4) + (grasas × 9). Si la diferencia es >10 %, la app la corrige automáticamente.' },
        ],
      },
    },
  },

  // ─── Article 3: Diet Strategies ─────────────────────────────────────────────
  {
    slug: 'evidence-based-diet-strategies',
    readTimeMinutes: 4,
    emoji: '🧬',
    translations: {
      en: {
        title: 'Evidence-Based Dietary Strategies That Work',
        excerpt: 'Which dietary approaches have the strongest science behind them — and what actually drives results.',
        tags: ['diet', 'weight loss', 'nutrition science'],
        content: [
          { type: 'stat-row', stats: [{ value: '#1', label: 'predictor: adherence, not diet type' }, { value: '−30%', label: 'cardiovascular risk on Mediterranean diet' }, { value: '~100 kcal', label: 'extra burn/day from high-protein TEF' }] },
          { type: 'h2', text: '1 — Calorie Balance: The Foundation' },
          { type: 'p', text: 'Every successful diet works by creating a calorie deficit — low-carb, Mediterranean, vegan, intermittent fasting alike. A 2020 JAMA review of 121 RCTs confirmed: greater calorie reduction = greater weight loss, regardless of macro split.' },
          { type: 'callout', text: 'The most effective diet is the one you can actually stick to. Adherence predicts outcome better than any specific dietary pattern.' },
          { type: 'h2', text: '2 — Mediterranean: Best Long-Term Evidence' },
          { type: 'p', text: 'The PREDIMED trial (7,447 participants, 5 years) showed a 30% reduction in major cardiovascular events. It\'s also associated with lower diabetes risk, better cognitive function, and lower all-cause mortality.' },
          { type: 'ul', items: ['Abundant vegetables, legumes, whole grains, nuts', 'Olive oil as primary fat', 'Fish 2+ times per week', 'Limited red meat and processed foods'] },
          { type: 'h2', text: '3 — High Protein: Best for Body Composition' },
          { type: 'p', text: 'High-protein diets preserve more lean mass during a calorie deficit. The thermic effect of protein (20–30%) means roughly 100 extra kcal burned per day compared to a lower-protein diet at the same calorie intake.' },
          { type: 'h2', text: '4 — Behaviours That Work Across All Diets' },
          { type: 'ul', items: ['Track food at least initially — awareness alone improves adherence', 'Eat slowly — satiety signals take ~20 minutes; slow eating reduces intake ~10%', 'Prioritise whole foods — ultra-processed foods override satiety signals', 'Sleep 7–9 hours — sleep deprivation raises ghrelin and impairs leptin', 'Keep trigger foods out of the house'] },
          { type: 'callout', text: 'Use Diet Tracker\'s History view to spot weekly patterns and adjust your strategy based on real data, not theory.' },
        ],
      },
      ru: {
        title: 'Научно обоснованные диетические стратегии',
        excerpt: 'Какие диетические подходы имеют самую сильную научную базу и что реально даёт результат.',
        tags: ['диета', 'похудение', 'наука о питании'],
        content: [
          { type: 'stat-row', stats: [{ value: '№1', label: 'предиктор — приверженность, не тип диеты' }, { value: '−30%', label: 'риск ССЗ на средиземноморской диете' }, { value: '~100 ккал', label: 'доп. сжигание/день от высокобелкового TEF' }] },
          { type: 'h2', text: '1 — Энергетический баланс: основа всего' },
          { type: 'p', text: 'Любая успешная диета работает за счёт дефицита калорий — низкоуглеводная, средиземноморская, веганская, интервальное голодание. Обзор JAMA 2020 (121 РКИ): чем больше дефицит — тем больше потеря веса, независимо от состава макросов.' },
          { type: 'callout', text: 'Самая эффективная диета — та, которой вы реально придерживаетесь. Приверженность предсказывает результат лучше, чем любой конкретный диетический паттерн.' },
          { type: 'h2', text: '2 — Средиземноморская диета: лучшая долгосрочная доказательная база' },
          { type: 'p', text: 'Исследование PREDIMED (7447 участников, 5 лет) показало снижение риска сердечно-сосудистых событий на 30%. Также: снижение риска диабета, улучшение когнитивных функций, снижение общей смертности.' },
          { type: 'ul', items: ['Много овощей, бобовых, цельнозерновых, орехов', 'Оливковое масло как основной жир', 'Рыба 2+ раза в неделю', 'Ограничено красное мясо и переработанные продукты'] },
          { type: 'h2', text: '3 — Высокобелковые диеты: лучшие для состава тела' },
          { type: 'p', text: 'Высокобелковые диеты сохраняют больше мышечной массы при дефиците калорий. Термогенный эффект белка (20–30%) даёт примерно 100 дополнительных ккал/день по сравнению с низкобелковой диетой при том же калораже.' },
          { type: 'h2', text: '4 — Поведение, которое работает при любой диете' },
          { type: 'ul', items: ['Ведите дневник питания хотя бы поначалу — осознанность улучшает приверженность', 'Ешьте медленно — сигналы насыщения приходят через ~20 мин; медленная еда снижает потребление на ~10%', 'Приоритет цельным продуктам — ультраобработанные продукты подавляют сигналы насыщения', 'Спите 7–9 часов — недосып повышает грелин и снижает лептин', 'Не держите дома продукты-триггеры'] },
          { type: 'callout', text: 'Используйте раздел «История» в Diet Tracker, чтобы увидеть недельные паттерны и скорректировать стратегию на основе реальных данных, а не теории.' },
        ],
      },
      uk: {
        title: 'Науково обґрунтовані дієтичні стратегії',
        excerpt: 'Які дієтичні підходи мають найміцнішу наукову базу і що насправді дає результат.',
        tags: ['дієта', 'схуднення', 'наука про харчування'],
        content: [
          { type: 'stat-row', stats: [{ value: '№1', label: 'предиктор — прихильність, а не тип дієти' }, { value: '−30%', label: 'ризик ССЗ на середземноморській дієті' }, { value: '~100 ккал', label: 'доп. витрата/день від висок. TEF білка' }] },
          { type: 'h2', text: '1 — Енергетичний баланс: основа всього' },
          { type: 'p', text: 'Будь-яка успішна дієта працює за рахунок дефіциту калорій — низьковуглеводна, середземноморська, веганська, інтервальне голодування. Огляд JAMA 2020 (121 РКД): що більший дефіцит — то більша втрата ваги, незалежно від складу макросів.' },
          { type: 'callout', text: 'Найефективніша дієта — та, якої ви реально дотримуєтеся. Прихильність до дієти передбачає результат краще, ніж будь-який конкретний дієтичний патерн.' },
          { type: 'h2', text: '2 — Середземноморська дієта: найкраща довгострокова доказова база' },
          { type: 'p', text: 'Дослідження PREDIMED (7447 учасників, 5 років) показало зниження ризику серцево-судинних подій на 30%. Також: зниження ризику діабету, поліпшення когнітивних функцій, зниження загальної смертності.' },
          { type: 'ul', items: ['Багато овочів, бобових, цільнозернових, горіхів', 'Оливкова олія як основний жир', 'Риба 2+ рази на тиждень', 'Обмежено червоне м\'ясо та оброблені продукти'] },
          { type: 'h2', text: '3 — Висококількові дієти: найкращі для складу тіла' },
          { type: 'p', text: 'Висококількові дієти зберігають більше м\'язової маси при дефіциті калорій. Термогенний ефект білка (20–30%) дає приблизно 100 додаткових ккал/день порівняно з низькобілковою дієтою при тому ж калораже.' },
          { type: 'h2', text: '4 — Поведінка, яка працює при будь-якій дієті' },
          { type: 'ul', items: ['Ведіть щоденник харчування хоча б на початку — усвідомленість покращує прихильність', 'Їжте повільно — сигнали насичення надходять через ~20 хв; повільне харчування знижує споживання на ~10%', 'Пріоритет цільним продуктам — ультраоброблені продукти пригнічують сигнали насичення', 'Спіть 7–9 годин — недосипання підвищує грелін і знижує лептин', 'Не тримайте вдома продукти-тригери'] },
          { type: 'callout', text: 'Використовуйте розділ «Історія» в Diet Tracker, щоб побачити тижневі патерни і скоригувати стратегію на основі реальних даних, а не теорії.' },
        ],
      },
      cs: {
        title: 'Vědecky podložené dietní strategie, které fungují',
        excerpt: 'Které dietní přístupy mají nejsilnější vědeckou podporu a co skutečně přináší výsledky.',
        tags: ['dieta', 'hubnutí', 'výživová věda'],
        content: [
          { type: 'stat-row', stats: [{ value: '#1', label: 'prediktor: dodržování, ne typ diety' }, { value: '−30%', label: 'riziko KVO u středomořské diety' }, { value: '~100 kcal', label: 'navíc/den z vysokoproteinového TEF' }] },
          { type: 'h2', text: '1 — Energetická rovnováha: základ' },
          { type: 'p', text: 'Každá úspěšná dieta funguje díky kalorickému deficitu — nízkosacharidová, středomořská, veganská i přerušovaný půst. Přehled JAMA 2020 (121 RCT): větší deficit = větší ztráta hmotnosti, bez ohledu na makra.' },
          { type: 'callout', text: 'Nejúčinnější dieta je ta, které se opravdu držíte. Dodržování předpovídá výsledek lépe než jakýkoli konkrétní dietní vzorec.' },
          { type: 'h2', text: '2 — Středomořská dieta: nejlepší dlouhodobá evidence' },
          { type: 'p', text: 'Studie PREDIMED (7 447 účastníků, 5 let) prokázala 30% snížení závažných kardiovaskulárních příhod. Dále: nižší riziko cukrovky, lepší kognitivní funkce, nižší celková mortalita.' },
          { type: 'ul', items: ['Hojně zeleniny, luštěnin, celozrnných obilovin, ořechů', 'Olivový olej jako hlavní tuk', 'Ryby 2× týdně a více', 'Omezené červené maso a průmyslově zpracované potraviny'] },
          { type: 'h2', text: '3 — Vysokoproteinové diety: nejlepší pro složení těla' },
          { type: 'p', text: 'Vysokoproteinové diety zachovávají více svalové hmoty při kalorickém deficitu. Termický efekt bílkovin (20–30 %) přináší asi 100 kcal navíc za den oproti nízkobílkovinné dietě se stejným příjmem kalorií.' },
          { type: 'h2', text: '4 — Chování, které funguje u všech diet' },
          { type: 'ul', items: ['Sledujte jídlo alespoň na začátku — povědomí samo o sobě zlepšuje dodržování', 'Jezte pomalu — signály sytosti trvají ~20 min; pomalé jídlo snižuje příjem o ~10 %', 'Přednostně celé potraviny — ultra-zpracované potlačují signály sytosti', 'Spěte 7–9 hodin — nedostatek spánku zvyšuje ghrelin a tlumí leptin', 'Nenechávejte doma spouštěcí potraviny'] },
          { type: 'callout', text: 'Využijte zobrazení Historie v Diet Trackeru k odhalení týdenních vzorců a upravte strategii na základě skutečných dat, nikoli teorie.' },
        ],
      },
      de: {
        title: 'Evidenzbasierte Ernährungsstrategien, die wirken',
        excerpt: 'Welche Ernährungsansätze die stärkste wissenschaftliche Basis haben — und was wirklich Ergebnisse bringt.',
        tags: ['Diät', 'Gewichtsverlust', 'Ernährungswissenschaft'],
        content: [
          { type: 'stat-row', stats: [{ value: '#1', label: 'Prädiktor: Adhärenz, nicht Diättyp' }, { value: '−30%', label: 'Herzerkrankungsrisiko bei Mittelmeerdiät' }, { value: '~100 kcal', label: 'mehr/Tag durch hohen Protein-TEF' }] },
          { type: 'h2', text: '1 — Kalorienbilanz: das Fundament' },
          { type: 'p', text: 'Jede erfolgreiche Diät erzeugt ein Kaloriendefizit — Low-Carb, Mittelmeer, vegan, Intervallfasten. Ein JAMA-Review 2020 (121 RCTs): mehr Kalorienreduktion = mehr Gewichtsverlust, unabhängig von der Makrozusammensetzung.' },
          { type: 'callout', text: 'Die wirkungsvollste Diät ist die, die du wirklich durchhältst. Adhärenz sagt Ergebnisse besser voraus als jedes spezifische Ernährungsmuster.' },
          { type: 'h2', text: '2 — Mittelmeerdiät: beste Langzeitevidenz' },
          { type: 'p', text: 'Die PREDIMED-Studie (7.447 Teilnehmer, 5 Jahre) zeigte eine 30%ige Reduktion schwerwiegender Herz-Kreislauf-Ereignisse. Zudem: geringeres Diabetesrisiko, bessere Kognition, niedrigere Gesamtsterblichkeit.' },
          { type: 'ul', items: ['Viel Gemüse, Hülsenfrüchte, Vollkorn, Nüsse', 'Olivenöl als Hauptfettquelle', 'Fisch 2× pro Woche oder öfter', 'Wenig rotes Fleisch und verarbeitete Lebensmittel'] },
          { type: 'h2', text: '3 — Proteinreiche Ernährung: beste Körperzusammensetzung' },
          { type: 'p', text: 'Proteinreiche Diäten erhalten bei Kaloriendefizit mehr Muskelmasse. Der thermische Effekt von Protein (20–30 %) sorgt für etwa 100 kcal/Tag Mehrverbrennung gegenüber proteinärmerer Ernährung.' },
          { type: 'h2', text: '4 — Verhaltensweisen, die bei allen Diäten wirken' },
          { type: 'ul', items: ['Essen zumindest anfangs tracken — allein das Bewusstsein verbessert die Adhärenz', 'Langsam essen — Sättigungssignale dauern ~20 Min.; langsames Essen reduziert Aufnahme um ~10 %', 'Vollwertige Lebensmittel priorisieren — ultraverarbeitete Produkte überwältigen Sättigungssignale', '7–9 Stunden schlafen — Schlafmangel erhöht Ghrelin und hemmt Leptin', 'Trigger-Lebensmittel nicht vorrätig halten'] },
          { type: 'callout', text: 'Nutze die Verlaufsansicht in Diet Tracker, um wöchentliche Muster zu erkennen und deine Strategie anhand echter Daten anzupassen.' },
        ],
      },
      fr: {
        title: 'Stratégies alimentaires fondées sur les preuves',
        excerpt: 'Quelles approches diététiques ont le soutien scientifique le plus solide et ce qui donne vraiment des résultats.',
        tags: ['régime', 'perte de poids', 'science nutritionnelle'],
        content: [
          { type: 'stat-row', stats: [{ value: '#1', label: 'prédicteur : adhérence, pas le type de régime' }, { value: '−30%', label: 'risque CV avec le régime méditerranéen' }, { value: '~100 kcal', label: 'de plus/jour grâce à l\'effet thermique' }] },
          { type: 'h2', text: '1 — Équilibre calorique : la base' },
          { type: 'p', text: 'Tout régime efficace crée un déficit calorique — low-carb, méditerranéen, végan, jeûne intermittent. Une revue JAMA 2020 (121 ECR) confirme : plus la réduction est grande, plus la perte de poids est importante, quel que soit le ratio de macros.' },
          { type: 'callout', text: 'Le régime le plus efficace est celui que vous pouvez réellement suivre. L\'adhérence prédit les résultats mieux que n\'importe quel schéma alimentaire spécifique.' },
          { type: 'h2', text: '2 — Régime méditerranéen : la meilleure évidence à long terme' },
          { type: 'p', text: 'L\'étude PREDIMED (7 447 participants, 5 ans) a montré une réduction de 30 % des événements cardiovasculaires majeurs. Aussi : risque réduit de diabète, meilleure cognition, mortalité toutes causes confondues plus faible.' },
          { type: 'ul', items: ['Abondance de légumes, légumineuses, céréales complètes, noix', 'Huile d\'olive comme principale source de graisses', 'Poisson au moins 2 fois par semaine', 'Peu de viande rouge et d\'aliments transformés'] },
          { type: 'h2', text: '3 — Régimes riches en protéines : meilleurs pour la composition corporelle' },
          { type: 'p', text: 'Les régimes riches en protéines préservent davantage de masse maigre en déficit calorique. L\'effet thermique des protéines (20–30 %) représente environ 100 kcal de dépense supplémentaire par jour.' },
          { type: 'h2', text: '4 — Comportements qui fonctionnent avec tous les régimes' },
          { type: 'ul', items: ['Suivre les repas au moins au début — la prise de conscience améliore l\'adhérence', 'Manger lentement — les signaux de satiété mettent ~20 min ; manger lentement réduit l\'apport de ~10 %', 'Privilégier les aliments entiers — les ultra-transformés déjouent les signaux de satiété', 'Dormir 7–9 heures — le manque de sommeil augmente la ghréline et altère la leptine', 'Ne pas garder d\'aliments déclencheurs chez soi'] },
          { type: 'callout', text: 'Utilisez la vue Historique de Diet Tracker pour repérer les tendances hebdomadaires et ajuster votre stratégie avec de vraies données.' },
        ],
      },
      es: {
        title: 'Estrategias dietéticas basadas en evidencia que funcionan',
        excerpt: 'Qué enfoques dietéticos tienen el respaldo científico más sólido y qué produce resultados reales.',
        tags: ['dieta', 'pérdida de peso', 'ciencia nutricional'],
        content: [
          { type: 'stat-row', stats: [{ value: '#1', label: 'predictor: adherencia, no tipo de dieta' }, { value: '−30%', label: 'riesgo cardiovascular con dieta mediterránea' }, { value: '~100 kcal', label: 'extra/día por el efecto térmico' }] },
          { type: 'h2', text: '1 — Balance calórico: la base' },
          { type: 'p', text: 'Toda dieta exitosa funciona creando un déficit calórico — baja en carbohidratos, mediterránea, vegana, ayuno intermitente. Una revisión JAMA 2020 (121 ECA): mayor reducción = mayor pérdida de peso, independientemente de los macros.' },
          { type: 'callout', text: 'La dieta más eficaz es la que realmente puedes mantener. La adherencia predice los resultados mejor que cualquier patrón dietético específico.' },
          { type: 'h2', text: '2 — Dieta mediterránea: la mejor evidencia a largo plazo' },
          { type: 'p', text: 'El ensayo PREDIMED (7.447 participantes, 5 años) mostró una reducción del 30% en eventos cardiovasculares mayores. También: menor riesgo de diabetes, mejor función cognitiva, menor mortalidad por todas las causas.' },
          { type: 'ul', items: ['Abundantes verduras, legumbres, cereales integrales, frutos secos', 'Aceite de oliva como grasa principal', 'Pescado al menos 2 veces por semana', 'Poca carne roja y alimentos procesados'] },
          { type: 'h2', text: '3 — Dietas altas en proteína: mejores para la composición corporal' },
          { type: 'p', text: 'Las dietas altas en proteína preservan más masa muscular en déficit calórico. El efecto térmico de la proteína (20–30%) supone unas 100 kcal extra/día de gasto adicional.' },
          { type: 'h2', text: '4 — Comportamientos que funcionan con cualquier dieta' },
          { type: 'ul', items: ['Registrar la comida al menos al principio — la conciencia por sí sola mejora la adherencia', 'Comer despacio — las señales de saciedad tardan ~20 min; comer lento reduce el consumo ~10%', 'Priorizar alimentos enteros — los ultraprocesados anulan las señales de saciedad', 'Dormir 7–9 horas — la privación de sueño sube la grelina y merma la leptina', 'No tener en casa alimentos que desencadenan antojos'] },
          { type: 'callout', text: 'Usa la vista de Historial en Diet Tracker para detectar patrones semanales y ajustar tu estrategia con datos reales.' },
        ],
      },
    },
  },

  // ─── Article 4: Sport & Active Lifestyle ────────────────────────────────────
  {
    slug: 'sport-and-active-lifestyle',
    readTimeMinutes: 5,
    emoji: '🏃',
    translations: {
      en: {
        title: 'Sport & Active Lifestyle: What Exercise Actually Does',
        excerpt: 'Why movement matters beyond calorie burn — and why walking beats the gym for most people.',
        tags: ['exercise', 'steps', 'muscle', 'lifestyle'],
        content: [
          { type: 'stat-row', stats: [{ value: '7–10k', label: 'daily steps linked to lower mortality' }, { value: '~500 kcal', label: 'extra burn per kg of muscle/day' }, { value: '40%', label: 'of gym beginners get injured in year 1' }] },
          { type: 'h2', text: 'Exercise Does Not Replace Diet' },
          { type: 'p', text: 'A 60-minute run burns roughly 500 kcal. A single slice of pizza is ~300 kcal. You cannot out-train a poor diet — the numbers simply don\'t work. But this doesn\'t mean exercise is unimportant; it means diet and exercise do different things.' },
          { type: 'visual-bar', bars: [{ label: 'Diet impact on weight', value: 80, max: 100, color: '#d4a24c', suffix: '~80%' }, { label: 'Exercise impact on weight', value: 20, max: 100, color: '#7cb87a', suffix: '~20%' }, { label: 'Exercise impact on health', value: 95, max: 100, color: '#7cb87a', suffix: 'very high' }] },
          { type: 'h2', text: 'What Exercise Actually Fixes' },
          { type: 'ul', items: ['Hormonal balance — regular movement lowers cortisol (stress hormone) and improves insulin sensitivity', 'Muscle mass — muscle tissue burns ~3× more energy than fat at rest, raising your BMR permanently', 'Sleep quality — moderate daily activity improves deep sleep, which itself drives fat loss and muscle repair', 'Mental health — even 20 minutes of walking reduces anxiety and improves mood via endorphins and BDNF', 'Cardiovascular risk — consistent activity cuts heart disease risk by up to 35%'] },
          { type: 'h2', text: 'Why Steps Beat the Gym for Most People' },
          { type: 'p', text: 'Walking 8,000–10,000 steps per day produces most of the health benefits associated with "being active" — improved insulin sensitivity, lower blood pressure, better sleep, reduced inflammation. It also has near-zero injury risk and requires no equipment, no gym fee, no recovery day.' },
          { type: 'callout', text: 'A 2022 JAMA meta-analysis found that risk of all-cause mortality kept dropping up to ~8,000 steps/day. The benefit curve then flattens — more steps help, but the biggest gains come from getting off the couch.' },
          { type: 'h2', text: 'The Hidden Cost of Gym Training' },
          { type: 'p', text: 'Up to 40% of recreational gym-goers sustain an injury in their first year. Common culprits: ego lifting, poor form, skipping warm-up, insufficient recovery. Injuries don\'t just hurt — they sideline you for weeks, reversing progress and often triggering demotivation.' },
          { type: 'ul', items: ['Bodyweight training (push-ups, squats, lunges, pull-ups) builds real strength with minimal injury risk', 'Progressive overload matters — you can increase reps, tempo, or range of motion instead of just adding weight', 'Resistance bands and kettlebells offer low-impact progression paths', 'Rest days are not optional — muscle grows during recovery, not during the session'] },
          { type: 'h2', text: 'The Compound Effect: Muscle + Diet' },
          { type: 'p', text: 'Every kilogram of muscle you build burns an extra ~13 kcal/day at rest. Gain 5 kg of lean mass and your BMR rises by ~65 kcal/day — roughly 2 kg of fat per year burned without any extra effort. This compounding effect is why body recomposition outperforms dieting alone over a 2–3 year horizon.' },
          { type: 'callout', text: 'You don\'t need a gym to start. Walk more, do bodyweight work, sleep well, eat enough protein. Those four habits cover 90% of what "fitness" delivers.' },
        ],
      },
      ru: {
        title: 'Спорт и активный образ жизни: что реально даёт физическая активность',
        excerpt: 'Почему движение важно за пределами сжигания калорий — и почему ходьба лучше тренажёрного зала для большинства.',
        tags: ['упражнения', 'шаги', 'мышцы', 'образ жизни'],
        content: [
          { type: 'stat-row', stats: [{ value: '7–10k', label: 'шагов/день снижают смертность' }, { value: '~500 ккал', label: 'доп. расход на кг мышц/день' }, { value: '40%', label: 'новичков в зале получают травму в 1-й год' }] },
          { type: 'h2', text: 'Физические упражнения не заменяют диету' },
          { type: 'p', text: 'За 60 минут бега сжигается около 500 ккал. Один кусок пиццы — ~300 ккал. Тренировками не компенсировать плохое питание — математика не сходится. Но это не значит, что упражнения бесполезны: просто диета и тренировки делают разные вещи.' },
          { type: 'visual-bar', bars: [{ label: 'Влияние диеты на вес', value: 80, max: 100, color: '#d4a24c', suffix: '~80%' }, { label: 'Влияние упражнений на вес', value: 20, max: 100, color: '#7cb87a', suffix: '~20%' }, { label: 'Влияние упражнений на здоровье', value: 95, max: 100, color: '#7cb87a', suffix: 'очень высокое' }] },
          { type: 'h2', text: 'Что реально даёт физическая активность' },
          { type: 'ul', items: ['Гормональный баланс — регулярные тренировки снижают кортизол (гормон стресса) и улучшают чувствительность к инсулину', 'Мышечная масса — мышечная ткань сжигает ~3× больше энергии, чем жир в состоянии покоя, постоянно повышая BMR', 'Качество сна — умеренная дневная активность улучшает глубокий сон, который сам по себе способствует сжиганию жира и восстановлению мышц', 'Психическое здоровье — даже 20 минут ходьбы снижают тревогу и улучшают настроение через эндорфины и BDNF', 'Сердечно-сосудистый риск — регулярная активность снижает риск сердечных заболеваний на 35%'] },
          { type: 'h2', text: 'Почему шаги лучше тренажёрного зала для большинства' },
          { type: 'p', text: '8000–10 000 шагов в день дают большинство пользы для здоровья, связанной с «активным образом жизни»: улучшение чувствительности к инсулину, снижение давления, лучший сон, снижение воспаления. И при этом — практически нулевой риск травм, никакого оборудования, никаких абонементов и дней восстановления.' },
          { type: 'callout', text: 'Мета-анализ JAMA 2022 показал: риск общей смертности снижался вплоть до ~8000 шагов/день. Затем кривая выравнивается. Самый большой выигрыш — просто встать с дивана.' },
          { type: 'h2', text: 'Скрытая цена тренировок в зале' },
          { type: 'p', text: 'До 40% любителей тренажёрного зала получают травму в первый год. Частые причины: работа с чрезмерным весом, плохая техника, пропуск разминки, недостаточное восстановление. Травмы не просто болят — они выбивают из строя на недели, откатывая прогресс и нередко убивая мотивацию.' },
          { type: 'ul', items: ['Упражнения с весом тела (отжимания, приседания, выпады, подтягивания) развивают реальную силу с минимальным риском травм', 'Прогрессия имеет значение — можно увеличивать повторы, темп или амплитуду, а не только вес', 'Резиновые ленты и гири — доступные пути с низкой ударной нагрузкой', 'Дни отдыха обязательны — мышцы растут во время восстановления, не во время тренировки'] },
          { type: 'h2', text: 'Синергия: мышцы + диета' },
          { type: 'p', text: 'Каждый килограмм набранных мышц сжигает дополнительно ~13 ккал/день в покое. Прибавьте 5 кг мышечной массы — и ваш BMR вырастет примерно на 65 ккал/день, что эквивалентно ~2 кг жира в год без дополнительных усилий. Именно поэтому рекомпозиция тела превосходит одну только диету на горизонте 2–3 лет.' },
          { type: 'callout', text: 'Не нужен зал, чтобы начать. Ходите больше, делайте упражнения с весом тела, хорошо спите, ешьте достаточно белка. Эти четыре привычки обеспечат 90% того, что даёт «фитнес».' },
        ],
      },
      uk: {
        title: 'Спорт і активний спосіб життя: що насправді дає фізична активність',
        excerpt: 'Чому рух важливий поза спалюванням калорій — і чому ходьба краща за тренажерний зал для більшості.',
        tags: ['вправи', 'кроки', 'м\'язи', 'спосіб життя'],
        content: [
          { type: 'stat-row', stats: [{ value: '7–10k', label: 'кроків/день знижують смертність' }, { value: '~500 ккал', label: 'доп. витрата на кг м\'язів/день' }, { value: '40%', label: 'новачків у залі травмуються в 1-й рік' }] },
          { type: 'h2', text: 'Фізичні вправи не замінюють дієту' },
          { type: 'p', text: 'За 60 хвилин бігу спалюється близько 500 ккал. Один шматок піци — ~300 ккал. Тренуваннями не компенсувати погане харчування — математика не збігається. Але це не означає, що вправи марні: просто дієта і тренування роблять різні речі.' },
          { type: 'visual-bar', bars: [{ label: 'Вплив дієти на вагу', value: 80, max: 100, color: '#d4a24c', suffix: '~80%' }, { label: 'Вплив вправ на вагу', value: 20, max: 100, color: '#7cb87a', suffix: '~20%' }, { label: 'Вплив вправ на здоров\'я', value: 95, max: 100, color: '#7cb87a', suffix: 'дуже високий' }] },
          { type: 'h2', text: 'Що реально дає фізична активність' },
          { type: 'ul', items: ['Гормональний баланс — регулярні тренування знижують кортизол (гормон стресу) і покращують чутливість до інсуліну', 'М\'язова маса — м\'язова тканина спалює ~3× більше енергії, ніж жир у стані спокою, постійно підвищуючи BMR', 'Якість сну — помірна денна активність покращує глибокий сон, який сам по собі сприяє спаленню жиру і відновленню м\'язів', 'Психічне здоров\'я — навіть 20 хвилин ходьби знижують тривогу і покращують настрій через ендорфіни і BDNF', 'Серцево-судинний ризик — регулярна активність знижує ризик серцевих захворювань на 35%'] },
          { type: 'h2', text: 'Чому кроки кращі за тренажерний зал для більшості' },
          { type: 'p', text: '8000–10 000 кроків на день дають більшість переваг для здоров\'я, пов\'язаних з «активним способом життя»: покращення чутливості до інсуліну, зниження тиску, кращий сон, зниження запалення. І при цьому — практично нульовий ризик травм, ніякого обладнання, ніяких абонементів і днів відновлення.' },
          { type: 'callout', text: 'Мета-аналіз JAMA 2022 показав: ризик загальної смертності знижувався аж до ~8000 кроків/день. Потім крива вирівнюється. Найбільший виграш — просто встати з дивана.' },
          { type: 'h2', text: 'Прихована ціна тренувань у залі' },
          { type: 'p', text: 'До 40% любителів тренажерного залу отримують травму в перший рік. Часті причини: робота з надмірною вагою, погана техніка, пропуск розминки, недостатнє відновлення. Травми не просто болять — вони виводять з ладу на тижні, відкочуючи прогрес і нерідко вбиваючи мотивацію.' },
          { type: 'ul', items: ['Вправи з власною вагою (віджимання, присідання, випади, підтягування) розвивають реальну силу з мінімальним ризиком травм', 'Прогресія важлива — можна збільшувати повтори, темп або амплітуду, а не лише вагу', 'Гумові стрічки і гирі — доступні шляхи з низьким ударним навантаженням', 'Дні відпочинку обов\'язкові — м\'язи ростуть під час відновлення, а не під час тренування'] },
          { type: 'h2', text: 'Синергія: м\'язи + дієта' },
          { type: 'p', text: 'Кожен кілограм набраних м\'язів спалює додатково ~13 ккал/день у спокої. Додайте 5 кг м\'язової маси — і ваш BMR зросте приблизно на 65 ккал/день, що еквівалентно ~2 кг жиру на рік без додаткових зусиль. Саме тому рекомпозиція тіла перевершує одну лише дієту на горизонті 2–3 років.' },
          { type: 'callout', text: 'Не потрібен зал, щоб почати. Ходіть більше, робіть вправи з власною вагою, добре спіть, їжте достатньо білка. Ці чотири звички забезпечать 90% того, що дає «фітнес».' },
        ],
      },
      cs: {
        title: 'Sport a aktivní životní styl: co pohyb skutečně dělá',
        excerpt: 'Proč na pohybu záleží víc než jen kvůli spalování kalorií — a proč chůze předčí posilování pro většinu lidí.',
        tags: ['cvičení', 'kroky', 'svaly', 'životní styl'],
        content: [
          { type: 'stat-row', stats: [{ value: '7–10k', label: 'kroků/den snižuje mortalitu' }, { value: '~500 kcal', label: 'extra výdej na kg svalů/den' }, { value: '40%', label: 'začátečníků v posilovně se zraní v 1. roce' }] },
          { type: 'h2', text: 'Cvičení nenahradí dietu' },
          { type: 'p', text: '60 minut běhu spálí přibližně 500 kcal. Jeden kus pizzy má ~300 kcal. Špatnou stravu tréninkem nekompenzujete — čísla prostě nevychází. Ale to neznamená, že cvičení není důležité: dieta a pohyb prostě dělají různé věci.' },
          { type: 'visual-bar', bars: [{ label: 'Vliv diety na hmotnost', value: 80, max: 100, color: '#d4a24c', suffix: '~80%' }, { label: 'Vliv cvičení na hmotnost', value: 20, max: 100, color: '#7cb87a', suffix: '~20%' }, { label: 'Vliv cvičení na zdraví', value: 95, max: 100, color: '#7cb87a', suffix: 'velmi vysoký' }] },
          { type: 'h2', text: 'Co pohyb skutečně napravuje' },
          { type: 'ul', items: ['Hormonální rovnováha — pravidelný pohyb snižuje kortizol (hormon stresu) a zlepšuje citlivost na inzulin', 'Svalová hmota — svalová tkáň spaluje ~3× více energie než tuk v klidu, trvale zvyšuje BMR', 'Kvalita spánku — mírná denní aktivita zlepšuje hluboký spánek, který podporuje spalování tuku a regeneraci svalů', 'Duševní zdraví — i 20 minut chůze snižuje úzkost a zlepšuje náladu přes endorfiny a BDNF', 'Kardiovaskulární riziko — pravidelná aktivita snižuje riziko srdečních onemocnění až o 35 %'] },
          { type: 'h2', text: 'Proč kroky předčí posilovnu pro většinu lidí' },
          { type: 'p', text: '8 000–10 000 kroků denně přináší většinu zdravotních benefitů spojených s „aktivním životem" — lepší citlivost na inzulin, nižší krevní tlak, lepší spánek, nižší zánět. A přitom prakticky nulové riziko zranění, žádné vybavení, žádné permanentky ani regenerační dny.' },
          { type: 'callout', text: 'Meta-analýza JAMA 2022: riziko celkové mortality klesalo až do ~8 000 kroků/den. Pak se křivka vyrovnává. Největší přínos přichází prostě vstáváním z pohovky.' },
          { type: 'h2', text: 'Skrytá cena posilování' },
          { type: 'p', text: 'Až 40 % rekreačních návštěvníků posiloven se zraní v prvním roce. Časté příčiny: ego-lifting, špatná technika, vynechání rozcvičky, nedostatečná regenerace. Zranění jen nebolí — vyřadí vás na týdny, vrátí pokrok a frequently kill motivation.' },
          { type: 'ul', items: ['Cvičení s vlastní váhou (kliky, dřepy, výpady, shyby) buduje skutečnou sílu s minimálním rizikem zranění', 'Progrese je klíčová — zvyšujte počet opakování, tempo nebo rozsah pohybu místo přidávání závaží', 'Odporové gumy a kettlebelly nabízejí nízkozátěžové cesty pokroku', 'Odpočinkové dny nejsou volitelné — svaly rostou při regeneraci, ne během tréninku'] },
          { type: 'h2', text: 'Synergický efekt: svaly + dieta' },
          { type: 'p', text: 'Každý kilogram svalové hmoty navíc spaluje ~13 kcal/den v klidu. Naberte 5 kg svalů a váš BMR vzroste o ~65 kcal/den — přibližně 2 kg tuku za rok bez extra úsilí. Proto rekomposice těla překonává samotnou dietu na horizontu 2–3 let.' },
          { type: 'callout', text: 'Na start nepotřebujete posilovnu. Choďte víc, cvičte s vlastní váhou, dobře spěte, jezte dostatek bílkovin. Tyto čtyři návyky pokrývají 90 % toho, co „fitness" přináší.' },
        ],
      },
      de: {
        title: 'Sport & aktiver Lebensstil: Was Bewegung wirklich bewirkt',
        excerpt: 'Warum Bewegung über Kalorienverbrennung hinaus wichtig ist — und warum Gehen für die meisten besser ist als das Fitnessstudio.',
        tags: ['Sport', 'Schritte', 'Muskeln', 'Lebensstil'],
        content: [
          { type: 'stat-row', stats: [{ value: '7–10k', label: 'Schritte/Tag senken Sterblichkeit' }, { value: '~500 kcal', label: 'Extra-Verbrauch pro kg Muskeln/Tag' }, { value: '40%', label: 'Gym-Einsteiger verletzen sich im 1. Jahr' }] },
          { type: 'h2', text: 'Sport ersetzt keine Ernährung' },
          { type: 'p', text: '60 Minuten Laufen verbrennen rund 500 kcal. Ein Stück Pizza hat ~300 kcal. Schlechte Ernährung lässt sich nicht wegtrainieren — die Zahlen funktionieren einfach nicht. Das bedeutet aber nicht, dass Sport unwichtig ist: Ernährung und Bewegung tun schlicht verschiedene Dinge.' },
          { type: 'visual-bar', bars: [{ label: 'Ernährungseinfluss auf Gewicht', value: 80, max: 100, color: '#d4a24c', suffix: '~80%' }, { label: 'Sporteinfluss auf Gewicht', value: 20, max: 100, color: '#7cb87a', suffix: '~20%' }, { label: 'Sporteinfluss auf Gesundheit', value: 95, max: 100, color: '#7cb87a', suffix: 'sehr hoch' }] },
          { type: 'h2', text: 'Was Bewegung wirklich bewirkt' },
          { type: 'ul', items: ['Hormonbalance — regelmäßige Bewegung senkt Cortisol (Stresshormon) und verbessert die Insulinsensitivität', 'Muskelmasse — Muskelgewebe verbrennt ~3× mehr Energie als Fett in Ruhe und hebt den BMR dauerhaft', 'Schlafqualität — moderate Tagesaktivität verbessert Tiefschlaf, der wiederum Fettabbau und Muskelregeneration fördert', 'Mentale Gesundheit — schon 20 Minuten Gehen reduzieren Angst und verbessern die Stimmung über Endorphine und BDNF', 'Herz-Kreislauf-Risiko — regelmäßige Aktivität senkt das Herzerkrankungsrisiko um bis zu 35 %'] },
          { type: 'h2', text: 'Warum Schritte für die meisten besser sind' },
          { type: 'p', text: '8.000–10.000 Schritte pro Tag liefern die meisten Gesundheitsvorteile von „aktiv sein" — verbesserte Insulinsensitivität, niedrigerer Blutdruck, besserer Schlaf, weniger Entzündungen. Und das mit nahezu null Verletzungsrisiko, ohne Equipment, Abo oder Erholungstage.' },
          { type: 'callout', text: 'Eine JAMA-Meta-Analyse 2022 zeigte: Das Sterblichkeitsrisiko sank bis zu ~8.000 Schritten/Tag. Danach flacht die Kurve ab. Der größte Gewinn kommt einfach davon, vom Sofa aufzustehen.' },
          { type: 'h2', text: 'Die versteckten Kosten des Fitnessstudios' },
          { type: 'p', text: 'Bis zu 40 % der Freizeitsportler verletzen sich im ersten Jahr. Häufige Ursachen: Ego-Lifting, schlechte Form, kein Aufwärmen, unzureichende Erholung. Verletzungen schmerzen nicht nur — sie werfen dich wochenlang zurück, machen Fortschritte zunichte und killen oft die Motivation.' },
          { type: 'ul', items: ['Körpergewichtsübungen (Liegestütze, Kniebeugen, Ausfallschritte, Klimmzüge) bauen echte Kraft mit minimalem Verletzungsrisiko auf', 'Progressive Überlastung — steigere Wiederholungen, Tempo oder Bewegungsumfang statt nur Gewicht', 'Widerstandsbänder und Kettlebells bieten gelenkschonende Fortschrittspfade', 'Ruhetage sind Pflicht — Muskeln wachsen in der Erholung, nicht im Training'] },
          { type: 'h2', text: 'Der Compounding-Effekt: Muskeln + Ernährung' },
          { type: 'p', text: 'Jedes Kilogramm Muskelmasse verbrennt ~13 kcal/Tag im Ruhezustand extra. Baue 5 kg Muskeln auf und dein BMR steigt um ~65 kcal/Tag — das entspricht etwa 2 kg Fett pro Jahr ohne zusätzlichen Aufwand. Deshalb übertrifft Körperrekomposition reines Diäten auf einem 2–3-Jahres-Horizont.' },
          { type: 'callout', text: 'Du brauchst kein Fitnessstudio zum Anfangen. Geh mehr, mache Körpergewichtsübungen, schlaf gut, iss genug Protein. Diese vier Gewohnheiten decken 90 % dessen ab, was „Fitness" bringt.' },
        ],
      },
      fr: {
        title: 'Sport et mode de vie actif : ce que l\'exercice fait vraiment',
        excerpt: 'Pourquoi le mouvement compte au-delà des calories brûlées — et pourquoi la marche bat la salle de sport pour la plupart.',
        tags: ['exercice', 'pas', 'muscles', 'mode de vie'],
        content: [
          { type: 'stat-row', stats: [{ value: '7–10k', label: 'pas/jour liés à une mortalité réduite' }, { value: '~500 kcal', label: 'dépense extra par kg de muscle/jour' }, { value: '40%', label: 'débutants en salle se blessent en an 1' }] },
          { type: 'h2', text: 'L\'exercice ne remplace pas l\'alimentation' },
          { type: 'p', text: '60 minutes de course brûlent environ 500 kcal. Une part de pizza fait ~300 kcal. Vous ne pouvez pas compenser une mauvaise alimentation par l\'entraînement — les chiffres ne fonctionnent tout simplement pas. Mais cela ne signifie pas que l\'exercice est sans importance : alimentation et exercice font simplement des choses différentes.' },
          { type: 'visual-bar', bars: [{ label: 'Impact de l\'alimentation sur le poids', value: 80, max: 100, color: '#d4a24c', suffix: '~80%' }, { label: 'Impact de l\'exercice sur le poids', value: 20, max: 100, color: '#7cb87a', suffix: '~20%' }, { label: 'Impact de l\'exercice sur la santé', value: 95, max: 100, color: '#7cb87a', suffix: 'très élevé' }] },
          { type: 'h2', text: 'Ce que l\'exercice corrige vraiment' },
          { type: 'ul', items: ['Équilibre hormonal — le mouvement régulier réduit le cortisol (hormone du stress) et améliore la sensibilité à l\'insuline', 'Masse musculaire — le tissu musculaire brûle ~3× plus d\'énergie que la graisse au repos, augmentant durablement le BMR', 'Qualité du sommeil — une activité quotidienne modérée améliore le sommeil profond, lui-même moteur de la perte de graisse et de la récupération musculaire', 'Santé mentale — même 20 minutes de marche réduisent l\'anxiété et améliorent l\'humeur via les endorphines et le BDNF', 'Risque cardiovasculaire — l\'activité régulière réduit le risque de cardiopathie jusqu\'à 35 %'] },
          { type: 'h2', text: 'Pourquoi les pas battent la salle de sport pour la plupart' },
          { type: 'p', text: '8 000 à 10 000 pas par jour procurent la plupart des bénéfices santé associés au fait d\'être « actif » — meilleure sensibilité à l\'insuline, pression artérielle réduite, meilleur sommeil, inflammation diminuée. Et avec un risque de blessure quasi nul, sans équipement, sans abonnement, sans jour de récupération.' },
          { type: 'callout', text: 'Une méta-analyse JAMA 2022 a montré que le risque de mortalité toutes causes continuait de baisser jusqu\'à ~8 000 pas/jour. La courbe s\'aplatit ensuite. Le plus grand bénéfice vient simplement de se lever du canapé.' },
          { type: 'h2', text: 'Le coût caché des salles de sport' },
          { type: 'p', text: 'Jusqu\'à 40 % des pratiquants de musculation récréatifs se blessent dans leur première année. Causes fréquentes : surcharge du ego, mauvaise technique, échauffement négligé, récupération insuffisante. Les blessures ne font pas que faire mal — elles vous mettent hors jeu des semaines, anéantissent la progression et tuent souvent la motivation.' },
          { type: 'ul', items: ['Les exercices au poids du corps (pompes, squats, fentes, tractions) développent une vraie force avec un risque de blessure minimal', 'La surcharge progressive compte — augmentez les répétitions, le tempo ou l\'amplitude plutôt que le poids', 'Élastiques et kettlebells offrent des progressions à faible impact', 'Les jours de repos sont obligatoires — les muscles grandissent pendant la récupération, pas pendant la séance'] },
          { type: 'h2', text: 'L\'effet cumulatif : muscles + alimentation' },
          { type: 'p', text: 'Chaque kilogramme de muscle supplémentaire brûle ~13 kcal/jour au repos. Gagnez 5 kg de masse maigre et votre BMR augmente de ~65 kcal/jour — soit environ 2 kg de graisse par an sans effort supplémentaire. C\'est pourquoi la recomposition corporelle surpasse le seul régime sur un horizon de 2–3 ans.' },
          { type: 'callout', text: 'Vous n\'avez pas besoin d\'une salle de sport pour commencer. Marchez plus, faites du renforcement musculaire au poids du corps, dormez bien, mangez assez de protéines. Ces quatre habitudes couvrent 90 % de ce que le « fitness » apporte.' },
        ],
      },
      es: {
        title: 'Deporte y estilo de vida activo: qué hace realmente el ejercicio',
        excerpt: 'Por qué el movimiento importa más allá de quemar calorías — y por qué caminar supera al gimnasio para la mayoría.',
        tags: ['ejercicio', 'pasos', 'músculo', 'estilo de vida'],
        content: [
          { type: 'stat-row', stats: [{ value: '7–10k', label: 'pasos/día relacionados con menor mortalidad' }, { value: '~500 kcal', label: 'gasto extra por kg de músculo/día' }, { value: '40%', label: 'principiantes en gym se lesionan en año 1' }] },
          { type: 'h2', text: 'El ejercicio no reemplaza la dieta' },
          { type: 'p', text: '60 minutos de carrera queman unas 500 kcal. Un trozo de pizza tiene ~300 kcal. No puedes compensar una mala alimentación entrenando — los números simplemente no salen. Pero eso no significa que el ejercicio no importe: dieta y ejercicio hacen cosas diferentes.' },
          { type: 'visual-bar', bars: [{ label: 'Impacto de la dieta en el peso', value: 80, max: 100, color: '#d4a24c', suffix: '~80%' }, { label: 'Impacto del ejercicio en el peso', value: 20, max: 100, color: '#7cb87a', suffix: '~20%' }, { label: 'Impacto del ejercicio en la salud', value: 95, max: 100, color: '#7cb87a', suffix: 'muy alto' }] },
          { type: 'h2', text: 'Qué corrige realmente el ejercicio' },
          { type: 'ul', items: ['Equilibrio hormonal — el movimiento regular baja el cortisol (hormona del estrés) y mejora la sensibilidad a la insulina', 'Masa muscular — el tejido muscular quema ~3× más energía que la grasa en reposo, elevando el BMR permanentemente', 'Calidad del sueño — la actividad diaria moderada mejora el sueño profundo, que a su vez impulsa la pérdida de grasa y la recuperación muscular', 'Salud mental — incluso 20 minutos de caminata reducen la ansiedad y mejoran el ánimo a través de endorfinas y BDNF', 'Riesgo cardiovascular — la actividad regular reduce el riesgo de enfermedad cardíaca hasta un 35%'] },
          { type: 'h2', text: 'Por qué los pasos superan al gimnasio para la mayoría' },
          { type: 'p', text: '8.000–10.000 pasos al día producen la mayoría de los beneficios de salud asociados con "ser activo" — mejor sensibilidad a la insulina, presión arterial más baja, mejor sueño, menos inflamación. Y con un riesgo de lesión casi nulo, sin equipo, sin cuota de gimnasio, sin días de recuperación.' },
          { type: 'callout', text: 'Un metaanálisis JAMA 2022 encontró que el riesgo de mortalidad total seguía bajando hasta ~8.000 pasos/día. Luego la curva se aplana. La mayor ganancia viene simplemente de levantarse del sofá.' },
          { type: 'h2', text: 'El coste oculto del entrenamiento en el gimnasio' },
          { type: 'p', text: 'Hasta el 40% de los practicantes recreativos de gimnasio se lesionan en su primer año. Causas frecuentes: sobrecargar el ego, mala técnica, saltarse el calentamiento, recuperación insuficiente. Las lesiones no solo duelen — te dejan fuera semanas, deshacen el progreso y a menudo matan la motivación.' },
          { type: 'ul', items: ['Los ejercicios con peso corporal (flexiones, sentadillas, zancadas, dominadas) desarrollan fuerza real con mínimo riesgo de lesión', 'La progresión importa — aumenta repeticiones, tempo o rango de movimiento en lugar de solo añadir peso', 'Las bandas elásticas y las pesas rusas ofrecen progresiones de bajo impacto', 'Los días de descanso no son opcionales — los músculos crecen durante la recuperación, no durante la sesión'] },
          { type: 'h2', text: 'El efecto compuesto: músculo + dieta' },
          { type: 'p', text: 'Cada kilogramo de músculo que ganas quema ~13 kcal/día adicionales en reposo. Gana 5 kg de masa magra y tu BMR sube ~65 kcal/día — equivalente a ~2 kg de grasa al año sin esfuerzo adicional. Por eso la recomposición corporal supera a la dieta sola en un horizonte de 2–3 años.' },
          { type: 'callout', text: 'No necesitas un gimnasio para empezar. Camina más, haz ejercicio con tu peso corporal, duerme bien, come suficiente proteína. Esos cuatro hábitos cubren el 90% de lo que el "fitness" aporta.' },
        ],
      },
    },
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getLocalizedArticle(slug: string, lang: AppLanguage): LocalizedArticle | undefined {
  const article = getArticleBySlug(slug);
  if (!article) return undefined;
  const translation = article.translations[lang] ?? article.translations['en'];
  if (!translation) return undefined;
  return {
    slug: article.slug,
    readTimeMinutes: article.readTimeMinutes,
    emoji: article.emoji,
    title: translation.title,
    excerpt: translation.excerpt,
    tags: translation.tags,
    content: translation.content,
  };
}

export function getLocalizedArticles(lang: AppLanguage): LocalizedArticle[] {
  return ARTICLES.map((article) => {
    const translation = article.translations[lang] ?? article.translations['en'];
    return {
      slug: article.slug,
      readTimeMinutes: article.readTimeMinutes,
      emoji: article.emoji,
      title: translation?.title ?? '',
      excerpt: translation?.excerpt ?? '',
      tags: translation?.tags ?? [],
      content: translation?.content ?? [],
    };
  });
}
