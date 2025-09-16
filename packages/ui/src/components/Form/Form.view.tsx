// packages/ui/src/components/Form/Form.view.tsx
import React, { createContext, useContext } from "react";
import { FormContextType, FormProps, InputProps, Values } from "./Form.types";
import { useForm } from "./useForm";

/**
 * Form context. We'll store it as FormContextType<Values> for runtime,
 * and cast generically when consuming.
 */
const FormContext = createContext<FormContextType<Values> | null>(null);

/**
 * Simple classNames helper.
 */
function cx(...parts: Array<string | false | null | undefined>) {
	return parts.filter(Boolean).join(" ");
}

/**
 * Top-level Form component.
 *
 * Usage:
 * <Form initialValues={{...}} validationSchema={{...}} onSubmit={...}>
 *   ... Inputs ...
 * </Form>
 */
export function Form<T extends Values = Values>({
	initialValues,
	validationSchema,
	onSubmit,
	children,
	className,
	...rest
}: FormProps<T>) {
	const form = useForm<T>({ initialValues, validationSchema, onSubmit });

	return (
		<FormContext.Provider value={form as unknown as FormContextType<Values>}>
			<form
				onSubmit={form.handleSubmit}
				noValidate
				className={cx(
					"w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md",
					className,
				)}
				{...rest}
			>
				{children}
			</form>
		</FormContext.Provider>
	);
}

/**
 * Hook to consume typed form context inside inputs/components.
 */
export function useFormContext<T extends Values = Values>() {
	const ctx = useContext(FormContext);
	if (!ctx) {
		throw new Error("useFormContext must be used within a Form provider");
	}
	return ctx as unknown as FormContextType<T>;
}

/**
 * Beautiful green-themed Input component supporting:
 * - text, email, number, textarea, select, checkbox, radio
 * - helper text
 * - controlled error display (uses touched to avoid early errors)
 *
 * Styling uses Tailwind-like utility classes. Adjust if not using Tailwind.
 */
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
	disabled,
	...rest
}) => {
	const form = useFormContext();
	const value = form.values[name as keyof typeof form.values];
	const touched = form.touched[name as keyof typeof form.touched];
	const errorFromForm = form.errors[name as keyof typeof form.errors];
	const error = errorProp ?? errorFromForm;
	const id = `form-input-${name}`;

	const inputBase =
		"block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2";
	const sizeClass =
		size === "sm"
			? "text-sm py-1"
			: size === "lg"
				? "text-lg py-3"
				: "text-base py-2";

	const variantClass =
		variant === "filled"
			? "bg-green-50 border-green-200 focus:ring-green-300"
			: variant === "standard"
				? "border-transparent focus:ring-0"
				: "bg-white border-green-200 focus:ring-green-300";

	const errorClass =
		error && touched ? "border-red-400 focus:ring-red-200" : "";

	// handlers
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		if (type === "checkbox") {
			const target = e.target as HTMLInputElement;
			form.setValue(name as keyof typeof form.values, target.checked);
		} else if (type === "number") {
			const target = e.target as HTMLInputElement;
			const parsed = target.value === "" ? "" : Number(target.value);
			form.setValue(
				name as keyof typeof form.values,
				parsed as unknown as typeof value,
			);
		} else {
			form.setValue(
				name as keyof typeof form.values,
				e.target.value as unknown as typeof value,
			);
		}

		if (errorFromForm) {
			form.validateField(name as keyof typeof form.values);
		}
	};

	const handleBlur = () => {
		form.validateField(name as keyof typeof form.values);
	};

	const commonProps = {
		id,
		name,
		onBlur: handleBlur,
		disabled,
		"aria-invalid": !!(error && touched),
		"aria-describedby":
			error && touched ? `${id}-error` : helperText ? `${id}-hint` : undefined,
		...rest,
	} as const;

	// input element
	let control: React.ReactNode = null;

	if (type === "textarea") {
		control = (
			<textarea
				{...(commonProps as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
				value={typeof value === "string" ? value : ""}
				onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
				className={cx(inputBase, sizeClass, variantClass, errorClass)}
			/>
		);
	} else if (type === "select" && options) {
		control = (
			<select
				{...(commonProps as unknown as React.SelectHTMLAttributes<HTMLSelectElement>)}
				value={
					typeof value === "string" || typeof value === "number"
						? String(value)
						: ""
				}
				onChange={handleChange as React.ChangeEventHandler<HTMLSelectElement>}
				className={cx(inputBase, sizeClass, variantClass, errorClass)}
			>
				<option value="">{`Choose a ${label ?? "value"}`}</option>
				{options.map((opt) => (
					<option key={String(opt.value)} value={String(opt.value)}>
						{opt.label}
					</option>
				))}
			</select>
		);
	} else if (type === "checkbox" || type === "radio") {
		control = (
			<div className="flex items-center">
				<input
					{...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
					type={type}
					checked={Boolean(value)}
					onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
					className={cx(
						"h-4 w-4 rounded",
						error && touched ? "border-red-400" : "border-green-500",
					)}
				/>
				{label && (
					<label htmlFor={id} className="ml-2 text-sm font-medium">
						{label}
					</label>
				)}
			</div>
		);
	} else {
		control = (
			<input
				{...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
				type={type}
				value={
					typeof value === "string" || typeof value === "number"
						? (value as string | number)
						: ""
				}
				onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
				className={cx(inputBase, sizeClass, variantClass, errorClass)}
			/>
		);
	}

	return (
		<div className="mb-4">
			{type !== "checkbox" && label && (
				<label
					htmlFor={id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{label}
				</label>
			)}
			{control}
			{helperText && !error && touched && (
				<p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
					{helperText}
				</p>
			)}
			{error && touched && (
				<p
					id={`${id}-error`}
					role="alert"
					className="mt-1 text-sm text-red-600"
				>
					{error}
				</p>
			)}
		</div>
	);
};

/**
 * Optional warning/notice block styled similar to your screenshot.
 */
export const FormWarning: React.FC<{
	title?: string;
	children?: React.ReactNode;
	className?: string;
}> = ({ title = "Requires Branch Manager Approval", children, className }) => {
	return (
		<div
			className={cx(
				"rounded-md bg-yellow-50 p-4 border border-yellow-100",
				className,
			)}
		>
			<div className="flex">
				<div className="flex-shrink-0">
					<svg
						className="h-5 w-5 text-yellow-600"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden
					>
						<path
							fillRule="evenodd"
							d="M8.258 3.099c.365-.773 1.46-.773 1.825 0l6.518 13.8A1 1 0 0 1 15.825 18H4.175a1 1 0 0 1-.775-1.101l4.858-13.8zM11 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-7a1 1 0 0 0-.993.883L9 8v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-semibold text-yellow-800">{title}</h3>
					{children && (
						<div className="mt-1 text-sm text-yellow-700">{children}</div>
					)}
				</div>
			</div>
		</div>
	);
};

/**
 * Simple submit button that picks disabled state from form.
 */
export const SubmitButton: React.FC<{ label?: string; className?: string }> = ({
	label = "Submit",
	className,
}) => {
	const form = useFormContext();
	return (
		<button
			type="submit"
			disabled={form.isSubmitting}
			className={cx(
				"inline-flex items-center px-4 py-2 rounded-md text-white font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1",
				form.isSubmitting
					? "bg-green-300 cursor-not-allowed"
					: "bg-green-600 hover:bg-green-700",
				className,
			)}
		>
			{form.isSubmitting ? "Submitting…" : label}
		</button>
	);
};
