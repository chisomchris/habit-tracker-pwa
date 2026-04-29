"use client";

import { useSyncExternalStore } from "react";
import { habitsStore } from "../../lib/store";
import { useSession } from "./useSession";

export function useHabits() {
  const session = useSession();
  const allHabits = useSyncExternalStore(
    habitsStore.subscribe,
    habitsStore.getSnapshot,
    habitsStore.getStaticSnapshot,
  );

  const habits = allHabits
    ? allHabits.filter((h) => h.userId === session?.userId)
    : [];

  const getHabit = (id: string) => habits.find((h) => h.id === id);

  return {
    habits,
    getHabit,
  };
}
