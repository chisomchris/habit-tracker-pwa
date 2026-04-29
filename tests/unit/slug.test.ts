import { getHabitSlug } from "../../src/lib/slug";
import { describe, it, expect } from "vitest";

describe("getHabitSlug", () => {
  it("returns lowercase hyphenated slug for a basic habit name", () => {
    const result = getHabitSlug("Drink Water");
    expect(result).toBe("drink-water");

    const anotherResult = getHabitSlug("READ BOOKS");
    expect(anotherResult).toBe("read-books");
  });

  it("trims outer spaces and collapses repeated internal spaces", () => {
    const result = getHabitSlug("   Morning   Run   ");
    expect(result).toBe("morning-run");
  });

  it("removes non alphanumeric characters except hyphens", () => {
    const result = getHabitSlug("Gym & Fitness 4#!");
    expect(result).toBe("gym-fitness-4");

    const resultWithHyphen = getHabitSlug("User-Generated Content 101");
    expect(resultWithHyphen).toBe("user-generated-content-101");
  });

  it("removes repeated hyphens", () => {
    const result = getHabitSlug("Gym-- & --Fitness!");
    expect(result).toBe("gym-fitness");
  });

  it("trims leading and trailing hyphens", () => {
    const result = getHabitSlug("--Morning   Run   --");
    expect(result).toBe("morning-run");
  });
});
