// packages/ui/src/components/Form/useForm.ts
import { useCallback, useMemo, useState } from "react";
import { UseFormProps, UseFormReturn, Values } from "./Form.types";

/**
 * A small, generic useForm hook.
 *
 * Strongly typed: no `any`. All errors / touched are keyed by field names (strings).
 */
export const useForm = <T extends Values = Values>({
	initialValues = {} as T,
	validationSchema = {},
	onSubmit,
}: UseFormProps<T> = {}): UseFormReturn<T> => {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<
		Partial<Record<keyof T & string, string>>
	>({});
	const [touched, setTouched] = useState<
		Partial<Record<keyof T & string, boolean>>
	>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateField = useCallback(
		(name: keyof T & string, value?: T[keyof T]) => {
			const validator = validationSchema[name];
			if (!validator) {
				// no validator -> clear error (if any)
				setErrors((prev) => {
					if (prev && Object.hasOwn(prev, name)) {
						const copy = { ...prev };
						delete copy[name];
						return copy;
					}
					return prev;
				});
				return undefined;
			}

			const val = value ?? values[name as keyof T];
			const error = validator(val, values);
			setErrors((prev) => {
				const copy = { ...(prev || {}) };
				if (error) {
					copy[name] = error;
				} else {
					delete copy[name];
				}
				return copy;
			});
			return error;
		},
		[validationSchema, values],
	);

	const setValue = useCallback(
		<K extends keyof T>(name: K, value: T[K]) => {
			setValues((prev) => ({ ...prev, [name]: value }));
			setTouched((prev) => ({ ...prev, [name]: true }));
			if (validationSchema[name as string]) {
				// validate with the new value
				validateField(name as string, value);
			} else {
				// if there's no validator, ensure any previous error is removed
				setErrors((prev) => {
					if (prev && Object.hasOwn(prev, name as string)) {
						const copy = { ...prev };
						delete copy[name as string];
						return copy;
					}
					return prev;
				});
			}
		},
		[validateField, validationSchema],
	);

	const setError = useCallback((name: keyof T & string, error?: string) => {
		setErrors((prev) => {
			const copy = { ...(prev || {}) };
			if (error) copy[name] = error;
			else delete copy[name];
			return copy;
		});
	}, []);

	const validateForm = useCallback(() => {
		const newErrors: Partial<Record<keyof T & string, string>> = {};
		(Object.keys(validationSchema) as Array<keyof T & string>).forEach(
			(name) => {
				const validator = validationSchema[name];
				if (!validator) return;
				const value = values[name as keyof T];
				const err = validator(value, values);
				if (err) {
					newErrors[name] = err;
				}
			},
		);

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [validationSchema, values]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			// mark all fields as touched
			const allTouched: Partial<Record<keyof T & string, boolean>> = {};
			Object.keys(values).forEach((k) => {
				allTouched[k as keyof T & string] = true;
			});
			setTouched(allTouched);

			if (!validateForm()) return;

			setIsSubmitting(true);
			try {
				if (onSubmit) await onSubmit(values);
			} finally {
				setIsSubmitting(false);
			}
		},
		[onSubmit, validateForm, values],
	);

	const reset = useCallback(() => {
		setValues(initialValues);
		setErrors({});
		setTouched({});
		setIsSubmitting(false);
	}, [initialValues]);

	const isValid = useMemo(
		() => Object.keys(errors || {}).length === 0,
		[errors],
	);

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
