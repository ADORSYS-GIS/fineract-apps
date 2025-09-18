import { ErrorMessage, Field, useField } from "formik";
import React, { useId } from "react";
import { InputProps } from "../Form.types";

const getInputClasses = (
	size: "sm" | "md" | "lg",
	variant: "outlined" | "filled" | "standard",
	error?: string,
	touched?: boolean,
) => {
	const baseClasses =
		"w-full px-3 py-2 transition-all duration-200 ease-in-out rounded-md focus:outline-none";

	const sizeClasses = {
		sm: "text-sm",
		md: "text-base",
		lg: "text-lg",
	};

	const variantClasses = {
		outlined: `border ${
			error && touched
				? "border-red-500 focus:ring-red-500"
				: "border-gray-300 focus:border-green-500 focus:ring-green-500"
		} focus:ring-1`,
		filled: `bg-gray-100 ${
			error && touched
				? "border-red-500 focus:ring-red-500"
				: "border-transparent focus:border-green-500 focus:ring-green-500"
		} focus:ring-1`,
		standard: `border-b ${
			error && touched
				? "border-red-500 focus:border-red-500"
				: "border-gray-300 focus:border-green-500"
		} rounded-none`,
	};

	return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
};

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
	disabled,
	...rest
}) => {
	const [_field, meta] = useField(name);
	const { touched, error: errorFromForm } = meta;
	const error = errorProp ?? errorFromForm;

	// Generate unique ID using React's useId hook
	const reactId = useId();
	const id = `form-input-${name}-${reactId}`;

	const inputClasses = getInputClasses(size, variant, error, touched);

	const renderControl = () => {
		const fieldProps = {
			name,
			id,
			className: inputClasses,
			disabled,
			...rest,
		};

		if (type === "select") {
			return (
				<Field as="select" {...fieldProps}>
					<option value="">{`Choose a ${label ?? "value"}`}</option>
					{options?.map((opt) => (
						<option key={String(opt.value)} value={String(opt.value)}>
							{opt.label}
						</option>
					))}
				</Field>
			);
		}

		if (type === "textarea") {
			return <Field as="textarea" {...fieldProps} />;
		}

		if (type === "checkbox") {
			const { ...restProps } = fieldProps;
			return (
				<div className="flex items-center">
					<Field
						type="checkbox"
						{...restProps}
						className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
					/>
					{label && (
						<label htmlFor={id} className="ml-2 block text-sm font-medium">
							{label}
						</label>
					)}
				</div>
			);
		}

		if (type === "radio") {
			return (
				<div className="space-y-2">
					{label && <legend className="text-sm font-medium">{label}</legend>}
					{options?.map((option) => (
						<div key={String(option.value)} className="flex items-center">
							<Field
								type="radio"
								name={name}
								value={String(option.value)}
								id={`${id}-${option.value}`}
								className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
							/>
							<label
								htmlFor={`${id}-${option.value}`}
								className="ml-2 block text-sm font-medium"
							>
								{option.label}
							</label>
						</div>
					))}
				</div>
			);
		}

		return <Field type={type} {...fieldProps} />;
	};

	return (
		<div className="mb-4">
			{type !== "checkbox" && type !== "radio" && label && (
				<label
					htmlFor={id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{label}
				</label>
			)}
			{renderControl()}
			<ErrorMessage name={name}>
				{(msg) => (
					<p
						id={`${id}-error`}
						role="alert"
						className="mt-1 text-sm text-red-600"
					>
						{msg}
					</p>
				)}
			</ErrorMessage>
			{helperText && !(touched && error) && (
				<p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
					{helperText}
				</p>
			)}
		</div>
	);
};
