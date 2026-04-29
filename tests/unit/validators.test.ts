import { validateHabitName } from "../../src/lib/validators";
import { describe, it, expect } from "vitest";

describe("validateHabitName", () => {
  it("returns an error when habit name is empty", () => {
    const result = validateHabitName("   ");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Habit name is required");
  });

  it("returns an error when habit name exceeds 60 characters", () => {
    const longName =
      "This habit name is intentionally designed to be much longer than sixty characters";
    const result = validateHabitName(longName);

    expect(result.valid).toBe(false);
    expect(result.error).toBe("Habit name must be 60 characters or fewer");
  });

  it("returns a trimmed value when habit name is valid", () => {
    const result = validateHabitName("  Drink Water  ");

    expect(result.valid).toBe(true);
    expect(result.value).toBe("Drink Water");
    expect(result.error).toBeNull();
  });
});
