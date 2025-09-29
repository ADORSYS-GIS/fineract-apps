import { z } from "zod";

export const staffAssignSchema = z.object({
	tellerId: z.string().min(1, "Please choose a teller"),
	staffId: z.string().min(1, "Staff is required"),
	description: z.string().optional(),
	startDate: z.string().min(1, "Start date required"),
	endDate: z.string().min(1, "End date required"),
	isFullDay: z.boolean().default(true),
});

export type FormValues = z.infer<typeof staffAssignSchema>;

export type TellerOption = { id: number; name?: string };
