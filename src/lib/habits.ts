import { Habit } from "../types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const isCompleted = habit.completions.includes(date);
  let newCompletions: string[];
  if (isCompleted) {
    newCompletions = habit.completions.filter((d) => d !== date);
  } else {
    newCompletions = Array.from(new Set([...habit.completions, date]));
  }
  return {
    ...habit,
    completions: newCompletions,
  };
}
