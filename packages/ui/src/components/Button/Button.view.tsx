import React from "react";
import { ButtonProps } from "./Button.types";

export const ButtonView = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, children, ...props }, ref) => {
		return (
			<button
				className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${className}`}
				ref={ref}
				{...props}
			>
				{children}
			</button>
		);
	},
);

ButtonView.displayName = "ButtonView";
