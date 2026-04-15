"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Recipe } from "@/lib/types";
import { toast } from "sonner";

export default function LogMeal() {
  const searchParams = useSearchParams();
  const preselectedRecipe = searchParams.get("recipe");

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<string>(
    preselectedRecipe || ""
  );
  const [grams, setGrams] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data) => setRecipes(data));
  }, []);

  useEffect(() => {
    if (selectedRecipe && grams) {
      const recipe = recipes.find((r) => r.id === selectedRecipe);
      if (recipe) {
        const factor = parseFloat(grams) / 100;
        setPreview({
          calories:
            Math.round(recipe.calories_per_100g * factor * 10) / 10,
          protein:
            Math.round(recipe.protein_per_100g * factor * 10) / 10,
          carbs:
            Math.round(recipe.carbs_per_100g * factor * 10) / 10,
          fat: Math.round(recipe.fat_per_100g * factor * 10) / 10,
        });
      }
    } else {
      setPreview(null);
    }
  }, [selectedRecipe, grams, recipes]);

  const submit = async () => {
    if (!selectedRecipe || !grams) return;
    setLoading(true);
    try {
      const res = await fetch("/api/daily-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe_id: selectedRecipe,
          grams_eaten: parseFloat(grams),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Meal logged!");
      setGrams("");
      setSelectedRecipe("");
      setPreview(null);
    } catch {
      toast.error("Failed to log meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Log a Meal</h1>

      <Card className="bg-[#1a0b2e] border-[#2a1545]">
        <CardHeader>
          <CardTitle className="text-white">What did you eat?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#94a3b8]">Recipe</Label>
            <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
              <SelectTrigger className="bg-[#0b0114] border-[#2a1545] text-white">
                <SelectValue placeholder="Select a recipe" />
              </SelectTrigger>
              <SelectContent>
                {recipes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} ({r.calories_per_100g} cal/100g)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[#94a3b8]">Grams eaten</Label>
            <Input
              type="number"
              placeholder="e.g. 250"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className="bg-[#0b0114] border-[#2a1545] text-white"
            />
          </div>

          {preview && (
            <div className="grid grid-cols-4 gap-2 text-center text-sm p-3 rounded-lg bg-[#0b0114] border border-[#2a1545]">
              <div>
                <div className="font-bold text-[#d946ef]">
                  {preview.calories}
                </div>
                <div className="text-xs text-[#94a3b8]">Cal</div>
              </div>
              <div>
                <div className="font-bold text-[#2dd4bf]">
                  {preview.protein}g
                </div>
                <div className="text-xs text-[#94a3b8]">Protein</div>
              </div>
              <div>
                <div className="font-bold text-[#2dd4bf]/70">
                  {preview.carbs}g
                </div>
                <div className="text-xs text-[#94a3b8]">Carbs</div>
              </div>
              <div>
                <div className="font-bold text-[#94a3b8]">
                  {preview.fat}g
                </div>
                <div className="text-xs text-[#94a3b8]/50">Fat</div>
              </div>
            </div>
          )}

          <Button
            onClick={submit}
            disabled={loading || !selectedRecipe || !grams}
            className="w-full bg-[#d946ef] hover:bg-[#c026d3] text-white"
          >
            {loading ? "Logging..." : "Log Meal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
