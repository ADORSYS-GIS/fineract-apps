import { cva } from "class-variance-authority";

export const navbarVariant = cva(
	"flex justify-between items-center border-b px-6 shadow-sm",
	{
		variants: {
			variant: {
				default: "bg-navbar border-navbar-border",
				primary:
					"bg-navbar-primary border-navbar-primary text-navbar-primary-foreground",
				transparent: "bg-navbar-transparent border-transparent",
			},
			size: {
				sm: "py-2 text-sm",
				md: "py-3 text-base",
				lg: "py-4 text-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);
