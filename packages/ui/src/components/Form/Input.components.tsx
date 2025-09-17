// packages/ui/src/components/Form/Input.components.tsx
import React from "react";
import { InputOption } from "./Form.types";

export type CommonInputProps = {
	id: string;
	name: string;
	onBlur: React.FocusEventHandler;
	disabled: boolean | undefined;
	"aria-invalid": boolean;
	"aria-describedby": string | undefined;
};

export const TextInput: React.FC<{
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

export const TextAreaInput: React.FC<{
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

export const SelectInput: React.FC<{
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

export const CheckboxRadioInput: React.FC<{
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
			className={`h-4 w-4 rounded ${
				error && touched ? "border-red-400" : "border-green-500"
			}`}
		/>
		{label && (
			<label htmlFor={commonProps.id} className="ml-2 text-sm font-medium">
				{label}
			</label>
		)}
	</div>
);
