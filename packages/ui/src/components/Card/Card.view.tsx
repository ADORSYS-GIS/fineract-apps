import { cardVariants } from "./Card.variants";
import { CardProps } from "./Card.types";
import { cn } from "../../lib/utils";

export const CardView = ({
  title,
  footer,
  media,
  children,
  variant,
  size,
  hoverable,
  className,
  onClick,
  loading = false,
  ariaLabel,
}: CardProps) => {
  const classes = cn(
    cardVariants({ variant, size, hoverable }),
    loading && "opacity-50 animate-pulse",
    className
  );

  const interactiveProps = onClick
    ? {
        onClick,
        role: "button" as const,
        tabIndex: 0,
        onKeyUp: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        },
      }
    : {};

  return (
    <div className={classes} aria-label={ariaLabel} {...interactiveProps}>
      {media && <div className="mb-2">{media}</div>}
      {title && <div className="font-semibold">{title}</div>}
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
};
