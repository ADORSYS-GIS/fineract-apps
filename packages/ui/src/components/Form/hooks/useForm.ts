import { useCallback, useMemo, useReducer, useState } from "react";
import { UseFormProps, UseFormReturn, Values } from "../types/Form.types";
import {
	getSchemaFields,
	validateField,
	validateForm,
} from "../utils/validation";
import { createFormReducer } from "./formReducer";

export const useForm = <T extends Values = Values>({
	initialValues = {} as T,
	validationSchema,
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
			if (!validationSchema) return undefined;

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
		if (!validationSchema) return true;

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

			// Fix: Mark all validated fields as touched before submit
			// This ensures error messages are shown for all fields with validation errors
			if (validationSchema) {
				const allFields = getSchemaFields(validationSchema);
				const allTouched = allFields.reduce(
					(acc, fieldName) => ({ ...acc, [fieldName]: true }),
					{},
				);
				dispatch({ type: "SET_TOUCHED", payload: allTouched });
			} else {
				// Fallback: mark all fields in values as touched
				const allTouched = Object.keys(values).reduce(
					(acc, key) => ({ ...acc, [key]: true }),
					{},
				);
				dispatch({ type: "SET_TOUCHED", payload: allTouched });
			}

			if (!handleFormValidation()) return;

			setIsSubmitting(true);
			try {
				if (onSubmit) await onSubmit(values);
			} finally {
				setIsSubmitting(false);
			}
		},
		[onSubmit, handleFormValidation, values, validationSchema],
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
