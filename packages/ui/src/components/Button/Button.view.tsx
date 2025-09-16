import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ButtonProps } from "./Button.types";

export const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
	{
		variants: {
			variant: {
				default:
					"bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
				destructive:
					"bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
				outline:
					"border border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50",
				secondary:
					"bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
				ghost:
					"hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
				link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
			},
			size: {
				default: "h-10 py-2 px-4",
				sm: "h-9 px-3 rounded-md",
				lg: "h-11 px-8 rounded-md",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export const ButtonView = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, children, variant, size, isLoading, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={isLoading}
				{...props}
			>
				{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
				{children}
			</button>
		);
	},
);

ButtonView.displayName = "ButtonView";
