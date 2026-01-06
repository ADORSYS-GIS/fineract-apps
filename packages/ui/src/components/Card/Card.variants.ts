import { cva } from "class-variance-authority";

export const cardVariants = cva(
	"w-full flex flex-col justify-start rounded-lg transition-shadow",
	{
		variants: {
			variant: {
				default: "bg-card text-card-foreground shadow-sm",
				muted: "bg-card-muted text-card-foreground",
				elevated: "bg-card text-card-foreground shadow-lg",
				outlined: "border border-card-border bg-transparent",
			},
			size: {
				sm: "p-2 gap-1",
				md: "p-4 gap-2",
				lg: "p-6 gap-3",
			},
			hoverable: {
				true: "cursor-pointer hover:shadow-lg",
				false: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			hoverable: false,
		},
	},
);
