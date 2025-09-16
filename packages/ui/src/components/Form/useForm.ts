import { useCallback, useState } from "react";
import { UseFormProps, UseFormReturn, Values } from "./Form.types";

export const useForm = <T extends Values = Values>({
	initialValues = {} as T,
	validationSchema = {},
	onSubmit,
}: UseFormProps<T> = {}): UseFormReturn<T> => {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Record<keyof T & string, string>>(
		{} as Record<keyof T & string, string>,
	);
	const [touched, setTouched] = useState<Record<keyof T & string, boolean>>(
		{} as Record<keyof T & string, boolean>,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateField = useCallback(
		(name: keyof T & string, value?: T[keyof T]) => {
			const validator = validationSchema[name];
			if (!validator) return;
			const val = value !== undefined ? value : values[name];
			const error = validator(val, values);
			setErrors((prev) => {
				if (error) {
					const newState = { ...prev };
					delete newState[name];
					return newState;
				}
				return { ...prev, [name]: error };
			});
		},
		[validationSchema, values],
	);

	const setValue = useCallback(
		<K extends keyof T>(name: K, value: T[K]) => {
			setValues((prev) => ({ ...prev, [name]: value }));
			setTouched((prev) => ({ ...prev, [name]: true }));
			if (validationSchema[name as string])
				validateField(name as string, value);
		},
		[validationSchema, validateField],
	);

	const setError = useCallback((name: keyof T & string, error: string) => {
		setErrors((prev) => ({ ...prev, [name]: error }));
	}, []);

	const validateForm = useCallback(() => {
		let valid = true;
		const newErrors: Partial<Record<keyof T & string, string>> = {};
		Object.keys(validationSchema).forEach((name) => {
			const error = validationSchema[name](values[name as keyof T], values);
			if (error) {
				newErrors[name as keyof T & string] = error;
				valid = false;
			}
		});
		setErrors(newErrors as Record<keyof T & string, string>);
		return valid;
	}, [validationSchema, values]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!validateForm()) return;
			setIsSubmitting(true);
			try {
				if (onSubmit) await onSubmit(values);
			} finally {
				setIsSubmitting(false);
			}
		},
		[validateForm, onSubmit, values],
	);

	const reset = useCallback(() => {
		setValues(initialValues);
		setErrors({} as Record<keyof T & string, string>);
		setTouched({} as Record<keyof T & string, boolean>);
		setIsSubmitting(false);
	}, [initialValues]);

	const isValid = Object.keys(errors).length === 0;

	return {
		values,
		errors,
		touched,
		isSubmitting,
		isValid,
		setValue,
		setError,
		validateField,
		validateForm,
		handleSubmit,
		reset,
	};
};
