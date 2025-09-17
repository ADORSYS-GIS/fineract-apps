// packages/ui/src/components/Form/Form.view.tsx
import React, { createContext, useContext } from "react";
import {
	FormContextType,
	FormProps,
	InputOption,
	InputProps,
	Values,
} from "./Form.types";
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
}: Readonly<FormProps<T>>) {
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
 * Generates Tailwind CSS classes for form inputs based on their state.
 * @param size - The size of the input (sm, md, lg).
 * @param variant - The visual variant of the input (outlined, filled, standard).
 * @param error - The error message string, if any.
 * @param touched - Whether the input has been touched by the user.
 * @returns A string of CSS classes.
 */
function getInputClasses(
	size: "sm" | "md" | "lg",
	variant: "outlined" | "filled" | "standard",
	error?: string,
	touched?: boolean,
): string {
	const baseClasses =
		"block w-full rounded-md border px-3 focus:outline-none focus:ring-2";

	const sizeClasses = {
		sm: "text-sm py-1",
		md: "text-base py-2",
		lg: "text-lg py-3",
	};

	const variantClasses = {
		outlined: "bg-white border-green-200 focus:ring-green-300",
		filled: "bg-green-50 border-green-200 focus:ring-green-300",
		standard: "border-transparent focus:ring-0",
	};

	const errorClasses =
		error && touched ? "border-red-400 focus:ring-red-200" : "";

	return cx(
		baseClasses,
		sizeClasses[size],
		variantClasses[variant],
		errorClasses,
	);
}

type CommonInputProps = {
	id: string;
	name: string;
	onBlur: React.FocusEventHandler;
	disabled: boolean | undefined;
	"aria-invalid":
		| boolean
		| "false"
		| "true"
		| "grammar"
		| "spelling"
		| undefined;
	"aria-describedby": string | undefined;
};

const TextInput: React.FC<{
	commonProps: CommonInputProps & Record<string, unknown>;
	type: string;
	value: unknown;
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
	inputClasses: string;
}> = ({ commonProps, type, value, handleChange, inputClasses }) => (
	<input
		{...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
		type={type}
		value={typeof value === "string" || typeof value === "number" ? value : ""}
		onChange={handleChange}
		className={inputClasses}
	/>
);

const TextAreaInput: React.FC<{
	commonProps: CommonInputProps & Record<string, unknown>;
	value: unknown;
	handleChange: React.ChangeEventHandler<HTMLTextAreaElement>;
	inputClasses: string;
}> = ({ commonProps, value, handleChange, inputClasses }) => (
	<textarea
		{...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
		value={typeof value === "string" ? value : ""}
		onChange={handleChange}
		className={inputClasses}
	/>
);

const SelectInput: React.FC<{
	commonProps: CommonInputProps & Record<string, unknown>;
	value: unknown;
	handleChange: React.ChangeEventHandler<HTMLSelectElement>;
	inputClasses: string;
	options: InputOption[];
	label?: string;
}> = ({ commonProps, value, handleChange, inputClasses, options, label }) => (
	<select
		{...(commonProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
		value={
			typeof value === "string" || typeof value === "number"
				? String(value)
				: ""
		}
		onChange={handleChange}
		className={inputClasses}
	>
		<option value="">{`Choose a ${label ?? "value"}`}</option>
		{options.map((opt) => (
			<option key={String(opt.value)} value={String(opt.value)}>
				{opt.label}
			</option>
		))}
	</select>
);

const CheckboxRadioInput: React.FC<{
	commonProps: CommonInputProps & Record<string, unknown>;
	type: "checkbox" | "radio";
	value: unknown;
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
	label?: string;
	error?: string;
	touched?: boolean;
}> = ({ commonProps, type, value, handleChange, label, error, touched }) => (
	<div className="flex items-center">
		<input
			{...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
			type={type}
			checked={Boolean(value)}
			onChange={handleChange}
			className={cx(
				"h-4 w-4 rounded",
				error && touched ? "border-red-400" : "border-green-500",
			)}
		/>
		{label && (
			<label htmlFor={commonProps.id} className="ml-2 text-sm font-medium">
				{label}
			</label>
		)}
	</div>
);

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
	const value = form.values[name];
	const touched = form.touched[name];
	const errorFromForm = form.errors[name];
	const error = errorProp ?? errorFromForm;
	const id = `form-input-${name}`;

	const inputClasses = getInputClasses(size, variant, error, touched);

	const getChangeValue = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const target = e.target as HTMLInputElement;
		switch (type) {
			case "checkbox":
				return target.checked;
			case "number":
				return target.value === "" ? "" : Number(target.value);
			default:
				return target.value;
		}
	};

	// handlers
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		form.setValue(name, getChangeValue(e));
		if (errorFromForm) {
			form.validateField(name);
		}
	};

	const handleBlur: React.FocusEventHandler = () => {
		form.validateField(name);
	};

	const commonProps = {
		...rest,
		id,
		name,
		onBlur: handleBlur,
		disabled,
		"aria-invalid": !!(error && touched),
		"aria-describedby": (() => {
			if (error && touched) {
				return `${id}-error`;
			} else if (helperText) {
				return `${id}-hint`;
			} else {
				return undefined;
			}
		})(),
	};

	const controlMap: Record<string, React.ReactNode> = {
		textarea: (
			<TextAreaInput
				commonProps={commonProps}
				value={value}
				handleChange={
					handleChange as React.ChangeEventHandler<HTMLTextAreaElement>
				}
				inputClasses={inputClasses}
			/>
		),
		select: (
			<SelectInput
				commonProps={commonProps}
				value={value}
				handleChange={
					handleChange as React.ChangeEventHandler<HTMLSelectElement>
				}
				inputClasses={inputClasses}
				options={options ?? []}
				label={label}
			/>
		),
		checkbox: (
			<CheckboxRadioInput
				commonProps={commonProps}
				type="checkbox"
				value={value}
				handleChange={
					handleChange as React.ChangeEventHandler<HTMLInputElement>
				}
				label={label}
				error={error}
				touched={touched}
			/>
		),
		radio: (
			<CheckboxRadioInput
				commonProps={commonProps}
				type="radio"
				value={value}
				handleChange={
					handleChange as React.ChangeEventHandler<HTMLInputElement>
				}
				label={label}
				error={error}
				touched={touched}
			/>
		),
	};

	const renderControl = () => {
		return (
			controlMap[type] ?? (
				<TextInput
					commonProps={commonProps}
					type={type}
					value={value}
					handleChange={
						handleChange as React.ChangeEventHandler<HTMLInputElement>
					}
					inputClasses={inputClasses}
				/>
			)
		);
	};

	const renderMessage = () => {
		if (error && touched) {
			return (
				<p
					id={`${id}-error`}
					role="alert"
					className="mt-1 text-sm text-red-600"
				>
					{error}
				</p>
			);
		}
		if (helperText) {
			return (
				<p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
					{helperText}
				</p>
			);
		}
		return null;
	};

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
			{renderControl()}
			{renderMessage()}
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
