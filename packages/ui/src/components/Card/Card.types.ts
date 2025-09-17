// /frontend/shared/src/components/ui/Card/Card.types.ts
import { ReactNode } from "react";

export interface CardProps {
	// Core content
	title?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	media?: ReactNode;

	// Layout & visuals
	collapsible?: boolean;
	isCollapsed?: boolean;
	defaultCollapsed?: boolean;
	color?: "primary" | "secondary" | "danger";
	variant?: "filled" | "outlined";
	size?: "small" | "medium" | "large";
	width?: "full" | "half" | "quarter" | "third";
	elevation?: "none" | "sm" | "md" | "lg";
	rounded?: "none" | "sm" | "md" | "lg" | "full";
	border?: boolean;
	background?: string;
	padding?: "none" | "sm" | "md" | "lg";
	height?: "none" | "sm" | "md" | "lg" | "full";

	// State & behavior
	onClick?: () => void;
	disabled?: boolean;
	hoverable?: boolean;
	selected?: boolean;
	loading?: boolean;
	ariaLabel?: string;

	// Header extras
	headerActions?: ReactNode;

	// Internal
	onToggleCollapse?: () => void;
	className?: string;
}
