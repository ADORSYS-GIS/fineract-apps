import { z } from "zod";

export const tellerAssignSchema = z.object({
	tellerId: z.string().min(1, "Teller is required"),
	staffId: z.string().min(1, "Please choose a staff member"),
	description: z.string().optional(),
	startDate: z.string().min(1, "Start date required"),
	endDate: z.string().min(1, "End date required"),
	isFullDay: z.boolean().default(true),
});

export type FormValues = z.infer<typeof tellerAssignSchema>;

export type StaffOption = { id: number; displayName?: string };
