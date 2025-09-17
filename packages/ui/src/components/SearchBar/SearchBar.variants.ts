import { cva } from "class-variance-authority";

export const searchBarVariants = cva(
	"flex items-center bg-white rounded-lg shadow-sm transition-all duration-200",
	{
		variants: {
			variant: {
				default: "px-3 py-2 sm:px-4 sm:py-2 md:px-4 md:py-3",
				simple: "px-2 py-1 sm:px-3 sm:py-2",
				withButton:
					"px-3 py-2 sm:px-4 sm:py-2 md:px-4 md:py-3 border border-gray-200",
				expandable:
					"w-10 sm:w-12 hover:w-full focus-within:w-full px-2 py-2 sm:px-3 sm:py-2",
			},
			size: {
				sm: "text-sm",
				md: "text-base",
				lg: "text-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);
