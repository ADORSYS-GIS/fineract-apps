import { z } from "zod";

export const userFormSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(50, "Username must not exceed 50 characters")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Username can only contain letters, numbers, hyphens, and underscores",
		),
	firstname: z
		.string()
		.min(1, "First name is required")
		.max(100, "First name must not exceed 100 characters"),
	lastname: z
		.string()
		.min(1, "Last name is required")
		.max(100, "Last name must not exceed 100 characters"),
	email: z.string().email("Invalid email address"),
	mobileNo: z
		.string()
		.min(1, "Phone number is required")
		.regex(/^[+]?[\d\s()-]+$/, "Invalid phone number format"),
	officeId: z.number().min(1, "Office is required"),
	roles: z
		.array(z.number())
		.min(1, "At least one role is required")
		.nonempty("At least one role is required"),
	joiningDate: z.string().optional(),
	isLoanOfficer: z.boolean().default(false),
	sendPasswordToEmail: z.boolean().default(true),
});

export const userEditFormSchema = userFormSchema
	.omit({ username: true, sendPasswordToEmail: true })
	.extend({
		staffId: z.number().optional(),
	});

export type UserFormValues = z.infer<typeof userFormSchema>;
export type UserEditFormValues = z.infer<typeof userEditFormSchema>;
