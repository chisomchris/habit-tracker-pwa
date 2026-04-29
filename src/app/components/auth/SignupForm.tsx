"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/lib/auth";
import { Button } from "../ui/Button";

export const SignupForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const created = signup(email, password);
      if (created) router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    setError(null);
  }, [email]);

  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-4 w-full max-w-sm"
    >
      <div>
        <label className="block text-subtle-foreground mb-1">
          Email Address
        </label>
        <input
          type="email"
          data-testid="auth-signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
          placeholder="create-email@example.com"
        />
      </div>

      <div>
        <label className="block text-subtle-foreground mb-1">Password</label>
        <input
          type="password"
          data-testid="auth-signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-secondary">{error}</p>}

      <Button
        type="submit"
        data-testid="auth-signup-submit"
        className="w-full py-2 transition-colors mt-2"
      >
        Create Account
      </Button>

      <div>
        <p className="text-subtle-foreground">
          Already have an account?{" "}
          <Link href={"/login"} className="text-primary font-bold">
            Login Here
          </Link>
        </p>
      </div>
    </form>
  );
};
