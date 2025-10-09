import { z } from "zod";

export const tellerCreateSchema = z.object({
	officeId: z.coerce.number().gt(0, "Office is required"),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().optional(),
	// status must be numeric: 300 (Active), 400 (Inactive)
	status: z.coerce
		.number()
		.int()
		.refine((v) => v === 300 || v === 400, {
			message: "Status must be 300 (Active) or 400 (Inactive)",
		}),
});

export type TellerCreateFormValues = z.infer<typeof tellerCreateSchema>;
