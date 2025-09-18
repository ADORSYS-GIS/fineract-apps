// packages/ui/src/components/Form/formReducer.ts
import { FormAction, FormState, Values } from "../types/Form.types";

const setFieldValue = <T extends Values>(
	state: FormState<T>,
	payload: { name: keyof T; value: T[keyof T] },
): FormState<T> => ({
	...state,
	values: {
		...state.values,
		[payload.name]: payload.value,
	},
});

const setFieldError = <T extends Values>(
	state: FormState<T>,
	payload: { name: keyof T & string; error?: string },
): FormState<T> => {
	const { name, error } = payload;
	const newErrors = { ...state.errors };
	if (error) {
		newErrors[name] = error;
	} else {
		delete newErrors[name];
	}
	return { ...state, errors: newErrors };
};

const setFieldTouched = <T extends Values>(
	state: FormState<T>,
	payload: { name: keyof T & string; touched: boolean },
): FormState<T> => ({
	...state,
	touched: {
		...state.touched,
		[payload.name]: payload.touched,
	},
});

export const createFormReducer =
	<T extends Values>() =>
	(state: FormState<T>, action: FormAction<T>): FormState<T> => {
		switch (action.type) {
			case "SET_VALUES":
				return { ...state, values: action.payload };
			case "SET_FIELD_VALUE":
				return setFieldValue(state, action.payload);
			case "SET_ERRORS":
				return { ...state, errors: action.payload };
			case "SET_FIELD_ERROR":
				return setFieldError(state, action.payload);
			case "SET_TOUCHED":
				return { ...state, touched: action.payload };
			case "SET_FIELD_TOUCHED":
				return setFieldTouched(state, action.payload);
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
