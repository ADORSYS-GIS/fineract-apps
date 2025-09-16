import React, { createContext, useContext } from "react";
import {
	FormContextType,
	FormProps,
	InputOption,
	InputProps,
	Values,
} from "./Form.types";
import { useForm } from "./useForm";

// Context is always FormContextType<Values> for runtime, but generics are handled in hooks
const FormContext = createContext<FormContextType<Values> | undefined>(
	undefined,
);

export function Form<T extends Values = Values>({
	initialValues,
	validationSchema,
	onSubmit,
	children,
	...rest
}: FormProps<T>) {
	const form = useForm<T>({ initialValues, validationSchema, onSubmit });
	return (
		<FormContext.Provider value={form as unknown as FormContextType<Values>}>
			<form onSubmit={form.handleSubmit} {...rest} noValidate>
				{children}
			</form>
		</FormContext.Provider>
	);
}

export function useFormContext<T extends Values = Values>() {
	const ctx = useContext(FormContext);
	if (!ctx) throw new Error("useFormContext must be used within a Form");
	return ctx as unknown as FormContextType<T>;
}

export const Input: React.FC<InputProps> = ({
	name,
	label,
	type = "text",
	options,
	helperText,
	error: errorProp,
	size = "md",
	variant = "outlined",
	theme = "light",
	...rest
}) => {
	const form = useFormContext();
	const value = form.values[name as keyof typeof form.values];
	const error = errorProp ?? form.errors[name as keyof typeof form.errors];
	const touched = form.touched[name as keyof typeof form.touched];
	const id = `input-${name}`;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let val: string | number | boolean = e.target.value;
		if (type === "checkbox") {
			val = e.target.checked;
		} else if (type === "number") {
			val = e.target.value === "" ? "" : Number(e.target.value);
		}
		form.setValue(name as keyof typeof form.values, val);
		if (form.errors[name as keyof typeof form.errors]) {
			form.validateField(name as keyof typeof form.errors);
		}
	};

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		form.setValue(name as keyof typeof form.values, e.target.value);
		if (form.errors[name as keyof typeof form.errors]) {
			form.validateField(name as keyof typeof form.errors);
		}
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		form.setValue(name as keyof typeof form.values, e.target.value);
		if (form.errors[name as keyof typeof form.errors]) {
			form.validateField(name as keyof typeof form.errors);
		}
	};

	const handleBlur = () => {
		form.validateField(name as keyof typeof form.values);
	};

	// Only pass props that are valid for each element type
	const { checked: _checked, ...elementProps } = {
		id,
		name,
		onBlur: handleBlur,
		"aria-invalid": !!error,
		"aria-describedby": error
			? `${id}-error`
			: helperText
				? `${id}-help`
				: undefined,
		...rest,
	};

	let inputEl: React.ReactNode = null;
	if (type === "textarea") {
		inputEl = (
			<textarea
				{...(elementProps as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
				value={typeof value === "string" ? value : ""}
				onChange={handleTextareaChange}
			/>
		);
	} else if (type === "select" && options) {
		inputEl = (
			<select
				{...(elementProps as unknown as React.SelectHTMLAttributes<HTMLSelectElement>)}
				value={
					typeof value === "string" || typeof value === "number" ? value : ""
				}
				onChange={handleSelectChange}
			>
				<option value="">Select...</option>
				{options.map((opt: InputOption) => (
					<option
						key={String(opt.value)}
						value={
							typeof opt.value === "string" || typeof opt.value === "number"
								? opt.value
								: ""
						}
					>
						{opt.label}
					</option>
				))}
			</select>
		);
	} else if (type === "checkbox" || type === "radio") {
		inputEl = (
			<input
				type={type}
				{...(elementProps as React.InputHTMLAttributes<HTMLInputElement>)}
				checked={Boolean(value)}
				onChange={handleInputChange}
			/>
		);
	} else {
		inputEl = (
			<input
				type={type}
				{...(elementProps as React.InputHTMLAttributes<HTMLInputElement>)}
				value={
					typeof value === "string" || typeof value === "number" ? value : ""
				}
				onChange={handleInputChange}
			/>
		);
	}

	return (
		<div
			className={`form-control ${variant} ${size} ${theme} ${error && touched ? "has-error" : ""}`}
		>
			{label && <label htmlFor={id}>{label}</label>}
			{inputEl}
			{helperText && !error && (
				<div id={`${id}-help`} className="form-helper">
					{helperText}
				</div>
			)}
			{error && touched && (
				<div id={`${id}-error`} className="form-error" role="alert">
					{error}
				</div>
			)}
		</div>
	);
};
