// Navbar.styles.ts
import { cva } from "class-variance-authority";

export const navbarVariant = cva(
  "flex justify-between items-center border-b px-6 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200",
        primary: "bg-white border border-white text-white",
        transparent: "bg-transparent border-transparent",
      },
      size: {
        sm: "py-2 text-sm",
        md: "py-3 text-base",
        lg: "py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
