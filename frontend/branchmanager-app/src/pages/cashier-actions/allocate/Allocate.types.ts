import { z } from "zod";

export const allocateSchema = z.object({
	amount: z.string().min(1, "Amount is required"),
	currencyCode: z.string().min(1, "Currency is required"),
	date: z.string().min(1, "Date is required"),
	notes: z.string().optional(),
});

export type FormValues = z.infer<typeof allocateSchema>;
