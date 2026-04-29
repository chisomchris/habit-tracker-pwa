"use client";

import React from "react";
import { Logo } from "./Logo";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/hooks/useSession";

export const SplashScreen: React.FC = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [session, router]);

  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 flex flex-col items-center justify-center z-50 px-4"
    >
      <div className="flex flex-col items-center">
        <Logo />

        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Habit Tracker
        </h1>
        <p className="mt-2 text-subtle-foreground animate-pulse">
          Loading your progress...
        </p>
      </div>
    </div>
  );
};
