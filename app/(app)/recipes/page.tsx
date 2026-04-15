"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/lib/types";
import { RecipeCard } from "@/components/recipe-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data) => setRecipes(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) {
    return <p className="text-[#94a3b8] text-center py-12">Loading recipes...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Recipes</h1>
        <Button asChild className="bg-[#d946ef] hover:bg-[#c026d3] text-white">
          <Link href="/recipe">+ New Recipe</Link>
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#94a3b8] mb-4">No saved recipes yet</p>
          <Button asChild className="bg-[#d946ef] hover:bg-[#c026d3] text-white">
            <Link href="/recipe">Create your first recipe</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
