import React from "react";

export type Values = Record<string, unknown>;

export type ValidationFn<T = Values> = (
	value: T[keyof T],
	values?: T,
) => string | undefined;

export interface ValidationSchema<T = Values> {
	[field: string]: ValidationFn<T>;
}

export interface UseFormProps<T = Values> {
	initialValues?: T;
	validationSchema?: ValidationSchema<T>;
	onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T = Values> {
	values: T;
	errors: Record<keyof T & string, string>;
	touched: Record<keyof T & string, boolean>;
	isSubmitting: boolean;
	isValid: boolean;
	setValue: <K extends keyof T>(name: K, value: T[K]) => void;
	setError: (name: keyof T & string, error: string) => void;
	validateField: (name: keyof T & string, value?: T[keyof T]) => void;
	validateForm: () => boolean;
	handleSubmit: (e: React.FormEvent) => void;
	reset: () => void;
}

export type FormContextType<T = Values> = UseFormReturn<T>;

export interface FormProps<T = Values>
	extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
	initialValues?: T;
	validationSchema?: ValidationSchema<T>;
	onSubmit?: (values: T) => void | Promise<void>;
	children: React.ReactNode;
}

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
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	name: string;
	label?: string;
	type?: InputType;
	options?: InputOption[]; // for select, radio
	helperText?: string;
	error?: string;
	size?: "sm" | "md" | "lg";
	variant?: "outlined" | "filled" | "standard";
	theme?: "light" | "dark";
}
