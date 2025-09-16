import { type VariantProps } from "class-variance-authority";
import React from "react";
import { buttonVariants } from "./Button.view";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
}
