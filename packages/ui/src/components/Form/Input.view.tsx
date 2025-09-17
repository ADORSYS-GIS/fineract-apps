// packages/ui/src/components/Form/Input.view.tsx
import React from "react";
import { InputProps } from "./Form.types";
import { useFormContext } from "./Form.view";
import {
	CheckboxRadioInput,
	SelectInput,
	TextAreaInput,
	TextInput,
} from "./Input.components";
import { getInputClasses } from "./util";

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

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		form.setValue(name, getChangeValue(e));
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
		"aria-describedby":
			error && touched ? `${id}-error` : helperText ? `${id}-hint` : undefined,
	};

	const renderControl = () => {
		switch (type) {
			case "textarea":
				return (
					<TextAreaInput
						commonProps={commonProps}
						value={value}
						handleChange={
							handleChange as React.ChangeEventHandler<HTMLTextAreaElement>
						}
						inputClasses={inputClasses}
					/>
				);
			case "select":
				return (
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
				);
			case "checkbox":
			case "radio":
				return (
					<CheckboxRadioInput
						commonProps={commonProps}
						type={type}
						value={value}
						handleChange={
							handleChange as React.ChangeEventHandler<HTMLInputElement>
						}
						label={label}
						error={error}
						touched={touched}
					/>
				);
			default:
				return (
					<TextInput
						commonProps={commonProps}
						type={type}
						value={value}
						handleChange={
							handleChange as React.ChangeEventHandler<HTMLInputElement>
						}
						inputClasses={inputClasses}
					/>
				);
		}
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
