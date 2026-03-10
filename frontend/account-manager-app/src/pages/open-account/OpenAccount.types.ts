import * as z from "zod";

export const openAccountSchema = z.object({
	accountType: z.string(),
	productName: z.string(),
});

export type OpenAccountForm = z.infer<typeof openAccountSchema>;
