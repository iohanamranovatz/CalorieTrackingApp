"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalorieProgress } from "@/components/calorie-progress";
import { MealLogCard } from "@/components/meal-log-card";
import { DailyLog, Profile } from "@/lib/types";
import Link from "next/link";
import { toast } from "sonner";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDisplay(date: Date): string {
  const today = formatDate(new Date());
  const yesterday = formatDate(
    new Date(Date.now() - 86400000)
  );
  const dateStr = formatDate(date);

  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function MyDay() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("");

  const dateStr = formatDate(selectedDate);
  const isToday = dateStr === formatDate(new Date());

  const fetchData = useCallback((date: string) => {
    setLoading(true);
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch(`/api/daily-logs?date=${date}`).then((r) => r.json()),
    ])
      .then(([profileData, logsData]) => {
        setProfile(profileData);
        setLogs(Array.isArray(logsData) ? logsData : []);
        setGoalInput(String(profileData.daily_calorie_goal || 2000));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData(dateStr);
  }, [dateStr, fetchData]);

  const goBack = () => {
    setSelectedDate((d) => new Date(d.getTime() - 86400000));
  };

  const goForward = () => {
    const next = new Date(selectedDate.getTime() + 86400000);
    if (next <= new Date()) {
      setSelectedDate(next);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const saveGoal = async () => {
    const val = parseInt(goalInput);
    if (!val || val < 100) {
      toast.error("Enter a valid calorie goal (min 100)");
      return;
    }
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daily_calorie_goal: val }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProfile(updated);
      setEditingGoal(false);
      toast.success("Calorie goal updated!");
    } catch {
      toast.error("Failed to update goal");
    }
  };

  const totalCalories = logs.reduce((s, l) => s + Number(l.calories), 0);
  const totalProtein = logs.reduce((s, l) => s + Number(l.protein), 0);
  const totalCarbs = logs.reduce((s, l) => s + Number(l.carbs), 0);
  const totalFat = logs.reduce((s, l) => s + Number(l.fat), 0);
  const goal = profile?.daily_calorie_goal || 2000;

  if (loading) {
    return <p className="text-[#94a3b8] text-center py-12">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={goBack}
          className="text-[#94a3b8] hover:text-white text-xl px-3"
        >
          &larr;
        </Button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">
            {formatDisplay(selectedDate)}
          </h1>
          <p className="text-sm text-[#94a3b8]/60">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={goForward}
            disabled={isToday}
            className="text-[#94a3b8] hover:text-white text-xl px-3 disabled:opacity-20"
          >
            &rarr;
          </Button>
          {!isToday && (
            <Button
              variant="ghost"
              onClick={goToToday}
              className="text-[#d946ef] hover:text-[#e879f9] text-xs"
            >
              Today
            </Button>
          )}
        </div>
      </div>

      {/* Calorie Progress */}
      <Card className="bg-[#1a0b2e] border-[#2a1545]">
        <CardContent className="pt-6">
          <CalorieProgress consumed={totalCalories} goal={goal} />
          {/* Editable goal */}
          <div className="mt-3 flex justify-center">
            {editingGoal ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-24 h-7 text-sm bg-[#0b0114] border-[#2a1545] text-white text-center"
                  onKeyDown={(e) => e.key === "Enter" && saveGoal()}
                />
                <Button
                  size="sm"
                  onClick={saveGoal}
                  className="h-7 text-xs bg-[#d946ef] hover:bg-[#c026d3] text-white"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingGoal(false)}
                  className="h-7 text-xs text-[#94a3b8]"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setEditingGoal(true)}
                className="text-xs text-[#94a3b8]/50 hover:text-[#d946ef] transition-colors cursor-pointer"
              >
                Goal: {goal} cal &middot; tap to edit
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Macro Summary - uniform cards, accent colors only on numbers */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#1a0b2e] border-[#2a1545]">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-[#d946ef]">
              {Math.round(totalProtein)}g
            </p>
            <p className="text-xs text-[#94a3b8]">Protein</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a0b2e] border-[#2a1545]">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-[#2dd4bf]">
              {Math.round(totalCarbs)}g
            </p>
            <p className="text-xs text-[#94a3b8]">Carbs</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a0b2e] border-[#2a1545]">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-[#d946ef]/70">
              {Math.round(totalFat)}g
            </p>
            <p className="text-xs text-[#94a3b8]">Fat</p>
          </CardContent>
        </Card>
      </div>

      {/* Meals */}
      <Card className="bg-[#1a0b2e] border-[#2a1545]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Meals</CardTitle>
          {isToday && (
            <Button
              asChild
              size="sm"
              className="bg-[#d946ef] hover:bg-[#c026d3] text-white"
            >
              <Link href="/log">+ Log Meal</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {logs.length === 0 ? (
            <p className="text-[#94a3b8]/40 text-center py-6">
              No meals logged {isToday ? "yet" : "this day"}
            </p>
          ) : (
            logs.map((log) => (
              <MealLogCard
                key={log.id}
                log={log}
                onDelete={handleDeleteLog}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
