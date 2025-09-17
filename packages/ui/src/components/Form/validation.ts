// packages/ui/src/components/Form/validation.ts
import { ValidationSchema, Values } from "./Form.types";

export const validateField = <T extends Values>(
	name: keyof T & string,
	values: T,
	validationSchema: ValidationSchema<T>,
): string | undefined => {
	const validator = validationSchema[name];
	const value = values[name];
	return validator ? validator(value, values) : undefined;
};

export const validateForm = <T extends Values>(
	values: T,
	validationSchema: ValidationSchema<T>,
): {
	errors: Partial<Record<keyof T & string, string>>;
	isValid: boolean;
} => {
	const newErrors: Partial<Record<keyof T & string, string>> = {};
	let isValid = true;

	for (const name in validationSchema) {
		if (Object.hasOwn(validationSchema, name)) {
			const fieldName = name as keyof T & string;
			const err = validateField(fieldName, values, validationSchema);
			if (err) {
				newErrors[fieldName] = err;
				isValid = false;
			}
		}
	}

	return { errors: newErrors, isValid };
};
