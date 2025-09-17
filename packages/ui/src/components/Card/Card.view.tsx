// /frontend/shared/src/components/ui/Card/Card.view.tsx
import { CardProps } from "./Card.types";

const ROUNDED_MAP: Record<string, string> = {
	none: "rounded-none",
	sm: "rounded-sm",
	md: "rounded-md",
	lg: "rounded-lg",
	full: "rounded-full",
};

const PADDING_MAP: Record<string, string> = {
	none: "p-0",
	sm: "p-2",
	md: "p-4",
	lg: "p-6",
};

const WIDTH_MAP: Record<string, string> = {
	full: "w-full",
	half: "w-1/2",
	third: "w-1/3",
	quarter: "w-1/4",
};

const HEIGHT_MAP: Record<string, string> = {
	none: "h-auto",
	sm: "h-32",
	md: "h-48",
	lg: "h-64",
	full: "h-full",
};

export const CardView = ({
	title,
	children,
	className = "",
	media,
	onClick,
	background = "bg-gray-100",
	rounded = "lg",
	hoverable = true,
	padding = "lg",
	loading = false,
	ariaLabel,
	width = "third",
	height = "md",
}: CardProps) => {
	const classes = [
		background,
		ROUNDED_MAP[rounded],
		PADDING_MAP[padding],
		WIDTH_MAP[width ?? "full"],
		HEIGHT_MAP[height ?? "auto"],
		"inline-flex flex-col items-center justify-center text-center",
		"m-2",
		hoverable ? "cursor-pointer hover:shadow-md transition-shadow" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const loadingClass = loading ? "opacity-50 animate-pulse" : "";

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
		<div
			className={`${classes} ${loadingClass}`.trim()}
			aria-label={ariaLabel}
			{...interactiveProps}
		>
			{media && <div className="mb-2 text-green-500">{media}</div>}
			{title && <div className="font-semibold text-gray-800">{title}</div>}
			{children}
		</div>
	);
};
