// packages/ui/src/components/Form/useForm.ts
import { useCallback, useMemo, useReducer, useState } from "react";
import { UseFormProps, UseFormReturn, Values } from "./Form.types";

type FormState<T extends Values> = {
	values: T;
	errors: Partial<Record<keyof T & string, string>>;
	touched: Partial<Record<keyof T & string, boolean>>;
};

type FormAction<T extends Values> =
	| { type: "SET_VALUES"; payload: T }
	| { type: "SET_FIELD_VALUE"; payload: { name: keyof T; value: T[keyof T] } }
	| { type: "SET_ERRORS"; payload: Partial<Record<keyof T & string, string>> }
	| {
			type: "SET_FIELD_ERROR";
			payload: { name: keyof T & string; error?: string };
	  }
	| { type: "SET_TOUCHED"; payload: Partial<Record<keyof T & string, boolean>> }
	| {
			type: "SET_FIELD_TOUCHED";
			payload: { name: keyof T & string; touched: boolean };
	  }
	| { type: "RESET"; payload: T };

const createFormReducer =
	<T extends Values>() =>
	(state: FormState<T>, action: FormAction<T>): FormState<T> => {
		switch (action.type) {
			case "SET_VALUES":
				return { ...state, values: action.payload };
			case "SET_FIELD_VALUE":
				return {
					...state,
					values: {
						...state.values,
						[action.payload.name]: action.payload.value,
					},
				};
			case "SET_ERRORS":
				return { ...state, errors: action.payload };
			case "SET_FIELD_ERROR": {
				const { name, error } = action.payload;
				const newErrors = { ...state.errors };
				if (error) {
					newErrors[name] = error;
				} else {
					delete newErrors[name];
				}
				return { ...state, errors: newErrors };
			}
			case "SET_TOUCHED":
				return { ...state, touched: action.payload };
			case "SET_FIELD_TOUCHED":
				return {
					...state,
					touched: {
						...state.touched,
						[action.payload.name]: action.payload.touched,
					},
				};
			case "RESET":
				return {
					values: action.payload,
					errors: {},
					touched: {},
				};
			default:
				return state;
		}
	};

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

	const validateField = useCallback(
		(name: keyof T & string, value?: T[keyof T]) => {
			const validator = validationSchema[name];
			const val = value ?? values[name];
			const error = validator ? validator(val, values) : undefined;
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
			validateField(name as string, value);
		},
		[validateField],
	);

	const setError = useCallback((name: keyof T & string, error?: string) => {
		dispatch({ type: "SET_FIELD_ERROR", payload: { name, error } });
	}, []);

	const validateForm = useCallback(() => {
		const newErrors: Partial<Record<keyof T & string, string>> = {};
		let isValid = true;
		for (const name in validationSchema) {
			if (Object.hasOwn(validationSchema, name)) {
				const fieldName = name as keyof T & string;
				const err = validateField(fieldName, values[fieldName]);
				if (err) {
					newErrors[fieldName] = err;
					isValid = false;
				}
			}
		}
		dispatch({ type: "SET_ERRORS", payload: newErrors });
		return isValid;
	}, [validationSchema, values, validateField]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const allTouched = Object.keys(values).reduce(
				(acc, key) => ({ ...acc, [key]: true }),
				{},
			);
			dispatch({ type: "SET_TOUCHED", payload: allTouched });

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
		validateField,
		validateForm,
		handleSubmit,
		reset,
	};
};
