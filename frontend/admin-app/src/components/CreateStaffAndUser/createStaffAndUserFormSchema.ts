import { z } from "zod";

export const createStaffAndUserFormSchema = z.object({
	// Staff fields
	firstname: z
		.string()
		.min(1, "First name is required")
		.max(100, "First name must not exceed 100 characters"),
	lastname: z
		.string()
		.min(1, "Last name is required")
		.max(100, "Last name must not exceed 100 characters"),
	mobileNo: z.string().optional(),
	officeId: z.coerce.number().min(1, "Office is required"),
	joiningDate: z.string().min(1, "Joining date is required"),
	isLoanOfficer: z.boolean().default(false),
	isActive: z.boolean().default(true),

	// User fields
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(50, "Username must not exceed 50 characters")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Username can only contain letters, numbers, hyphens, and underscores",
		),
	email: z
		.string()
		.min(1, "Email is required")
		.refine(
			(email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
			{
				message: "Invalid email address",
			},
		),
	roles: z.coerce.number().min(1, "At least one role is required"),
});

export type CreateStaffAndUserFormValues = z.infer<
	typeof createStaffAndUserFormSchema
>;
