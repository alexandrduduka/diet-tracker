export type ArticleSection =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'formula'; label: string; formula: string; note?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  readTimeMinutes: number;
  emoji: string;
  tags: string[];
  content: ArticleSection[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'how-to-calculate-daily-calories',
    title: 'How to Calculate Your Daily Calorie Needs',
    excerpt:
      'Learn how to calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor formula — the gold standard used by dietitians worldwide.',
    readTimeMinutes: 6,
    emoji: '🔥',
    tags: ['calories', 'TDEE', 'BMR', 'weight loss'],
    content: [
      {
        type: 'p',
        text: 'Calories are the foundation of nutrition. Whether your goal is weight loss, muscle gain, or simply maintaining your current weight, understanding how many calories your body needs each day is the starting point for any evidence-based dietary plan.',
      },
      {
        type: 'h2',
        text: 'Step 1 — Calculate Your BMR',
      },
      {
        type: 'p',
        text: 'Your Basal Metabolic Rate (BMR) is the number of calories your body burns at complete rest to sustain basic functions: breathing, circulation, cell repair, and organ function. It accounts for roughly 60–70% of your total daily calorie expenditure.',
      },
      {
        type: 'p',
        text: 'The Mifflin-St Jeor equation, validated in a 2005 meta-analysis as the most accurate for the general population, calculates BMR as follows:',
      },
      {
        type: 'formula',
        label: 'BMR (men)',
        formula: '(10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5',
        note: 'Example: 80 kg, 180 cm, 30 years → (800) + (1125) − (150) + 5 = 1780 kcal/day',
      },
      {
        type: 'formula',
        label: 'BMR (women)',
        formula: '(10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161',
        note: 'Example: 65 kg, 165 cm, 28 years → (650) + (1031) − (140) − 161 = 1380 kcal/day',
      },
      {
        type: 'h2',
        text: 'Step 2 — Apply Your Activity Multiplier (TDEE)',
      },
      {
        type: 'p',
        text: 'Your Total Daily Energy Expenditure (TDEE) accounts for physical activity on top of your BMR. Multiply your BMR by the factor that best describes your lifestyle:',
      },
      {
        type: 'table',
        headers: ['Activity Level', 'Description', 'Multiplier'],
        rows: [
          ['Sedentary', 'Little or no exercise, desk job', '× 1.2'],
          ['Lightly active', 'Light exercise 1–3 days/week', '× 1.375'],
          ['Moderately active', 'Moderate exercise 3–5 days/week', '× 1.55'],
          ['Very active', 'Hard exercise 6–7 days/week', '× 1.725'],
          ['Extra active', 'Physical job + hard daily training', '× 1.9'],
        ],
      },
      {
        type: 'callout',
        text: 'Most desk workers with 3–4 gym sessions per week land at the "moderately active" level (×1.55). When in doubt, start conservative — it\'s easier to adjust upward than to explain a stall.',
      },
      {
        type: 'h2',
        text: 'Step 3 — Adjust for Your Goal',
      },
      {
        type: 'p',
        text: 'Once you know your TDEE, adjusting it for your goal is straightforward:',
      },
      {
        type: 'ul',
        items: [
          'Weight loss: eat 300–500 kcal below TDEE (roughly 0.3–0.5 kg/week loss)',
          'Aggressive cut: 500–750 kcal below TDEE (up to ~0.7 kg/week — not recommended beyond 3–4 months)',
          'Maintenance: eat at TDEE',
          'Muscle gain: eat 200–300 kcal above TDEE ("lean bulk") to minimise fat gain',
        ],
      },
      {
        type: 'h2',
        text: 'How Accurate Is This?',
      },
      {
        type: 'p',
        text: 'TDEE formulas are estimates, not measurements. Individual variation in metabolic rate, gut microbiome efficiency, and non-exercise activity thermogenesis (NEAT — fidgeting, walking around, posture) means real-world calorie needs can differ by ±200–300 kcal from formula predictions.',
      },
      {
        type: 'p',
        text: 'The practical approach: use the formula as a starting point, track your food intake and body weight for 2–3 weeks, then adjust your calorie target by 100–200 kcal based on observed weight trend. This adaptive method is more reliable than any single formula.',
      },
      {
        type: 'callout',
        text: 'Diet Tracker automatically applies your calorie goal to the daily progress ring. Set your TDEE-based target in Settings → Daily Goals.',
      },
    ],
  },
  {
    slug: 'understanding-macros',
    title: 'Understanding Macros: Protein, Carbs & Fat',
    excerpt:
      'A practical, evidence-based guide to the three macronutrients — what they do, how many calories each contains, and how to set macro targets that support your goals.',
    readTimeMinutes: 7,
    emoji: '⚖️',
    tags: ['macros', 'protein', 'carbohydrates', 'fat', 'nutrition'],
    content: [
      {
        type: 'p',
        text: 'Macronutrients — protein, carbohydrates, and fat — are the three classes of nutrients that provide your body with energy (calories). Each plays a distinct physiological role, and understanding them helps you make better food choices beyond just counting calories.',
      },
      {
        type: 'h2',
        text: 'Calorie Density of Each Macro',
      },
      {
        type: 'p',
        text: 'The Atwater factors, established in the late 19th century and still used today, define the calorie yield per gram of each macronutrient:',
      },
      {
        type: 'table',
        headers: ['Macronutrient', 'Calories per gram', 'Primary role'],
        rows: [
          ['Protein', '4 kcal/g', 'Muscle repair, enzymes, hormones, immune function'],
          ['Carbohydrates', '4 kcal/g', 'Primary fuel for brain and high-intensity exercise'],
          ['Fat', '9 kcal/g', 'Cell membranes, fat-soluble vitamins, hormone production'],
        ],
      },
      {
        type: 'callout',
        text: 'This is why Diet Tracker validates AI-parsed calories against the formula: calories = (protein × 4) + (carbs × 4) + (fat × 9). If the LLM returns a calorie figure more than 10% off from this calculation, the app automatically corrects it.',
      },
      {
        type: 'h2',
        text: 'Protein: The Priority Macro',
      },
      {
        type: 'p',
        text: 'Protein is the most important macro to track for body composition. It provides the amino acids required for muscle protein synthesis (MPS) — the process by which muscles repair and grow after exercise.',
      },
      {
        type: 'p',
        text: 'Current evidence-based recommendations for daily protein intake:',
      },
      {
        type: 'ul',
        items: [
          'Sedentary adults: 0.8 g per kg of body weight (RDA minimum)',
          'Active individuals: 1.6–2.2 g/kg (optimal for muscle maintenance)',
          'During a calorie deficit: up to 2.4–3.1 g/kg to preserve lean mass',
          'Older adults (65+): 1.2–1.6 g/kg to counter sarcopenia (age-related muscle loss)',
        ],
      },
      {
        type: 'p',
        text: 'High-protein diets also promote satiety more than equivalent calories from carbs or fat — research consistently shows protein is the most filling macronutrient, which makes calorie control easier.',
      },
      {
        type: 'h2',
        text: 'Carbohydrates: Brain Fuel and Performance',
      },
      {
        type: 'p',
        text: 'Carbohydrates are the preferred fuel source for the brain (which consumes ~120g of glucose per day) and for high-intensity physical activity via glycolysis. They are not inherently fattening — excess calories are, regardless of their source.',
      },
      {
        type: 'p',
        text: 'The Acceptable Macronutrient Distribution Range (AMDR) from the Institute of Medicine recommends 45–65% of calories from carbohydrates. For a 2000 kcal diet, that\'s 225–325g/day. However, this can be adjusted based on individual response and training demands.',
      },
      {
        type: 'ul',
        items: [
          'Prioritise complex carbs: oats, rice, sweet potato, legumes, whole grains',
          'Time carbs around training for performance: pre-workout meal or intra-workout for sessions >90 min',
          'Fibre (a form of carbohydrate) targets: 25–38g/day for gut health and satiety',
        ],
      },
      {
        type: 'h2',
        text: 'Fat: Essential, Not Optional',
      },
      {
        type: 'p',
        text: 'Dietary fat is essential for absorbing fat-soluble vitamins (A, D, E, K), producing steroid hormones (including testosterone and oestrogen), maintaining cell membrane integrity, and insulating the nervous system.',
      },
      {
        type: 'p',
        text: 'Fat intake should not fall below ~0.5 g/kg body weight — doing so risks hormonal disruption, particularly in women. The AMDR for fat is 20–35% of total calories.',
      },
      {
        type: 'table',
        headers: ['Fat type', 'Food sources', 'Evidence'],
        rows: [
          ['Unsaturated (mono & poly)', 'Olive oil, avocado, nuts, oily fish', 'Cardioprotective — favour these'],
          ['Saturated', 'Butter, red meat, coconut oil', 'Limit to <10% of total calories (AHA)'],
          ['Trans fats (artificial)', 'Partially hydrogenated oils', 'Avoid — increase LDL, lower HDL'],
          ['Omega-3 (EPA/DHA)', 'Salmon, sardines, mackerel, flaxseed', 'Anti-inflammatory; aim for 2 portions oily fish/week'],
        ],
      },
      {
        type: 'h2',
        text: 'Setting Your Macro Targets',
      },
      {
        type: 'p',
        text: 'A practical approach for most people: set protein first (1.6–2.2 g/kg), set fat at ~25% of total calories, and fill the remainder with carbohydrates. This "protein-first" method ensures the most physiologically important macro is met before distributing the remaining calories.',
      },
      {
        type: 'callout',
        text: 'Use Diet Tracker\'s Settings → Daily Goals to enter your macro targets. The dashboard shows real-time progress bars for protein, carbs, and fat throughout the day.',
      },
    ],
  },
  {
    slug: 'evidence-based-diet-strategies',
    title: 'Evidence-Based Dietary Strategies That Work',
    excerpt:
      'A clear-eyed look at which dietary approaches have the strongest scientific backing for weight management and long-term health — and how to choose the right one for you.',
    readTimeMinutes: 8,
    emoji: '🧬',
    tags: ['diet strategies', 'weight loss', 'nutrition science', 'Mediterranean diet', 'intermittent fasting'],
    content: [
      {
        type: 'p',
        text: 'The nutrition space is saturated with competing dietary philosophies, each with passionate advocates. This article focuses on what the peer-reviewed evidence actually supports — the strategies with consistent, replicated results across diverse populations.',
      },
      {
        type: 'h2',
        text: '1. Calorie Balance: The Non-Negotiable Foundation',
      },
      {
        type: 'p',
        text: 'Despite decades of debate, the first law of thermodynamics applies to human metabolism: sustained weight change requires a persistent calorie imbalance. No dietary pattern bypasses this — low-carb, vegan, Mediterranean, carnivore — all effective weight-loss diets work by reducing calorie intake, either directly or through mechanisms that suppress appetite.',
      },
      {
        type: 'p',
        text: 'A 2020 JAMA Internal Medicine review of 121 randomised controlled trials found that diets with greater calorie reduction produced greater weight loss regardless of macronutrient composition. The most effective diet is the one you can adhere to long-term.',
      },
      {
        type: 'callout',
        text: 'Key insight: dietary adherence predicts outcome better than any specific diet composition. Choose an approach that fits your food preferences and lifestyle.',
      },
      {
        type: 'h2',
        text: '2. The Mediterranean Diet: Best Long-Term Evidence',
      },
      {
        type: 'p',
        text: 'The Mediterranean dietary pattern has the strongest evidence base for long-term cardiometabolic health. The landmark PREDIMED trial (7,447 participants, 5 years) found it reduced major cardiovascular events by ~30% compared to a low-fat control diet.',
      },
      {
        type: 'p',
        text: 'Core characteristics:',
      },
      {
        type: 'ul',
        items: [
          'Abundant vegetables, legumes, whole grains, fruits, nuts',
          'Olive oil as the primary fat source',
          'Moderate fish and seafood (2+ times per week)',
          'Low-to-moderate dairy and eggs',
          'Limited red meat and processed foods',
          'Red wine in moderation (optional — not a reason to start drinking)',
        ],
      },
      {
        type: 'p',
        text: 'Benefits beyond cardiovascular: reduced risk of type 2 diabetes, improved cognitive function in older adults, and association with lower all-cause mortality in multiple large cohort studies.',
      },
      {
        type: 'h2',
        text: '3. High-Protein Diets: Superior for Body Composition',
      },
      {
        type: 'p',
        text: 'High-protein diets (>25% of calories from protein) consistently outperform lower-protein diets for body composition during calorie restriction. A 2012 meta-analysis (Krieger et al.) of 24 RCTs found high-protein dieters retained significantly more lean mass during weight loss.',
      },
      {
        type: 'p',
        text: 'The thermic effect of food (TEF) for protein is 20–30% — meaning roughly a quarter of protein calories are burned during digestion itself, compared to 5–10% for carbs and 0–3% for fat. This adds up to an additional ~100 kcal/day "free" expenditure at high protein intakes.',
      },
      {
        type: 'h2',
        text: '4. Intermittent Fasting: Modest Benefits, Strong Adherence',
      },
      {
        type: 'p',
        text: 'Intermittent fasting (IF) — particularly the 16:8 time-restricted eating pattern — has strong adherence rates among people who dislike calorie counting. The evidence suggests it produces similar weight loss to continuous calorie restriction when total daily calories are equated.',
      },
      {
        type: 'p',
        text: 'Where IF may offer independent benefits:',
      },
      {
        type: 'ul',
        items: [
          'Autophagy upregulation during extended fasts (>16 hours) — cellular cleanup mechanism',
          'Improved insulin sensitivity in some populations (though effect size is modest)',
          'Simplified meal planning — fewer meals, less decision fatigue',
          'May reduce evening/night-time eating, which is associated with worse metabolic outcomes',
        ],
      },
      {
        type: 'p',
        text: 'Caution: IF is not appropriate for everyone. Not recommended for pregnant women, people with a history of disordered eating, type 1 diabetics, or those on medications requiring food. Always consult a healthcare provider before starting.',
      },
      {
        type: 'h2',
        text: '5. Low-Carb and Ketogenic Diets: Effective Short-Term',
      },
      {
        type: 'p',
        text: 'Low-carbohydrate diets (under ~130g carbs/day) and ketogenic diets (<50g/day) produce faster short-term weight loss than low-fat diets, primarily due to water weight loss from glycogen depletion (glycogen binds 3–4g water per gram). By 12 months, weight loss outcomes are similar between dietary approaches in most RCTs.',
      },
      {
        type: 'p',
        text: 'Ketogenic diets show strong results for epilepsy management and promising data for type 2 diabetes remission. For otherwise healthy people focused on fat loss, they are one valid option among several, not a metabolically superior one.',
      },
      {
        type: 'h2',
        text: '6. Practical Strategies That Cut Across All Diets',
      },
      {
        type: 'p',
        text: 'Regardless of which dietary pattern you follow, these behaviours consistently improve outcomes across the evidence base:',
      },
      {
        type: 'ul',
        items: [
          'Track food intake, at least initially — dietary tracking increases awareness and improves adherence in RCTs',
          'Eat slowly — it takes ~20 minutes for satiety hormones to signal fullness; slow eating reduces caloric intake by ~10% in studies',
          'Prioritise whole foods over processed — ultra-processed foods are engineered to override satiety signals',
          'Ensure adequate sleep (7–9 hours) — sleep deprivation increases ghrelin (hunger hormone) and impairs leptin (satiety hormone)',
          'Manage stress — chronic cortisol elevation promotes fat storage and drives food reward-seeking behaviour',
          'Build a consistent environment — keep trigger foods out of the home; meal prep in advance',
        ],
      },
      {
        type: 'callout',
        text: 'The best diet is the one you can sustain. Use Diet Tracker to log meals consistently, review your weekly trends in History, and adjust your goals in Settings as your body and priorities change.',
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
