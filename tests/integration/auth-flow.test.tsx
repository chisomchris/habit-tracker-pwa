import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignupForm } from "../../src/app/components/auth/SignupForm";
import { LoginForm } from "../../src/app/components/auth/LoginForm";

// Mock useRouter from Next.js
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("submits the signup form and creates a session", async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      const session = JSON.parse(
        localStorage.getItem("habit-tracker-session") || "{}",
      );
      expect(session.email).toBe("test@example.com");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error for duplicate signup email", async () => {
    // Pre-populate a user
    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([{ email: "test@example.com", password: "123" }]),
    );

    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeDefined();
    });
  });

  it("submits the login form and stores the active session", async () => {
    // Pre-populate a user
    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([{ email: "login@example.com", password: "password123" }]),
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "login@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      const session = JSON.parse(
        localStorage.getItem("habit-tracker-session") || "{}",
      );
      expect(session.email).toBe("login@example.com");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error for invalid login credentials", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeDefined();
    });
  });
});
