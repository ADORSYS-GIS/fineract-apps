import { z } from "zod";

export const registrationValidationSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	dateOfBirth: z.string().min(1, "Date of birth is required"),
	nationalId: z.string().min(1, "National ID is required"),
	address: z.object({
		street: z.string().min(1, "Street is required"),
		city: z.string().min(1, "City is required"),
		postalCode: z.string().min(1, "Postal code is required"),
		country: z.string().min(1, "Country is required"),
	}),
});

export type RegistrationFormValues = z.infer<
	typeof registrationValidationSchema
>;
