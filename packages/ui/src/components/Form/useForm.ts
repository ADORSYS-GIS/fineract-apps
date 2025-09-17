// packages/ui/src/components/Form/useForm.ts
import { useCallback, useMemo, useReducer, useState } from "react";
import { UseFormProps, UseFormReturn, Values } from "./Form.types";
import { createFormReducer } from "./formReducer";
import { validateField, validateForm } from "./validation";

export const useForm = <T extends Values = Values>({
	initialValues = {} as T,
	validationSchema = {},
	onSubmit,
}: UseFormProps<T> = {}): UseFormReturn<T> => {
	const formReducer = useMemo(() => createFormReducer<T>(), []);
	const [state, dispatch] = useReducer(formReducer, {
		values: initialValues,
		errors: {},
		touched: {},
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { values, errors, touched } = state;

	const handleFieldValidation = useCallback(
		(name: keyof T & string) => {
			const error = validateField(name, values, validationSchema);
			dispatch({ type: "SET_FIELD_ERROR", payload: { name, error } });
			return error;
		},
		[validationSchema, values],
	);

	const setValue = useCallback(
		<K extends keyof T>(name: K, value: T[K]) => {
			dispatch({ type: "SET_FIELD_VALUE", payload: { name, value } });
			dispatch({
				type: "SET_FIELD_TOUCHED",
				payload: { name: name as string, touched: true },
			});
			handleFieldValidation(name as string);
		},
		[handleFieldValidation],
	);

	const setError = useCallback((name: keyof T & string, error?: string) => {
		dispatch({ type: "SET_FIELD_ERROR", payload: { name, error } });
	}, []);

	const handleFormValidation = useCallback(() => {
		const { errors: newErrors, isValid } = validateForm(
			values,
			validationSchema,
		);
		dispatch({ type: "SET_ERRORS", payload: newErrors });
		return isValid;
	}, [validationSchema, values]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const allTouched = Object.keys(values).reduce(
				(acc, key) => ({ ...acc, [key]: true }),
				{},
			);
			dispatch({ type: "SET_TOUCHED", payload: allTouched });

			if (!handleFormValidation()) return;

			setIsSubmitting(true);
			try {
				if (onSubmit) await onSubmit(values);
			} finally {
				setIsSubmitting(false);
			}
		},
		[onSubmit, handleFormValidation, values],
	);

	const reset = useCallback(() => {
		dispatch({ type: "RESET", payload: initialValues });
		setIsSubmitting(false);
	}, [initialValues]);

	const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

	return {
		values,
		errors,
		touched,
		isSubmitting,
		isValid,
		setValue,
		setError,
		validateField: handleFieldValidation,
		validateForm: handleFormValidation,
		handleSubmit,
		reset,
	};
};
