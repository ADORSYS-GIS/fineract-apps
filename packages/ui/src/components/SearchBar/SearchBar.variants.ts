import { cva } from "class-variance-authority";

export const SearchBarVariants = cva(
	"flex items-center gap-2 px-3 border border-border rounded-lg bg-background focus-within:ring-2 focus-within:ring-ring transition-colors",
	{
		variants: {
			variant: {
				default: "",
				withButton: "pr-2",
				expandable: "transition-all duration-300",
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

export const suggestionItemVariants = cva(
	"px-4 py-2 text-sm cursor-pointer transition-colors",
	{
		variants: {
			highlighted: {
				true: "bg-accent text-accent-foreground",
				false: "hover:bg-accent/50",
			},
		},
		defaultVariants: {
			highlighted: false,
		},
	},
);

export const expandableContainerVariants = cva(
	"transition-all duration-300 ease-in-out overflow-hidden",
	{
		variants: {
			expanded: {
				true: "w-full max-w-md",
				false: "w-10",
			},
		},
		defaultVariants: {
			expanded: false,
		},
	},
);
