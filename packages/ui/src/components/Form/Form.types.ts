// packages/ui/src/components/Form/Form.types.ts
import React from "react";

/**
 * Generic map for form values.
 */
export type Values = Record<string, unknown>;

/**
 * Validator receives the field value and the entire values map.
 * Returns a string error or undefined when valid.
 */
export type ValidationFn<T extends Values = Values> = (
	value: T[keyof T] | undefined,
	values?: T,
) => string | undefined;

export type ValidationSchema<T extends Values = Values> = Partial<
	Record<keyof T & string, ValidationFn<T>>
>;

export interface UseFormProps<T extends Values = Values> {
	initialValues?: T;
	validationSchema?: ValidationSchema<T>;
	onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T extends Values = Values> {
	values: T;
	errors: Partial<Record<keyof T & string, string>>;
	touched: Partial<Record<keyof T & string, boolean>>;
	isSubmitting: boolean;
	isValid: boolean;
	setValue: <K extends keyof T>(name: K, value: T[K]) => void;
	setError: (name: keyof T & string, error?: string) => void;
	validateField: (
		name: keyof T & string,
		value?: T[keyof T],
	) => string | undefined;
	validateForm: () => boolean;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	reset: () => void;
}

export type FormContextType<T extends Values = Values> = UseFormReturn<T>;

export interface FormProps<T extends Values = Values>
	extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
	initialValues?: T;
	validationSchema?: ValidationSchema<T>;
	onSubmit?: (values: T) => void | Promise<void>;
	children: React.ReactNode;
}

/* Input-related types */

export type InputType =
	| "text"
	| "password"
	| "email"
	| "number"
	| "textarea"
	| "select"
	| "checkbox"
	| "radio";

export interface InputOption {
	label: string;
	value: string | number | boolean;
}

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
