import React, { useId } from "react";
import { useFormContext } from "../Form.view";
import { InputProps } from "../types/Form.types";
import { getInputClasses } from "../utils/util";
import {
	CheckboxInput,
	RadioGroupInput,
	SelectInput,
	TextAreaInput,
	TextInput,
} from "./Input.components";

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

	// Generate unique ID using React's useId hook
	const reactId = useId();
	const id = `form-input-${name}-${reactId}`;

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
			case "radio":
				// For radio buttons, return the value of the selected option
				return target.value;
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

	const getAriaDescribedBy = () => {
		if (error && touched) {
			return `${id}-error`;
		}
		if (helperText) {
			return `${id}-hint`;
		}
		return undefined;
	};

	const commonProps = {
		...rest,
		id,
		name,
		onBlur: handleBlur,
		disabled,
		"aria-invalid": !!(error && touched),
		"aria-describedby": getAriaDescribedBy(),
	};

	const renderDefaultInput = () => (
		<TextInput
			commonProps={commonProps}
			type={type}
			value={value}
			handleChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
			inputClasses={inputClasses}
		/>
	);

	const renderTextarea = () => (
		<TextAreaInput
			commonProps={commonProps}
			value={value}
			handleChange={
				handleChange as React.ChangeEventHandler<HTMLTextAreaElement>
			}
			inputClasses={inputClasses}
		/>
	);

	const renderSelect = () => (
		<SelectInput
			commonProps={commonProps}
			value={value}
			handleChange={handleChange as React.ChangeEventHandler<HTMLSelectElement>}
			inputClasses={inputClasses}
			options={options ?? []}
			label={label}
		/>
	);

	const renderCheckbox = () => (
		<CheckboxInput
			commonProps={commonProps}
			value={value}
			handleChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
			label={label}
			error={error}
			touched={touched}
		/>
	);

	const renderRadioGroup = () => (
		<RadioGroupInput
			commonProps={commonProps}
			value={value}
			handleChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
			options={options ?? []}
			label={label}
			error={error}
			touched={touched}
		/>
	);

	const renderControl = () => {
		switch (type) {
			case "textarea":
				return renderTextarea();
			case "select":
				return renderSelect();
			case "checkbox":
				return renderCheckbox();
			case "radio":
				return renderRadioGroup();
			default:
				return renderDefaultInput();
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
			{type !== "checkbox" && type !== "radio" && label && (
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
