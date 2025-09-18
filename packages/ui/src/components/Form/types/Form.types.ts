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
	validationSchema?: ValidationSchema<T>;
	onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Form state and methods interface
 */
export interface UseFormReturn<T extends Values = Values> {
	values: T;
	errors: Partial<Record<keyof T & string, string>>;
	touched: Partial<Record<keyof T & string, boolean>>;
	isSubmitting: boolean;
	isValid: boolean;
	setValue: <K extends keyof T>(name: K, value: T[K]) => void;
	setError: (name: keyof T & string, error?: string) => void;
	validateField: (name: keyof T & string) => string | undefined;
	validateForm: () => boolean;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	reset: () => void;
}

/**
 * Form context type
 */
export type FormContextType<T extends Values = Values> = UseFormReturn<T>;

/**
 * Form component props interface
 */
export interface FormProps<T extends Values = Values>
	extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
	initialValues?: T;
	validationSchema?: ValidationSchema<T>;
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
	| "date";

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

/**
 * Form state interface
 */
export interface FormState<T extends Values> {
	values: T;
	errors: Partial<Record<keyof T & string, string>>;
	touched: Partial<Record<keyof T & string, boolean>>;
}

/**
 * Form action types
 */
export type FormAction<T extends Values> =
	| { type: "SET_VALUES"; payload: T }
	| { type: "SET_FIELD_VALUE"; payload: { name: keyof T; value: T[keyof T] } }
	| { type: "SET_ERRORS"; payload: Partial<Record<keyof T & string, string>> }
	| {
			type: "SET_FIELD_ERROR";
			payload: { name: keyof T & string; error?: string };
	  }
	| { type: "SET_TOUCHED"; payload: Partial<Record<keyof T & string, boolean>> }
	| {
			type: "SET_FIELD_TOUCHED";
			payload: { name: keyof T & string; touched: boolean };
	  }
	| { type: "RESET"; payload: T };
