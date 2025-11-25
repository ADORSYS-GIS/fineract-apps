import { z } from "zod";

export const createUserFormSchema = z.object({
	officeId: z.coerce.number().min(1, "Office is required"),
	firstname: z.string().min(1, "First name is required"),
	lastname: z.string().min(1, "Last name is required"),
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
	roles: z.coerce.number().min(1, "A role is required"),
	isLoanOfficer: z.boolean().optional(),
	mobileNo: z.string().optional(),
	joiningDate: z.string().min(1, "Joining date is required"),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
