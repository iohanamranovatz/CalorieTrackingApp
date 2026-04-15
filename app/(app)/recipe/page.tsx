"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { parseIngredients } from "@/lib/parse-ingredients";
import { NutritionData, IngredientWithNutrition } from "@/lib/types";
import { toast } from "sonner";

export default function RecipeCalculator() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientWithNutrition[]>([]);
  const [totals, setTotals] = useState<{
    totalWeight: number;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
  } | null>(null);
  const [showSave, setShowSave] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [saving, setSaving] = useState(false);

  const calculate = async () => {
    const parsed = parseIngredients(input);
    if (parsed.length === 0) {
      toast.error("Could not parse any ingredients. Use format: 500g chicken");
      return;
    }

    setLoading(true);
    setIngredients([]);
    setTotals(null);

    try {
      const results = await Promise.all(
        parsed.map(async (item) => {
          const res = await fetch(
            `/api/nutrition?ingredient=${encodeURIComponent(item.name)}`
          );
          const data: NutritionData = await res.json();
          const cal = Number(data.calories_per_100g) || 0;
          const prot = Number(data.protein_per_100g) || 0;
          const carb = Number(data.carbs_per_100g) || 0;
          const f = Number(data.fat_per_100g) || 0;
          return {
            name: item.name,
            grams: item.grams,
            calories: Math.round((item.grams / 100) * cal * 10) / 10,
            protein: Math.round((item.grams / 100) * prot * 10) / 10,
            carbs: Math.round((item.grams / 100) * carb * 10) / 10,
            fat: Math.round((item.grams / 100) * f * 10) / 10,
          };
        })
      );

      const totalWeight = parsed.reduce((sum, p) => sum + p.grams, 0);
      const totalCal = results.reduce((s, r) => s + r.calories, 0);
      const totalProt = results.reduce((s, r) => s + r.protein, 0);
      const totalCarbs = results.reduce((s, r) => s + r.carbs, 0);
      const totalFat = results.reduce((s, r) => s + r.fat, 0);

      setIngredients(results);
      setTotals({
        totalWeight,
        caloriesPer100g: Math.round((totalCal / totalWeight) * 100 * 10) / 10,
        proteinPer100g: Math.round((totalProt / totalWeight) * 100 * 10) / 10,
        carbsPer100g: Math.round((totalCarbs / totalWeight) * 100 * 10) / 10,
        fatPer100g: Math.round((totalFat / totalWeight) * 100 * 10) / 10,
      });
    } catch {
      toast.error("Failed to fetch nutrition data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!recipeName.trim() || !totals) return;
    setSaving(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipeName.trim(),
          raw_input: input,
          total_weight_grams: totals.totalWeight,
          calories_per_100g: totals.caloriesPer100g,
          protein_per_100g: totals.proteinPer100g,
          carbs_per_100g: totals.carbsPer100g,
          fat_per_100g: totals.fatPer100g,
          ingredients,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Recipe saved!");
      setShowSave(false);
      setRecipeName("");
    } catch {
      toast.error("Failed to save recipe.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <Card className="bg-[#1a0b2e] border-[#2a1545]">
        <CardHeader>
          <CardTitle className="text-white">Recipe Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={"e.g.\n500g chicken breast\n200g rice\n100g broccoli"}
            className="min-h-[200px] bg-[#0b0114] border-[#2a1545] text-white placeholder:text-[#94a3b8]/40"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            onClick={calculate}
            disabled={loading || !input.trim()}
            className="w-full bg-[#d946ef] hover:bg-[#c026d3] text-white"
          >
            {loading ? "Calculating..." : "Calculate Macros"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="bg-[#1a0b2e] border-[#2a1545]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Macros per 100g</CardTitle>
          {totals && (
            <Button
              onClick={() => setShowSave(true)}
              variant="outline"
              className="border-[#d946ef] text-[#d946ef] hover:bg-[#d946ef]/10"
            >
              Save Recipe
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {totals ? (
            <div className="space-y-6">
              {/* Per 100g summary - uniform cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 rounded-lg bg-[#0b0114] border border-[#2a1545]">
                  <div className="text-2xl font-bold text-[#d946ef]">
                    {totals.caloriesPer100g}
                  </div>
                  <div className="text-xs text-[#94a3b8]">Calories</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-[#0b0114] border border-[#2a1545]">
                  <div className="text-2xl font-bold text-[#2dd4bf]">
                    {totals.proteinPer100g}g
                  </div>
                  <div className="text-xs text-[#94a3b8]">Protein</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-[#0b0114] border border-[#2a1545]">
                  <div className="text-2xl font-bold text-[#2dd4bf]">
                    {totals.carbsPer100g}g
                  </div>
                  <div className="text-xs text-[#94a3b8]">Carbs</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-[#0b0114] border border-[#2a1545]">
                  <div className="text-2xl font-bold text-[#d946ef]/70">
                    {totals.fatPer100g}g
                  </div>
                  <div className="text-xs text-[#94a3b8]">Fat</div>
                </div>
              </div>

              <p className="text-sm text-[#94a3b8]">
                Total recipe weight: {totals.totalWeight}g
              </p>

              {/* Ingredient breakdown */}
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2a1545]">
                    <TableHead className="text-[#94a3b8]">Ingredient</TableHead>
                    <TableHead className="text-[#94a3b8]">Grams</TableHead>
                    <TableHead className="text-[#94a3b8]">Cal</TableHead>
                    <TableHead className="text-[#94a3b8]">P</TableHead>
                    <TableHead className="text-[#94a3b8]">C</TableHead>
                    <TableHead className="text-[#94a3b8]">F</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ing, i) => (
                    <TableRow key={i} className="border-[#2a1545]">
                      <TableCell className="text-white capitalize">
                        {ing.name}
                      </TableCell>
                      <TableCell className="text-[#94a3b8]">
                        {ing.grams}g
                      </TableCell>
                      <TableCell className="text-[#d946ef]">
                        {ing.calories}
                      </TableCell>
                      <TableCell className="text-[#2dd4bf]">
                        {ing.protein}g
                      </TableCell>
                      <TableCell className="text-[#2dd4bf]/70">
                        {ing.carbs}g
                      </TableCell>
                      <TableCell className="text-[#94a3b8]">
                        {ing.fat}g
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-[#94a3b8]/40 text-center py-12">
              Enter ingredients and click Calculate to see macros
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save Dialog */}
      <Dialog open={showSave} onOpenChange={setShowSave}>
        <DialogContent className="bg-[#1a0b2e] border-[#2a1545]">
          <DialogHeader>
            <DialogTitle className="text-white">Save Recipe</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Recipe name (e.g. Chicken & Rice)"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="bg-[#0b0114] border-[#2a1545] text-white"
          />
          <DialogFooter>
            <Button
              onClick={saveRecipe}
              disabled={saving || !recipeName.trim()}
              className="bg-[#d946ef] hover:bg-[#c026d3] text-white"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
