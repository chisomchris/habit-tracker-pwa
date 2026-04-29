import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "../../src/app/dashboard/page";
import { HabitForm } from "../../src/app/components/habits/HabitForm";
import { Habit } from "@/types/habit";
import { User } from "@/types/auth";

let mockAction = "create";
let mockId = "";

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    useSearchParams: vi.fn(() => ({
      get: vi.fn((key: string) => {
        if (key === "action") return mockAction;
        if (key === "id") return mockId;
        return null;
      }),
    })),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
    })),
  };
});

describe("habit form", () => {
  const user: User = {
    id: "user-123",
    email: "test@user.com",
    password: "password",
    createdAt: new Date().toDateString(),
  };
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify({
        userId: user.id,
        email: user.email,
      }),
    );
    localStorage.setItem("habit-tracker-users", JSON.stringify([user]));
    vi.clearAllMocks();
  });

  it("shows a validation error when habit name is empty", async () => {
    render(
      <HabitForm
        open={true}
        mode="create"
        onClose={() => {}}
        onSave={() => {}}
        targetId={null}
      />,
    );

    const submitBtn = screen.getByTestId("habit-save-button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/habit name is required/i)).toBeDefined();
    });
  });

  it("creates a new habit and renders it in the list", async () => {
    render(<DashboardPage />);

    // Open form via the create button
    fireEvent.click(screen.getByTestId("create-habit-button"));

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink Water" },
    });
    fireEvent.change(screen.getByTestId("habit-description-input"), {
      target: { value: "8 glasses" },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByTestId("habit-card-drink-water")).toBeDefined();
      const saved = JSON.parse(
        localStorage.getItem("habit-tracker-habits") || "[]",
      );
      expect(saved[0].name).toBe("Drink Water");
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const mockHabit: Habit = {
      id: "uuid-123",
      userId: user.id,
      description: "",
      frequency: "daily",
      name: "Old Name",
      completions: [],
      createdAt: "2026-04-01T10:00:00Z",
    };

    mockAction = "edit";
    mockId = mockHabit.id;

    localStorage.setItem("habit-tracker-habits", JSON.stringify([mockHabit]));

    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("habit-edit-old-name"));
    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "New Name" },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      const saved = JSON.parse(
        localStorage.getItem("habit-tracker-habits") || "[]",
      );
      expect(saved[0].name).toBe("New Name");
      expect(saved.length).toBe(1);
      // ID and CreatedAt must remain the same
      expect(saved[0].id).toBe("uuid-123");
      expect(saved[0].createdAt).toBe("2026-04-01T10:00:00Z");
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const mockHabit: Habit = {
      id: "uuid-12356789",
      userId: user.id,
      description: "",
      frequency: "daily",
      name: "Delete me now",
      completions: [],
      createdAt: "2026-04-01T10:00:00Z",
    };
    localStorage.setItem("habit-tracker-habits", JSON.stringify([mockHabit]));

    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("habit-delete-delete-me-now"));

    // Ensure it's still in storage before confirmation
    expect(
      JSON.parse(localStorage.getItem("habit-tracker-habits") || "[]"),
    ).toHaveLength(1);

    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem("habit-tracker-habits") || "[]"),
      ).toHaveLength(0);
      expect(screen.queryByTestId("habit-card-delete-me")).toBeNull();
    });
  });

  it("toggles completion and updates the streak display", async () => {
    const today = new Date().toISOString().split("T")[0];
    const existingHabit: Habit = {
      id: "uuid-123",
      userId: user.id,
      description: "",
      frequency: "daily",
      name: "Test Case",
      completions: [],
      createdAt: "2026-04-01T10:00:00Z",
    };
    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([existingHabit]),
    );

    render(<DashboardPage />);

    const completeBtn = screen.getByTestId("habit-complete-test-case");
    fireEvent.click(completeBtn);

    await waitFor(() => {
      const streakEl = screen.getByTestId("habit-streak-test-case");
      expect(streakEl.textContent).toContain("1");

      const saved = JSON.parse(
        localStorage.getItem("habit-tracker-habits") || "[]",
      );
      expect(saved[0].completions).toContain(today);
    });
  });
});
