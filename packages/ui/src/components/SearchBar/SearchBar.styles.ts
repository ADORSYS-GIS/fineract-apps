import { cva } from "class-variance-authority";

export const searchBarVariants = cva(
	"flex items-center border border-border rounded-lg bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-colors",
	{
		variants: {
			variant: {
				default: "",
				withButton: "pr-0", // Remove padding-right when button is present
			},
			size: {
				sm: "h-8 text-sm",
				md: "h-10 text-base",
				lg: "h-12 text-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

export const inputVariants = cva(
	"flex-1 bg-transparent border-none outline-none placeholder-muted-foreground text-foreground",
	{
		variants: {
			size: {
				sm: "px-3 py-1 text-sm",
				md: "px-4 py-2 text-base",
				lg: "px-5 py-3 text-lg",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

export const buttonVariants = cva(
	"flex items-center justify-center border-none bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			size: {
				sm: "px-3 h-8 text-sm rounded-r-lg",
				md: "px-4 h-10 text-base rounded-r-lg",
				lg: "px-5 h-12 text-lg rounded-r-lg",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);
