"use client";

import { Button } from "@/components/ui/button";
import { DailyLog } from "@/lib/types";
import { toast } from "sonner";

export function MealLogCard({
  log,
  onDelete,
}: {
  log: DailyLog;
  onDelete: (id: string) => void;
}) {
  const handleDelete = async () => {
    const res = await fetch(`/api/daily-logs/${log.id}`, { method: "DELETE" });
    if (res.ok) {
      onDelete(log.id);
      toast.success("Meal removed");
    } else {
      toast.error("Failed to remove meal");
    }
  };

  const recipeName = log.recipes?.name || "Unknown recipe";
  const time = new Date(log.logged_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0b0114] border border-[#2a1545]">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white font-medium truncate">{recipeName}</p>
          <span className="text-xs text-[#94a3b8]/50">{time}</span>
        </div>
        <div className="flex gap-3 mt-1 text-xs">
          <span className="text-[#94a3b8]">{log.grams_eaten}g</span>
          <span className="text-[#d946ef]">{Math.round(log.calories)} cal</span>
          <span className="text-[#2dd4bf]">{Math.round(log.protein)}g P</span>
          <span className="text-[#2dd4bf]/70">{Math.round(log.carbs)}g C</span>
          <span className="text-[#94a3b8]">{Math.round(log.fat)}g F</span>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="text-[#94a3b8]/40 hover:text-[#d946ef]"
        onClick={handleDelete}
      >
        X
      </Button>
    </div>
  );
}
