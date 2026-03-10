import {
	Formik,
	Form as FormikForm,
	FormikHelpers,
	useFormikContext,
} from "formik";
import React from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { cn } from "../../lib/utils";
import { Button } from "../Button";
import { ButtonProps } from "../Button/Button.types";
import WarningIcon from "../icons/warning.svg";
import { FormProps, Values } from "./Form.types";

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
	enableReinitialize = true,
	...rest
}: Readonly<FormProps<T> & { enableReinitialize?: boolean }>) {
	const handleSubmit = async (values: T, _formikHelpers: FormikHelpers<T>) => {
		if (onSubmit) {
			await onSubmit(values);
		}
	};

	return (
		<Formik<T>
			initialValues={initialValues ?? ({} as T)}
			validationSchema={
				validationSchema
					? toFormikValidationSchema(validationSchema)
					: undefined
			}
			onSubmit={handleSubmit}
			enableReinitialize={enableReinitialize}
		>
			<FormikForm
				noValidate
				className={cn(
					"w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6",
					className,
				)}
				{...rest}
			>
				{children}
			</FormikForm>
		</Formik>
	);
}

/**
 * Form Title component
 */
export const FormTitle: React.FC<{
	children?: React.ReactNode;
	className?: string;
}> = ({ children, className }) => {
	return (
		<h2
			className={cn("text-2xl font-bold text-center text-green-600", className)}
		>
			{children}
		</h2>
	);
};

/**
 * Hook to consume typed form context inside inputs/components.
 */
export { useFormikContext as useFormContext } from "formik";

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
	const { isSubmitting } = useFormikContext();
	return (
		<Button
			type="submit"
			isLoading={isSubmitting}
			variant={variant}
			{...buttonProps}
		>
			{label}
		</Button>
	);
};
