import { z } from "zod";

export const staffFormSchema = z.object({
	firstname: z
		.string()
		.min(1, "First name is required")
		.max(100, "First name must not exceed 100 characters"),
	lastname: z
		.string()
		.min(1, "Last name is required")
		.max(100, "Last name must not exceed 100 characters"),
	mobileNo: z.string().optional(),
	officeId: z.preprocess(
		(val) => (typeof val === "string" ? Number.parseInt(val, 10) : val),
		z.number().min(1, "Office is required"),
	),
	joiningDate: z.string().min(1, "Joining date is required"),
	isLoanOfficer: z.boolean().default(false),
	isActive: z.boolean().default(true),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
