import { ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { cardVariants } from "./Card.variants";

export interface CardProps
  extends VariantProps<typeof cardVariants> {
  title?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  children: ReactNode;

  onClick?: () => void;
  loading?: boolean;
  ariaLabel?: string;
  className?: string;
}
