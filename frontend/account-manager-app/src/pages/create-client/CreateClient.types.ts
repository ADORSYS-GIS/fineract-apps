import { z } from "zod";
export const createClientValidationSchema = z.object({
	firstname: z.string().min(1, "First name is required"),
	lastname: z.string().min(1, "Last name is required"),
	emailAddress: z
		.string()
		.email("Invalid email address")
		.optional()
		.or(z.literal("")),
	mobileNo: z.string().optional(),
	activationDate: z.string().optional(),
	active: z.boolean(),
});

export type CreateClientForm = z.infer<typeof createClientValidationSchema>;

export const initialValues: CreateClientForm = {
	firstname: "",
	lastname: "",
	emailAddress: "",
	mobileNo: "",
	activationDate: new Date().toISOString().split("T")[0], // Will be overridden with business date
	active: false,
};
