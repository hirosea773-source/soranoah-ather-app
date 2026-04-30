import * as React from "react";
import { cn } from "@/components/lib/utils";

const badgeVariants = {
  default: "bg-slate-100 text-slate-900",
  secondary: "bg-blue-100 text-blue-900",
  destructive: "bg-red-100 text-red-900",
};

type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export { Badge };
