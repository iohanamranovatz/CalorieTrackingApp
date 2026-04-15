import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const date = request.nextUrl.searchParams.get("date");
  let query = supabase
    .from("daily_logs")
    .select("*, recipes(name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g)")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false });

  if (date) {
    const start = `${date}T00:00:00.000Z`;
    const end = `${date}T23:59:59.999Z`;
    query = query.gte("logged_at", start).lte("logged_at", end);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Fetch the recipe to compute macros
  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", body.recipe_id)
    .single();

  if (recipeError || !recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const grams = body.grams_eaten;
  const factor = grams / 100;

  const { data, error } = await supabase
    .from("daily_logs")
    .insert({
      user_id: user.id,
      recipe_id: body.recipe_id,
      grams_eaten: grams,
      calories: Math.round(recipe.calories_per_100g * factor * 10) / 10,
      protein: Math.round(recipe.protein_per_100g * factor * 10) / 10,
      carbs: Math.round(recipe.carbs_per_100g * factor * 10) / 10,
      fat: Math.round(recipe.fat_per_100g * factor * 10) / 10,
    })
    .select("*, recipes(name)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
