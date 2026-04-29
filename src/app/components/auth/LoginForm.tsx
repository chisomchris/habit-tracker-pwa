"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth";
import { Button } from "../ui/Button";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const logged = login(email, password);
      if (logged) router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 w-full max-w-sm"
    >
      <div>
        <label className="block text-subtle-foreground mb-1">
          Email Address
        </label>
        <input
          type="email"
          data-testid="auth-login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-subtle-foreground mb-1">Password</label>
        <input
          type="password"
          data-testid="auth-login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-secondary">{error}</p>}

      <Button
        type="submit"
        data-testid="auth-login-submit"
        className="w-full transition-colors mt-2"
      >
        Login
      </Button>
      <div>
        <p className="text-subtle-foreground">
          Don't have an account yet?{" "}
          <Link href={"/signup"} className="text-primary font-bold">
            Sign Up Here
          </Link>
        </p>
      </div>
    </form>
  );
};
