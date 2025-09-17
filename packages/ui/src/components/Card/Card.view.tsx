// /frontend/shared/src/components/ui/Card/Card.view.tsx
import { CardProps } from "./Card.types";

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
	const roundedMap: Record<string, string> = {
		none: "rounded-none",
		sm: "rounded-sm",
		md: "rounded-md",
		lg: "rounded-lg",
		full: "rounded-full",
	};

	const paddingMap: Record<string, string> = {
		none: "p-0",
		sm: "p-2",
		md: "p-4",
		lg: "p-6",
	};

	const widthMap: Record<string, string> = {
		full: "w-full",
		half: "w-1/2",
		third: "w-1/3",
		quarter: "w-1/4",
	};

	const heightMap: Record<string, string> = {
		none: "h-auto",
		sm: "h-32",
		md: "h-48",
		lg: "h-64",
		full: "h-full",
	};

	const baseClasses = `
    ${background}
    ${roundedMap[rounded]}
    ${paddingMap[padding]}
    ${widthMap[width ?? "full"]}
    ${heightMap[height ?? "auto"]}
    inline-flex flex-col items-center justify-center text-center
    m-2
    ${hoverable ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
    ${className}
  `;

	return (
		<div
			className={`${baseClasses} ${loading ? "opacity-50 animate-pulse" : ""}`}
			aria-label={ariaLabel}
			{...(onClick && {
				onClick,
				role: "button",
				tabIndex: 0,
				onKeyUp: (e: React.KeyboardEvent) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onClick();
					}
				},
			})}
		>
			{media && <div className="mb-2 text-green-500">{media}</div>}
			{title && <div className="font-semibold text-gray-800">{title}</div>}
			{children}
		</div>
	);
};
