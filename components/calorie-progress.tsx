"use client";

import { Progress } from "@/components/ui/progress";

export function CalorieProgress({
  consumed,
  goal,
}: {
  consumed: number;
  goal: number;
}) {
  const percentage = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - consumed, 0);
  const isOver = consumed > goal;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-3xl font-bold text-white">{Math.round(consumed)}</p>
          <p className="text-sm text-[#94a3b8]">calories consumed</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-semibold ${isOver ? "text-[#d946ef]" : "text-[#2dd4bf]"}`}>
            {isOver ? "+" : ""}{Math.round(isOver ? consumed - goal : remaining)}
          </p>
          <p className="text-sm text-[#94a3b8]">
            {isOver ? "over goal" : "remaining"}
          </p>
        </div>
      </div>
      <Progress
        value={percentage}
        className="h-3 bg-[#2a1545] [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-[#d946ef]/80 [&>[data-slot=progress-indicator]]:to-[#d946ef]"
      />
    </div>
  );
}
