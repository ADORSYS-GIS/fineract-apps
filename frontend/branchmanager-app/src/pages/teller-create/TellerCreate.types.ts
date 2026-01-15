import { z } from "zod";

// Simple type definition for translation function to avoid dependency issues
type TFunction = (key: string, options?: Record<string, unknown>) => string;

export const getTellerCreateSchema = (t: TFunction) =>
	z
		.object({
			officeId: z.coerce.number().gt(0, t("tellerCreate.officeRequired")),
			name: z.string().min(1, t("tellerCreate.nameRequired")),
			description: z.string().optional(),
			startDate: z.string().min(1, t("tellerCreate.startDateRequired")),
			endDate: z.string().optional(),
			// status must be numeric: 300 (Active), 400 (Inactive)
			status: z.coerce
				.number()
				.int()
				.refine((v) => v === 300 || v === 400, {
					message: t("tellerCreate.statusInvalid"),
				}),
		})
		.refine(
			(data) => {
				if (data.startDate && data.endDate) {
					return new Date(data.endDate) >= new Date(data.startDate);
				}
				return true;
			},
			{
				message: t("tellerCreate.endDateBeforeStartDate"),
				path: ["endDate"],
			},
		);

export type TellerCreateFormValues = z.infer<
	ReturnType<typeof getTellerCreateSchema>
>;
