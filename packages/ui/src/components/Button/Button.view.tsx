import { Loader2 } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ButtonProps } from "./Button.types";
import { buttonVariants } from "./Button.variants";
export const ButtonView = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, children, variant, size, isLoading, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={isLoading}
				{...props}
			>
				{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				{children}
			</button>
		);
	},
);

ButtonView.displayName = "ButtonView";
