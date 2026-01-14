import { ReactNode } from "react";

export interface ActionButton {
	label: string;
	onClick: () => void;
	variant?:
		| "default"
		| "secondary"
		| "outline"
		| "ghost"
		| "link"
		| "destructive";
	icon?: ReactNode;
	disabled?: boolean;
}

export interface PageHeaderProps {
	title: string;
	subtitle?: string;
	actions?: ActionButton[];
	className?: string;
}
