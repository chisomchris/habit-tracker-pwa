"use client";

import { getHabitSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
}

export function Checkbox({ checked, onChange, label, id }: CheckboxProps) {
  return (
    <label className="flex items-center cursor-pointer group transition-all active:scale-[0.98]">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
        data-testid={`habit-complete-${getHabitSlug(label)}`}
        aria-label={label || "Checkbox"}
      />

      {/* Custom Box UI */}
      <div
        className={cn(
          "shrink-0 w-9 h-9 flex items-center justify-center rounded-md transition-all duration-300 border-2",
          "bg-background border-transparent text-transparent",
          "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white",
          "peer-focus-visible:ring-1 peer-focus-visible:ring-primary/75 peer-focus-visible:ring-offset-2",
        )}
      >
        <Check
          size={24}
          strokeWidth={3}
          className={`transition-transform duration-300 ${checked ? "scale-100" : "scale-50"}`}
        />
      </div>
    </label>
  );
}
