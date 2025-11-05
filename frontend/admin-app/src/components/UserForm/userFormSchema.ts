import { z } from "zod";

export const userFormSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(50, "Username must not exceed 50 characters")
			.regex(
				/^[a-zA-Z0-9_-]+$/,
				"Username can only contain letters, numbers, hyphens, and underscores",
			),
		firstname: z.string().min(1, "First name is required"),
		lastname: z.string().min(1, "Last name is required"),
		email: z
			.string()
			.min(1, "Email is required")
			.refine(
				(email) =>
					/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
				{
					message: "Invalid email address",
				},
			),
		officeId: z.number().min(1, "Office is required"),
		staffId: z.number().min(1, "Staff is required"),
		roles: z
			.array(z.number())
			.min(1, "At least one role is required")
			.nonempty("At least one role is required"),
		sendPasswordToEmail: z.boolean().default(true),
		password: z.string().optional(),
		repeatPassword: z.string().optional(),
	})
	.refine(
		(data) => {
			if (!data.sendPasswordToEmail) {
				if (!data.password || data.password.length < 6) {
					return false;
				}
				return data.password === data.repeatPassword;
			}
			return true;
		},
		{
			message: "Passwords must match and be at least 6 characters",
			path: ["repeatPassword"],
		},
	);

export const userEditFormSchema = userFormSchema.omit({
	username: true,
	sendPasswordToEmail: true,
	password: true,
	repeatPassword: true,
});

export type UserFormValues = z.infer<typeof userFormSchema>;
export type UserEditFormValues = z.infer<typeof userEditFormSchema>;
