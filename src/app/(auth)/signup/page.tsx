import { SignupForm } from "@/app/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Habit Tracker",
};

export default function Page() {
  return (
    <main className="px-4 grid place-items-center min-h-dvh">
      <SignupForm />
    </main>
  );
}
