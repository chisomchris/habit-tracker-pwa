import { cn } from "@/lib/utils";
import Image from "next/image";

type ElementProps = React.HTMLAttributes<HTMLElement> & {
  size?: keyof typeof sizes;
};

const sizes = {
  sm: "w-12 h-12 rounded-lg",
  md: "w-16 h-16 rounded-xl",
  lg: "w-20 h-20 rounded-2xl",
};

export const Logo = ({ size = "md", className, ...props }: ElementProps) => {
  return (
    <div
      className={cn(
        "bg-primary rounded-2xl flex items-center justify-center shadow-lg",
        sizes[size],
        className,
      )}
      {...props}
    >
      <Image
        src="/icons/logo.svg"
        alt="Brand Icon"
        width={size == "sm" ? 30 : size == "md" ? 36 : 42}
        height={size == "sm" ? 30 : size == "md" ? 36 : 42}
        className="w-auto"
      />
    </div>
  );
};
