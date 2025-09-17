// /frontend/shared/src/components/ui/Button/Button.types.ts
import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger";
	size?: "small" | "medium" | "large";
	children: ReactNode;
	className?: string;
}
