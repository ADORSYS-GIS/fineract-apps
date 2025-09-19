import { cva } from "class-variance-authority";

export const inputVariants = cva(
	"w-full px-3 py-2 transition-all duration-200 ease-in-out rounded-md focus:outline-none",
	{
		variants: {
			size: {
				sm: "text-sm",
				md: "text-base",
				lg: "text-lg",
			},
			variant: {
				outlined: "border focus:ring-1",
				filled: "focus:ring-1",
				standard: "border-b rounded-none",
			},
			error: {
				true: "",
				false: "",
			},
		},
		compoundVariants: [
			{
				variant: "outlined",
				error: true,
				className: "border-red-500 focus:ring-red-500",
			},
			{
				variant: "outlined",
				error: false,
				className:
					"border-gray-300 focus:border-green-500 focus:ring-green-500",
			},
			{
				variant: "filled",
				error: true,
				className: "bg-gray-100 border-red-500 focus:ring-red-500",
			},
			{
				variant: "filled",
				error: false,
				className:
					"bg-gray-100 border-transparent focus:border-green-500 focus:ring-green-500",
			},
			{
				variant: "standard",
				error: true,
				className: "border-red-500 focus:border-red-500",
			},
			{
				variant: "standard",
				error: false,
				className: "border-gray-300 focus:border-green-500",
			},
		],
		defaultVariants: {
			size: "md",
			variant: "outlined",
			error: false,
		},
	},
);
