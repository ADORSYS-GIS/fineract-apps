// Navbar.types.ts
import { ReactNode } from "react";

export type NavbarVariant = "default" | "primary" | "transparent";
export type NavbarSize = "sm" | "md" | "lg";

export interface NavbarProps {
  logo?: ReactNode;
  links?: ReactNode;             // nav links area (desktop)
  userSection?: ReactNode;       // user info / avatar / menu
  actions?: ReactNode;           // action buttons
  notifications?: ReactNode;     // bell or badge
  className?: string;
  variant?: NavbarVariant;
  size?: NavbarSize;

  // mobile menu
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
}
