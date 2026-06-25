"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

// Install cva: npm i class-variance-authority (already listed as dep)

const button = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium rounded select-none cursor-pointer",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg-base",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-accent text-white",
          "hover:bg-[#6B4EE8] active:bg-[#5A3FD6]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
        ],
        secondary: [
          "bg-bg-elevated text-text-primary border border-border-strong",
          "hover:bg-bg-overlay hover:border-border-strong",
          "active:scale-[0.99]",
        ],
        ghost: [
          "text-text-secondary",
          "hover:bg-white/5 hover:text-text-primary",
          "active:bg-white/[0.03]",
        ],
        danger: [
          "bg-critical/10 text-critical border border-critical/20",
          "hover:bg-critical/20",
        ],
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-sm",
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={button({ variant, size, className })}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-3.5 w-3.5 opacity-60"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
