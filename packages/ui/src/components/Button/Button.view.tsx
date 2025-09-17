// /frontend/shared/src/components/ui/Button/Button.view.tsx
import { ButtonProps } from "./Button.types";

export const ButtonView = ({
	children,
	variant = "primary",
	size = "medium",
	disabled,
	onClick,
	type = "button",
	className,
	...rest
}: ButtonProps) => {
	const baseStyles =
		"rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
	const variantStyles = {
		primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
		secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
		danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
	};
	const sizeStyles = {
		small: "px-2 py-1 text-sm",
		medium: "px-4 py-2 text-base",
		large: "px-6 py-3 text-lg",
	};
	const disabledStyles = disabled ? "opacity-65 cursor-not-allowed" : "";

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className || ""}`}
			onClick={onClick}
			disabled={disabled}
			type={type}
			{...rest}
		>
			{children}
		</button>
	);
};
