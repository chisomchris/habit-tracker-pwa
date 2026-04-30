"use client";

import { useSearchParams } from "next/navigation";
import { HabitList } from "../components/habits/HabitList";
import { Navbar } from "../components/shared/NavBar";
import { Button } from "../components/ui/Button";
import { useRoute } from "../hooks/useRoute";
import { useHabits } from "../hooks/useHabits";
import { HabitForm } from "../components/habits/HabitForm";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";

export function Dashboard() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const id = searchParams.get("id");
  const open = action === "create" || action === "edit";
  const { goTo } = useRoute();
  const openNewHabitForm = () => {
    goTo({ action: "create" });
  };
  const { habits } = useHabits();

  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <main data-testid="dashboard-page" className="min-h-dvh py-4 sm:py-6">
          <div className="wrapper">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">My Habits</h1>
              <Button
                onClick={openNewHabitForm}
                className="px-4 py-2 shadow-sm transition-colors"
                data-testid="create-habit-button"
              >
                + Add Habit
              </Button>
            </header>

            <HabitForm
              open={open}
              mode={action as "create" | "edit"}
              targetId={id}
              onClose={() => goTo(null)}
            />

            {habits.length === 0 ? (
              <div
                data-testid="empty-state"
                className="flex flex-col items-center justify-center mt-20 py-20 bg-card rounded-2xl border-2 border-dashed border-border"
              >
                <div className="w-16 h-16 bg-card-muted rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h2>No habits yet</h2>
                <p className="text-center pt-2 text-subtle-foreground">
                  Start your journey by adding your first daily goal.
                </p>
              </div>
            ) : (
              <>
                <HabitList habits={habits} />
              </>
            )}
          </div>
        </main>
      </ProtectedRoute>
    </>
  );
}
