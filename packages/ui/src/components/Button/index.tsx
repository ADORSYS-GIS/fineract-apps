import React from "react";
import { ButtonProps } from "./Button.types";
import { ButtonView } from "./Button.view";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ ...props }, ref) => {
		return <ButtonView {...props} ref={ref} />;
	},
);

Button.displayName = "Button";
