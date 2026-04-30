import { createSession, getUser, createUser } from "./storage";
import { sessionStore } from "./store";

export function login(email: string, password: string) {
  const user = getUser(email, "email");
  if (!user || user.password !== password)
    throw Error("Invalid email or password");
  createSession(user.id, user.email);
  return true;
}

export function signup(email: string, password: string) {
  const user = getUser(email, "email");
  if (user) throw Error("User already exists");
  const newUser = createUser({ email, password });
  if (newUser) {
    createSession(newUser.id, newUser.email);
  }
  return true;
}

export function logout() {
  sessionStore.set(null);
}
