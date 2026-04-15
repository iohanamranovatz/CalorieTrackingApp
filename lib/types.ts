export type Profile = {
  id: string;
  daily_calorie_goal: number;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Recipe = {
  id: string;
  user_id: string;
  name: string;
  raw_input: string;
  total_weight_grams: number;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  ingredients: IngredientWithNutrition[];
  created_at: string;
};

export type DailyLog = {
  id: string;
  user_id: string;
  recipe_id: string;
  grams_eaten: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  logged_at: string;
  recipes?: Recipe;
};

export type ParsedIngredient = {
  name: string;
  grams: number;
};

export type NutritionData = {
  ingredient: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  matched_product: string;
  confidence: "high" | "low";
};

export type IngredientWithNutrition = {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
