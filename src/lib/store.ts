"use client";

import { LOCALSTORAGE_KEYS } from "./constants";
import { Habit } from "../types/habit";
import { Session, User } from "../types/auth";

const EMPTY_ARRAY: any[] = [];
const INITIAL_SESSION = null;

// Add undefined to the possible types
function createLocalStorageStore<T>(
  key: keyof typeof LOCALSTORAGE_KEYS,
  initialValue: T,
) {
  let lastRawValue: string | null = null;
  let cachedValue: T | undefined = undefined;

  return {
    subscribe(onStoreChange: () => void) {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("local-persist", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("local-persist", onStoreChange);
      };
    },

    getSnapshot() {
      if (typeof window === "undefined") return undefined;
      const rawValue = localStorage.getItem(LOCALSTORAGE_KEYS[key]);
      if (cachedValue === undefined || rawValue !== lastRawValue) {
        lastRawValue = rawValue;
        cachedValue = rawValue ? JSON.parse(rawValue) : initialValue;
      }
      return cachedValue as T;
    },

    getStaticSnapshot() {
      return undefined;
    },

    set(value: T) {
      localStorage.setItem(LOCALSTORAGE_KEYS[key], JSON.stringify(value));
      window.dispatchEvent(new Event("local-persist"));
    },
  };
}

// Initialize stores for varoius records
export const usersStore = createLocalStorageStore<User[]>("users", EMPTY_ARRAY);
export const habitsStore = createLocalStorageStore<Habit[]>(
  "habits",
  EMPTY_ARRAY,
);
export const sessionStore = createLocalStorageStore<Session | null>(
  "session",
  INITIAL_SESSION,
);
