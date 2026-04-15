import { NextRequest, NextResponse } from "next/server";
import { NutritionData } from "@/lib/types";
import { lookupNutrition } from "@/lib/nutrition-db";

export async function GET(request: NextRequest) {
  const ingredient = request.nextUrl.searchParams.get("ingredient");

  if (!ingredient) {
    return NextResponse.json(
      { error: "Missing ingredient parameter" },
      { status: 400 }
    );
  }

  // 1. Try local database first (fast, always available)
  const local = lookupNutrition(ingredient);
  if (local) {
    const result: NutritionData = {
      ingredient,
      calories_per_100g: local.calories,
      protein_per_100g: local.protein,
      carbs_per_100g: local.carbs,
      fat_per_100g: local.fat,
      matched_product: ingredient,
      confidence: "high",
    };
    return NextResponse.json(result);
  }

  // 2. Fall back to OpenFoodFacts API
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(ingredient)}&json=1&page_size=5&fields=product_name,nutriments`,
      { next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000) }
    );

    if (!res.ok) {
      throw new Error(`OpenFoodFacts returned ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("OpenFoodFacts returned non-JSON response");
    }

    const data = await res.json();
    const products = data.products || [];

    const match = products.find(
      (p: { nutriments?: Record<string, number>; product_name?: string }) =>
        p.nutriments &&
        (p.nutriments["energy-kcal_100g"] != null ||
          p.nutriments["energy_100g"] != null)
    );

    if (match) {
      const n = match.nutriments;
      let calories = n["energy-kcal_100g"];
      if (calories == null && n["energy_100g"] != null) {
        calories = n["energy_100g"] / 4.184;
      }

      const result: NutritionData = {
        ingredient,
        calories_per_100g: Math.round((calories || 0) * 10) / 10,
        protein_per_100g: Math.round((n["proteins_100g"] || 0) * 10) / 10,
        carbs_per_100g: Math.round((n["carbohydrates_100g"] || 0) * 10) / 10,
        fat_per_100g: Math.round((n["fat_100g"] || 0) * 10) / 10,
        matched_product: match.product_name || ingredient,
        confidence: "high",
      };
      return NextResponse.json(result);
    }
  } catch {
    // OpenFoodFacts unavailable - return low confidence zeros
  }

  // 3. No match found anywhere
  const result: NutritionData = {
    ingredient,
    calories_per_100g: 0,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    fat_per_100g: 0,
    matched_product: "",
    confidence: "low",
  };
  return NextResponse.json(result);
}
