// /frontend/shared/src/components/ui/Card/Card.types.ts
import { ReactNode } from "react";

export interface CardProps {
	// Core content
	title?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	media?: ReactNode;

	// Layout & visuals (reduced)
	width?: "full" | "half" | "quarter" | "third";
	rounded?: "none" | "sm" | "md" | "lg" | "full";
	background?: string;
	padding?: "none" | "sm" | "md" | "lg";
	height?: "none" | "sm" | "md" | "lg" | "full";

	// State & behavior
	onClick?: () => void;
	hoverable?: boolean;
	loading?: boolean;
	ariaLabel?: string;

	// Header extras
	headerActions?: ReactNode;
	className?: string;
}
