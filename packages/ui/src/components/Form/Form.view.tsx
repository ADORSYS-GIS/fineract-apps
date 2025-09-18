import React, { createContext, useContext } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button";
import { ButtonProps } from "../Button/Button.types";
import WarningIcon from "../icons/warning.svg";
import { useForm } from "./hooks/useForm";
import { FormContextType, FormProps, Values } from "./types/Form.types";

/**
 * Form context. We'll store it as FormContextType<Values> for runtime,
 * and cast generically when consuming.
 */
const FormContext = createContext<FormContextType<Values> | null>(null);

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
				className={cn(
					"w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6",
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
			className={cn(
				"rounded-md bg-yellow-50 p-4 border border-yellow-100 mb-6",
				className,
			)}
		>
			<div className="flex">
				<div className="flex-shrink-0">
					<img
						src={WarningIcon}
						alt=""
						className="h-5 w-5 text-yellow-600"
						aria-hidden="true"
					/>
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
