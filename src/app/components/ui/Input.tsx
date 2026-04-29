import { cn } from "@/lib/utils";
import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded-md bg-card border px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors",
          "placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/40",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          `${error ? "border-secondary" : "border-border"}`,
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
