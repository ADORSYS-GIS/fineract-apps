import * as React from "react";
import { ButtonProps } from "./Button.types";
import { ButtonView } from "./Button.view";
import { useButton } from "./useButton";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(props, ref) => {
		const hookProps = useButton();
		return <ButtonView {...props} {...hookProps} ref={ref} />;
	},
);

Button.displayName = "Button";
