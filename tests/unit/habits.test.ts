import { toggleHabitCompletion } from "../../src/lib/habits";
import { Habit } from "../../src/types/habit";
import { describe, it, expect } from "vitest";

describe("toggleHabitCompletion", () => {
  const mockHabit: Habit = {
    id: "1",
    name: "Morning Meditation",
    userId: "chisom",
    description: "",
    frequency: "daily",
    completions: ["2026-04-24"],
    createdAt: "2026-04-20",
  };

  it("adds a completion date when the date is not present", () => {
    const dateToAdd = "2026-04-26";
    const result = toggleHabitCompletion(mockHabit, dateToAdd);

    expect(result.completions).toContain(dateToAdd);
    expect(result.completions.length).toBe(2);
  });

  it("removes a completion date when the date already exists", () => {
    const dateToRemove = "2026-04-24";
    const result = toggleHabitCompletion(mockHabit, dateToRemove);

    expect(result.completions).not.toContain(dateToRemove);
    expect(result.completions.length).toBe(0);
  });

  it("does not mutate the original habit object", () => {
    // Verifies Rule: the original input should not be mutated
    const originalCompletionsCount = mockHabit.completions.length;
    const dateToAdd = "2026-04-25";

    const toggledHabit = toggleHabitCompletion(mockHabit, dateToAdd);

    // Original object must remain unchanged
    expect(mockHabit.completions.length).toBe(originalCompletionsCount);
    expect(mockHabit.completions).not.toContain(dateToAdd);
    expect(mockHabit).not.toBe(toggledHabit);
  });

  it("does not return duplicate completion dates", () => {
    const dateToDuplicate = "2026-04-25";
    const habitWithPotentialDupes = {
      ...mockHabit,
      completions: [dateToDuplicate, "2026-04-24"],
    };

    // Attempting to add a date that is technically logic-toggled but ensuring final state purity
    const result = toggleHabitCompletion(
      habitWithPotentialDupes,
      dateToDuplicate,
    );

    // Check that we only have the remaining unique date
    const uniqueDates = new Set(result.completions);
    expect(uniqueDates.size).toBe(result.completions.length);
  });
});
