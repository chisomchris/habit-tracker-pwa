"use client";
import { Session, User } from "../types/auth";
import { Habit } from "../types/habit";
import { habitsStore, sessionStore, usersStore } from "./store";
import { generateUUID } from "./utils";

export function createUser(user: Pick<User, "email" | "password">) {
  const users = usersStore.getSnapshot();
  if (users) {
    const newUser: User = {
      id: generateUUID(),
      email: user.email,
      password: user.password,
      createdAt: new Date().toISOString(),
    };
    usersStore.set([...users, newUser]);
    return newUser;
  }
}

export function getUser(value: string, key: "id" | "email" = "id") {
  const users = usersStore.getSnapshot();
  if (users) {
    const user = users.find((user) => user[key] === value);
    return user;
  }
}

export function createSession(
  userId: Session["userId"],
  email: Session["email"],
) {
  sessionStore.set({ userId, email });
}

export function createHabit(
  userId: string,
  habit: Pick<Habit, "name" | "description" | "frequency">,
) {
  const user = getUser(userId);
  if (!user) throw Error("Invalid User Id");

  const currentHabits = habitsStore.getSnapshot();
  if (currentHabits) {
    const newHabit: Habit = {
      ...habit,
      id: generateUUID(),
      userId,
      createdAt: new Date().toISOString(),
      completions: [],
    };

    habitsStore.set([newHabit, ...currentHabits]);
  }
}

export function updateHabit(
  habitId: string,
  updates: Partial<
    Pick<Habit, "name" | "description" | "frequency" | "completions">
  >,
) {
  const currentHabits = habitsStore.getSnapshot();
  if (currentHabits) {
    const habitExists = currentHabits.some((h) => h.id === habitId);
    if (!habitExists) throw Error("Habit not found");

    const updatedHabits = currentHabits.map((habit) => {
      if (habit.id === habitId) {
        return {
          ...habit,
          ...updates,
        };
      }
      return habit;
    });

    habitsStore.set(updatedHabits);
  }
}

export function deleteHabit(habitId: string) {
  const currentHabits = habitsStore.getSnapshot() ?? [];

  const habitExists = currentHabits.some((h) => h.id === habitId);
  if (!habitExists) throw Error("Habit not found");

  const updatedHabits = currentHabits.filter((habit) => habit.id !== habitId);

  habitsStore.set(updatedHabits);
}
