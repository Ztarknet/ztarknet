import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] text-[#1b0e05] shadow-[0_10px_25px_rgba(255,107,26,0.35)] hover:shadow-[0_16px_35px_rgba(255,107,26,0.45)] hover:-translate-y-0.5",
        secondary:
          "border border-[rgba(255,107,26,0.4)] text-foreground hover:border-[var(--accent)] hover:-translate-y-0.5",
        ghost:
          "border border-[rgba(255,107,26,0.3)] text-foreground hover:border-[var(--accent)]",
        link: "text-[var(--accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-4 py-2 text-xs",
        lg: "px-6 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };


