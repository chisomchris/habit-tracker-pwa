import { Habit } from "@/types/habit";
import React from "react";
import { HabitCard } from "./HabitCard";

interface HabitListProps {
  habits: Habit[];
}

export const HabitList: React.FC<HabitListProps> = ({ habits }) => {
  return (
    <ul className="grid gap-4">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitCard habit={habit} />
        </li>
      ))}
    </ul>
  );
};
