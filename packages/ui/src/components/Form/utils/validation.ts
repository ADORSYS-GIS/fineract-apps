import { z } from "zod";
import { Values } from "../types/Form.types";

/**
 * Validation result type
 */
export interface ValidationResult<T extends Values> {
	errors: Partial<Record<keyof T & string, string>>;
	isValid: boolean;
}

/**
 * Validates a single field using Zod schema
 */
export const validateField = <T extends Values>(
	name: keyof T & string,
	values: T,
	schema: z.ZodSchema<T>,
): string | undefined => {
	try {
		// For field-level validation, we'll validate the entire form and extract the specific field error
		// This is more reliable than trying to extract individual field schemas
		schema.parse(values);
		return undefined;
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			// Find the error for the specific field
			const fieldError = error.errors.find((err) => err.path[0] === name);
			return fieldError?.message ?? "Invalid value";
		}
		return "Validation error";
	}
};

/**
 * Validates the entire form using Zod schema
 */
export const validateForm = <T extends Values>(
	values: T,
	schema: z.ZodSchema<T>,
): ValidationResult<T> => {
	try {
		schema.parse(values);
		return { errors: {}, isValid: true };
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			const errors: Partial<Record<keyof T & string, string>> = {};

			error.errors.forEach((err: z.ZodIssue) => {
				const fieldName = err.path[0] as keyof T & string;
				if (fieldName) {
					errors[fieldName] = err.message;
				}
			});

			return { errors, isValid: false };
		}

		return { errors: {}, isValid: false };
	}
};

/**
 * Gets all field names from a Zod schema
 */
export const getSchemaFields = <T extends Values>(
	schema: z.ZodSchema<T>,
): (keyof T & string)[] => {
	if (schema instanceof z.ZodObject) {
		return Object.keys(
			(schema as unknown as z.ZodObject<z.ZodRawShape>).shape,
		) as (keyof T & string)[];
	}
	return [];
};
