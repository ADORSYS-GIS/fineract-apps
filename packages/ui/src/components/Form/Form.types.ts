import React from "react";
import { z } from "zod";

/**
 * Generic map for form values.
 */
export type Values = Record<string, unknown>;

/**
 * Form validation schema using Zod
 */
export type ValidationSchema<T extends Values = Values> = z.ZodSchema<T>;

/**
 * Form configuration interface
 */
export interface UseFormProps<T extends Values = Values> {
	initialValues?: T;
	onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Form component props interface
 */
export interface FormProps<T extends Values = Values>
	extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
	initialValues?: T;
	onSubmit?: (values: T) => void | Promise<void>;
	children: React.ReactNode;
}

/* Input-related types */

/**
 * Supported input types
 */
export type InputType =
	| "text"
	| "password"
	| "email"
	| "number"
	| "textarea"
	| "select"
	| "checkbox"
	| "radio"
	| "date"
	| "file";

/**
 * Input option interface for select and radio inputs
 */
export interface InputOption {
	label: string;
	value: string | number | boolean;
}

/**
 * Input component props interface
 */
export interface InputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"size" | "onChange"
	> {
	name: string;
	label?: string;
	type?: InputType;
	options?: InputOption[]; // for select or radio
	helperText?: string;
	error?: string;
	size?: "sm" | "md" | "lg";
	variant?: "outlined" | "filled" | "standard";
	theme?: "light" | "dark";
}
