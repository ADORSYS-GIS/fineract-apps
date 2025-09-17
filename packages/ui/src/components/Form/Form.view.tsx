// packages/ui/src/components/Form/Form.view.tsx
import React, { createContext, useContext } from "react";
import { Button } from "../Button";
import { ButtonProps } from "../Button/Button.types";
import { FormContextType, FormProps, Values } from "./Form.types";
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

export const SubmitButton: React.FC<
	{ label?: string } & Omit<ButtonProps, "type" | "isLoading" | "children">
> = ({ label = "Submit", variant, ...buttonProps }) => {
	const form = useFormContext();
	return (
		<Button
			type="submit"
			isLoading={form.isSubmitting}
			variant={variant}
			{...buttonProps}
		>
			{label}
		</Button>
	);
};
