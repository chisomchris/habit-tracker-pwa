"use client";

import React from "react";
import { Edit2 } from "lucide-react";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { toggleHabitCompletion } from "@/lib/habits";
import { ConfirmDelete } from "../shared/ConfirmDelete";
import { Checkbox } from "../shared/Checkbox";
import { useRoute } from "@/app/hooks/useRoute";
import { updateHabit } from "@/lib/storage";

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit?.completions?.includes(today) || false;
  const streak = calculateCurrentStreak(habit?.completions || []);

  const handleToggle = () => {
    const updated = toggleHabitCompletion(habit, today);
    updateHabit(updated.id, updated);
  };
  const { goTo } = useRoute();

  const openEditHabitForm = (id: string) => {
    goTo({ action: "edit", id });
  };

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="bg-card p-4 rounded-xl shadow-sm border border-border flex justify-between gap-4 transition-all hover:shadow-md"
    >
      <div className="flex-1">
        <h3>{habit.name}</h3>
        <p className="text-subtle-foreground line-clamp-3 ">
          {habit.description}
        </p>
        <div className="flex items-center py-2 gap-2">
          <span
            data-testid={`habit-streak-${slug}`}
            className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full"
          >
            {streak
              ? `🔥 ${streak} day${streak > 1 ? "s" : ""} streak`
              : "No streak"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
          <Checkbox
            checked={isCompletedToday}
            onChange={() => handleToggle()}
            label={habit.name}
          />

          <div className="text-foreground">
            <button
              data-testid={`habit-edit-${slug}`}
              className="p-3 hover:text-primary transition-colors"
              aria-label="Edit Habit"
              onClick={() => openEditHabitForm(habit.id)}
            >
              <Edit2 size={20} />
            </button>

            <ConfirmDelete id={habit.id} slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
};
