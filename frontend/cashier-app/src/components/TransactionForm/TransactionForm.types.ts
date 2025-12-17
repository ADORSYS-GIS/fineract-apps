import { z } from "zod";

export const transactionSchema = z.object({
	amount: z
		.string()
		.min(1, "Amount is required")
		.refine((val) => !Number.isNaN(Number.parseFloat(val)), {
			message: "Amount must be a number",
		})
		.refine((val) => Number.parseFloat(val) > 0, {
			message: "Amount must be positive",
		}),
	receiptNumber: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export type TransactionType = "deposit" | "withdrawal";

export interface TransactionFormViewProps {
	transactionType: TransactionType;
	accountNumber: string;
	onSubmit: (values: TransactionFormData) => void;
	onCancel: () => void;
	errorMessage: string | null;
	isSubmitting: boolean;
	isSuccess: boolean;
}
