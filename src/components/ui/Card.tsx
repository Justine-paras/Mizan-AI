import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  noPad?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ elevated, noPad, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border",
          elevated
            ? "bg-bg-elevated border-border-strong shadow-elevated"
            : "bg-bg-surface border-border shadow-card",
          !noPad && "p-5",
          "transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-between mb-4", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("text-sm font-medium text-text-primary tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-xs text-text-tertiary mt-0.5", className)}
    {...props}
  >
    {children}
  </p>
);

export default Card;
