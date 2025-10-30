import { z } from "zod";

export const tellerAssignSchema = z.object({
	tellerId: z.string().min(1, "Teller is required"),
	staffId: z.string().min(1, "Please choose a staff member"),
	description: z.string().optional(),
	startDate: z.string().min(1, "Start date required"),
	endDate: z.string().min(1, "End date required"),
	isFullDay: z.boolean().default(false),
	// Optional time fields; required by refinement when isFullDay === false
	startTime: z.string().optional(),
	endTime: z.string().optional(),
});

// When not a full day assignment, startTime and endTime must be present and valid
export const tellerAssignSchemaWithTimes = tellerAssignSchema.refine(
	(data) => {
		if (!data.isFullDay) {
			const { startTime, endTime } = data;
			if (!startTime || !endTime) return false;
			// simple lexical HH:mm check and ordering
			const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/;
			if (!hhmm.test(startTime) || !hhmm.test(endTime)) return false;
			return endTime > startTime;
		}
		return true;
	},
	{
		message:
			"Provide valid startTime and endTime when assignment is not full day",
		path: ["startTime"],
	},
);

export type FormValues = z.infer<typeof tellerAssignSchema>;

export type StaffOption = { id: number; displayName?: string };
