import { cva } from "class-variance-authority";

const baseSearchBarClasses = [
	"flex",
	"items-center",
	"gap-2",
	"px-3",
	"border",
	"border-border",
	"rounded-lg",
	"bg-background",
	"text-foreground",
	"focus-within:outline-none",
	"focus-within:ring-2",
	"focus-within:ring-ring",
	"focus-within:ring-offset-2",
	"ring-offset-background",
	"transition-colors",
	"disabled:cursor-not-allowed",
	"disabled:opacity-50",
].join(" ");

export const SearchBarVariants = cva(baseSearchBarClasses, {
	variants: {
		variant: {
			default: "",
			withButton: "pr-2",
			expandable: "transition-all duration-300",
		},
		size: {
			sm: "h-8 text-sm px-2",
			md: "h-10 text-sm px-3",
			lg: "h-11 text-base px-4",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

export const suggestionItemVariants = cva(
	`
	px-4
	py-2
	text-sm
	cursor-pointer
	transition-colors
	text-foreground
	focus-visible:outline-none
	focus-visible:ring-2
	focus-visible:ring-ring
	focus-visible:ring-offset-2
	ring-offset-background
	`,
	{
		variants: {
			highlighted: {
				true: "bg-accent text-accent-foreground",
				false: "hover:bg-accent hover:text-accent-foreground",
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
