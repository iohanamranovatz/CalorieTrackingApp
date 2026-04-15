"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types";
import { toast } from "sonner";

export function RecipeCard({
  recipe,
  onDelete,
}: {
  recipe: Recipe;
  onDelete: (id: string) => void;
}) {
  const handleDelete = async () => {
    const res = await fetch(`/api/recipes/${recipe.id}`, { method: "DELETE" });
    if (res.ok) {
      onDelete(recipe.id);
      toast.success("Recipe deleted");
    } else {
      toast.error("Failed to delete recipe");
    }
  };

  return (
    <Card className="bg-[#1a0b2e] border-[#2a1545]">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">{recipe.name}</CardTitle>
        <p className="text-xs text-[#94a3b8]/50">
          {recipe.total_weight_grams}g total &middot;{" "}
          {new Date(recipe.created_at).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div className="font-bold text-[#d946ef]">
              {recipe.calories_per_100g}
            </div>
            <div className="text-xs text-[#94a3b8]">Cal</div>
          </div>
          <div>
            <div className="font-bold text-[#2dd4bf]">
              {recipe.protein_per_100g}g
            </div>
            <div className="text-xs text-[#94a3b8]">Protein</div>
          </div>
          <div>
            <div className="font-bold text-[#2dd4bf]/70">
              {recipe.carbs_per_100g}g
            </div>
            <div className="text-xs text-[#94a3b8]">Carbs</div>
          </div>
          <div>
            <div className="font-bold text-[#94a3b8]">
              {recipe.fat_per_100g}g
            </div>
            <div className="text-xs text-[#94a3b8]">Fat</div>
          </div>
        </div>

        <p className="text-xs text-[#94a3b8]/40 truncate">{recipe.raw_input}</p>

        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-[#d946ef] hover:bg-[#c026d3] text-white"
          >
            <a href={`/log?recipe=${recipe.id}`}>Log Meal</a>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#2a1545] text-[#94a3b8] hover:text-[#d946ef] hover:border-[#d946ef]/30"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
