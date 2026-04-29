import { User } from "@/types/auth";
import { Habit } from "@/types/habit";
import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ email: "user@test.com" }),
      );
    });
    await page.goto("/");
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*login/);
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill("newuser@test.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-users",
        JSON.stringify([{ email: "pro@test.com", password: "123" }]),
      );
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          { id: "1", name: "User Habit", slug: "user-habit", completions: [] },
        ]),
      );
    });

    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill("pro@test.com");
    await page.getByTestId("auth-login-password").fill("123");
    await page.getByTestId("auth-login-submit").click();

    await expect(page.getByTestId("habit-card-user-habit")).toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.evaluate(() => {
      const user: User = {
        id: "test-user-123",
        email: "test@user.com",
        password: "password123",
        createdAt: new Date().toDateString(),
      };
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ email: user.email, userId: user.id }),
      );
      localStorage.setItem("habit-tracker-users", JSON.stringify([user]));
    });

    await page.goto("/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Morning Yoga");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-morning-yoga")).toBeVisible();
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ email: "user@test.com" }),
      );
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          { id: "1", name: "Persist", slug: "persist", completions: [] },
        ]),
      );
    });
    await page.goto("/dashboard");
    await page.reload();

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-persist")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await page.evaluate(() => {
      const user: User = {
        id: "test-user-123",
        email: "test-one@user.com",
        password: "password123",
        createdAt: new Date().toDateString(),
      };
      const mockHabit: Habit = {
        id: "uuid-12356789",
        userId: user.id,
        description: "",
        frequency: "daily",
        name: "test me now",
        completions: [],
        createdAt: "2026-04-01T10:00:00Z",
      };
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ email: user.email, userId: user.id }),
      );
      localStorage.setItem("habit-tracker-users", JSON.stringify([user]));
      localStorage.setItem("habit-tracker-habits", JSON.stringify([mockHabit]));
    });
    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible({
      timeout: 5000,
    });

    await page.getByTestId("habit-complete-test-me-now").click({ force: true });
    await expect(page.getByTestId("habit-streak-test-me-now")).toContainText(
      "1",
    );
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.evaluate(() => {
      const user: User = {
        id: "test-user-123",
        email: "test-one@user.com",
        password: "password123",
        createdAt: new Date().toDateString(),
      };
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ email: user.email, userId: user.id }),
      );
    });
    await page.goto("/dashboard");

    await expect(page.getByTestId("dashboard-page")).toBeVisible({
      timeout: 2000,
    });

    await page.getByTestId("auth-logout-button").click();

    const confirmBtn = page.getByTestId("auth-confirm-logout-button");
    await expect(confirmBtn).toBeVisible({ timeout: 5000 });
    await confirmBtn.click();

    await expect(page).toHaveURL(/.*login/);

    const session = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("habit-tracker-session") as string),
    );

    expect(session).toBeNull();
  });
});

test("service worker is active", async ({ page, context }) => {
  await context.clearCookies();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await new Promise((resolve) => {
      if (registration.active) resolve(true);
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener("statechange", () => {
          if (newWorker.state === "activated") resolve(true);
        });
      });
    });
  });
  await page.goto("/");
  const swState = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state;
  });
  expect(swState).toBe("activated");
});

test("loads the cached app shell when offline after the app has been loaded once", async ({
  context,
  page,
}) => {
  await context.clearCookies();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await new Promise((resolve) => {
      if (registration.active) resolve(true);
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener("statechange", () => {
          if (newWorker.state === "activated") resolve(true);
        });
      });
    });
  });
  await page.goto("/");
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText(/Habit Tracker/i)).toBeVisible();
  // await context.setOffline(false);
});
