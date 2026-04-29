import { Metadata } from "next";
import { LoginForm } from "../../components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | Habit Tracker",
};

export default function Page() {
  return (
    <main className="px-4 grid place-items-center min-h-dvh">
      <LoginForm />
    </main>
  );
}
