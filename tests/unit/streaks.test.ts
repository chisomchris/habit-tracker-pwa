import { calculateCurrentStreak } from "../../src/lib/streaks";
import { describe, it, expect } from "vitest";

describe("calculateCurrentStreak", () => {
  const mockToday = "2026-04-25";
  const mockYesterday = "2026-04-24";
  const mockTwoDaysAgo = "2026-04-23";

  it("returns 0 when completions is empty", () => {
    expect(calculateCurrentStreak([], mockToday)).toBe(0);
  });

  it("returns 0 when today is not completed", () => {
    const completions = [mockYesterday, mockTwoDaysAgo];
    expect(calculateCurrentStreak(completions, mockToday)).toBe(0);
  });

  it("returns the correct streak for consecutive completed days", () => {
    const completions = [mockToday, mockYesterday, mockTwoDaysAgo];
    expect(calculateCurrentStreak(completions, mockToday)).toBe(3);
  });

  it("ignores duplicate completion dates", () => {
    const completions = [mockToday, mockToday, mockYesterday, mockYesterday];
    expect(calculateCurrentStreak(completions, mockToday)).toBe(2);
  });

  it("breaks the streak when a calendar day is missing", () => {
    const completions = [mockToday, mockTwoDaysAgo];
    expect(calculateCurrentStreak(completions, mockToday)).toBe(1);
  });
});
