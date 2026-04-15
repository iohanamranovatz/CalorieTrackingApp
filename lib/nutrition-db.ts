// Local nutrition database (per 100g) for common ingredients
// Used as primary source + fallback when external APIs are unavailable
type NutritionEntry = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const db: Record<string, NutritionEntry> = {
  // Meats
  "chicken breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  "chicken thigh": { calories: 209, protein: 26, carbs: 0, fat: 10.9 },
  chicken: { calories: 239, protein: 27.3, carbs: 0, fat: 13.6 },
  "minced beef": { calories: 332, protein: 14.35, carbs: 0, fat: 30 },
  "ground beef": { calories: 332, protein: 14.35, carbs: 0, fat: 30 },
  beef: { calories: 250, protein: 26, carbs: 0, fat: 15 },
  "beef steak": { calories: 271, protein: 26, carbs: 0, fat: 18 },
  pork: { calories: 242, protein: 27.3, carbs: 0, fat: 14 },
  "pork chop": { calories: 231, protein: 25.7, carbs: 0, fat: 13.5 },
  lamb: { calories: 294, protein: 24.5, carbs: 0, fat: 21 },
  turkey: { calories: 189, protein: 28.6, carbs: 0, fat: 7.4 },
  "turkey breast": { calories: 135, protein: 30, carbs: 0, fat: 1 },
  bacon: { calories: 541, protein: 37, carbs: 1.4, fat: 42 },
  sausage: { calories: 301, protein: 12, carbs: 2, fat: 27 },
  salami: { calories: 378, protein: 22, carbs: 1.2, fat: 31 },
  ham: { calories: 145, protein: 21, carbs: 1.5, fat: 5.5 },

  // Fish & Seafood
  salmon: { calories: 208, protein: 20, carbs: 0, fat: 13 },
  tuna: { calories: 130, protein: 29, carbs: 0, fat: 0.6 },
  "canned tuna": { calories: 116, protein: 25.5, carbs: 0, fat: 0.8 },
  shrimp: { calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  cod: { calories: 82, protein: 18, carbs: 0, fat: 0.7 },
  tilapia: { calories: 96, protein: 20, carbs: 0, fat: 1.7 },
  sardines: { calories: 208, protein: 25, carbs: 0, fat: 11 },
  mackerel: { calories: 205, protein: 19, carbs: 0, fat: 14 },

  // Dairy & Eggs
  egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  eggs: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  milk: { calories: 42, protein: 3.4, carbs: 5, fat: 1 },
  "whole milk": { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  butter: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
  cheese: { calories: 402, protein: 25, carbs: 1.3, fat: 33 },
  cheddar: { calories: 403, protein: 25, carbs: 1.3, fat: 33 },
  mozzarella: { calories: 280, protein: 28, carbs: 3.1, fat: 17 },
  parmesan: { calories: 431, protein: 38, carbs: 4.1, fat: 29 },
  "cream cheese": { calories: 342, protein: 6, carbs: 4, fat: 34 },
  "sour cream": { calories: 198, protein: 2.4, carbs: 4.6, fat: 19.4 },
  yogurt: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  "greek yogurt": { calories: 97, protein: 9, carbs: 3.6, fat: 5 },
  cream: { calories: 340, protein: 2, carbs: 3, fat: 36 },
  "whipping cream": { calories: 340, protein: 2, carbs: 3, fat: 36 },

  // Grains & Pasta
  rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  "white rice": { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  "brown rice": { calories: 112, protein: 2.3, carbs: 24, fat: 0.8 },
  pasta: { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  spaghetti: { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  noodles: { calories: 138, protein: 4.5, carbs: 25, fat: 2.1 },
  bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  "white bread": { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  "whole wheat bread": { calories: 247, protein: 13, carbs: 41, fat: 3.4 },
  oats: { calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  oatmeal: { calories: 68, protein: 2.4, carbs: 12, fat: 1.4 },
  flour: { calories: 364, protein: 10, carbs: 76, fat: 1 },
  quinoa: { calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },
  couscous: { calories: 112, protein: 3.8, carbs: 23, fat: 0.2 },
  tortilla: { calories: 312, protein: 8, carbs: 52, fat: 8 },

  // Vegetables
  potato: { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  potatoes: { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  "boiled potatoes": { calories: 87, protein: 1.9, carbs: 20, fat: 0.1 },
  "sweet potato": { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  broccoli: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  carrot: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  carrots: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  tomato: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  tomatoes: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  "tomato sauce": { calories: 29, protein: 1.3, carbs: 5.4, fat: 0.2 },
  onion: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
  onions: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
  garlic: { calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
  spinach: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  lettuce: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
  cucumber: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
  pepper: { calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  "bell pepper": { calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  mushroom: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },
  mushrooms: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },
  zucchini: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
  eggplant: { calories: 25, protein: 1, carbs: 6, fat: 0.2 },
  cauliflower: { calories: 25, protein: 1.9, carbs: 5, fat: 0.3 },
  corn: { calories: 86, protein: 3.2, carbs: 19, fat: 1.2 },
  peas: { calories: 81, protein: 5.4, carbs: 14, fat: 0.4 },
  "green beans": { calories: 31, protein: 1.8, carbs: 7, fat: 0.1 },
  cabbage: { calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1 },
  celery: { calories: 16, protein: 0.7, carbs: 3, fat: 0.2 },
  asparagus: { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1 },
  avocado: { calories: 160, protein: 2, carbs: 9, fat: 15 },
  kale: { calories: 49, protein: 4.3, carbs: 9, fat: 0.9 },

  // Fruits
  apple: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  banana: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  orange: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
  strawberry: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  strawberries: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  blueberries: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },
  grapes: { calories: 69, protein: 0.7, carbs: 18, fat: 0.2 },
  mango: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
  pineapple: { calories: 50, protein: 0.5, carbs: 13, fat: 0.1 },
  watermelon: { calories: 30, protein: 0.6, carbs: 8, fat: 0.2 },
  lemon: { calories: 29, protein: 1.1, carbs: 9, fat: 0.3 },
  peach: { calories: 39, protein: 0.9, carbs: 10, fat: 0.3 },

  // Legumes & Nuts
  lentils: { calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  chickpeas: { calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
  "black beans": { calories: 132, protein: 8.9, carbs: 24, fat: 0.5 },
  "kidney beans": { calories: 127, protein: 8.7, carbs: 22, fat: 0.5 },
  beans: { calories: 127, protein: 8.7, carbs: 22, fat: 0.5 },
  tofu: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
  almonds: { calories: 579, protein: 21, carbs: 22, fat: 50 },
  walnuts: { calories: 654, protein: 15, carbs: 14, fat: 65 },
  peanuts: { calories: 567, protein: 26, carbs: 16, fat: 49 },
  "peanut butter": { calories: 588, protein: 25, carbs: 20, fat: 50 },
  cashews: { calories: 553, protein: 18, carbs: 30, fat: 44 },

  // Oils & Fats
  "olive oil": { calories: 884, protein: 0, carbs: 0, fat: 100 },
  "vegetable oil": { calories: 884, protein: 0, carbs: 0, fat: 100 },
  "coconut oil": { calories: 862, protein: 0, carbs: 0, fat: 100 },
  oil: { calories: 884, protein: 0, carbs: 0, fat: 100 },

  // Condiments & Sauces
  "soy sauce": { calories: 53, protein: 8.1, carbs: 4.9, fat: 0 },
  ketchup: { calories: 112, protein: 1.7, carbs: 26, fat: 0.1 },
  mayonnaise: { calories: 680, protein: 1, carbs: 0.6, fat: 75 },
  mustard: { calories: 66, protein: 4, carbs: 6, fat: 3 },
  honey: { calories: 304, protein: 0.3, carbs: 82, fat: 0 },
  sugar: { calories: 387, protein: 0, carbs: 100, fat: 0 },
  "brown sugar": { calories: 380, protein: 0, carbs: 98, fat: 0 },
  salt: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  vinegar: { calories: 18, protein: 0, carbs: 0.6, fat: 0 },

  // Other
  "coconut milk": { calories: 230, protein: 2.3, carbs: 6, fat: 24 },
  "almond milk": { calories: 17, protein: 0.6, carbs: 0.6, fat: 1.1 },
  chocolate: { calories: 546, protein: 5, carbs: 60, fat: 31 },
  "dark chocolate": { calories: 598, protein: 7.8, carbs: 46, fat: 43 },
  protein: { calories: 400, protein: 80, carbs: 10, fat: 5 },
  "whey protein": { calories: 400, protein: 80, carbs: 10, fat: 5 },
};

export function lookupNutrition(ingredient: string): NutritionEntry | null {
  const key = ingredient.toLowerCase().trim();

  // Exact match
  if (db[key]) return db[key];

  // Try without trailing 's' (plural)
  if (key.endsWith("s") && db[key.slice(0, -1)]) {
    return db[key.slice(0, -1)];
  }

  // Partial match - find the best matching key
  for (const [dbKey, value] of Object.entries(db)) {
    if (key.includes(dbKey) || dbKey.includes(key)) {
      return value;
    }
  }

  return null;
}
