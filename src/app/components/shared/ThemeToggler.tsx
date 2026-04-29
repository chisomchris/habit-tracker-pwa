"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  const themes = [
    { name: "light", icon: <Sun /> },
    { name: "dark", icon: <Moon /> },
    { name: "system", icon: <Laptop /> },
  ];

  return (
    <div
      className="relative place-items-center inline-grid px-3  text-left"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 aspect-square text-white  transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Sun /> : theme === "dark" ? <Moon /> : <Laptop />}
      </button>

      {isOpen && (
        <div
          className={`
            absolute z-50 w-32 rounded-md border border-foreground/10 bg-background shadow-lg focus:outline-none
            top-full right-0 mt-2 origin-top-right
          `}
        >
          <div className="py-1">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setTheme(t.name);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2 text-sm capitalize transition-colors ${
                  theme === t.name
                    ? "bg-foreground/5 font-bold text-primary"
                    : "text-foreground/70 hover:bg-foreground/5"
                }`}
              >
                <span className="mr-2 text-base">{t.icon}</span>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
