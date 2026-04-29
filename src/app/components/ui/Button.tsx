import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
  outline: "border border-border text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export const Button = ({
  className,
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium p-2 text-sm transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
};
