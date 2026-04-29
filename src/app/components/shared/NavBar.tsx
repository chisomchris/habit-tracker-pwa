"use client";

import React from "react";
import { Logo } from "./Logo";
import { ThemeToggler } from "./ThemeToggler";
import { useSession } from "@/app/hooks/useSession";
import { Logout } from "./Logout";

export const Navbar: React.FC = () => {
  const session = useSession();

  return (
    <nav className="py-3 bg-sidebar">
      <div className="flex items-center justify-between wrapper">
        <Logo size="sm" />

        <div className="flex items-center gap-2">
          <ThemeToggler />
          {session ? <Logout /> : null}
        </div>
      </div>
    </nav>
  );
};
