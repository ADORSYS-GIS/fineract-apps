import {
	Button,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

export const cashierActionSchema = z.object({
	amount: z.number().gt(0, "Amount must be greater than 0"),
	currencyCode: z.string().min(1, "Currency is required"),
	date: z.string().min(1, "Date is required"),
	notes: z.string().optional(),
});

export type CashierActionFormValues = z.infer<typeof cashierActionSchema>;

export const CashierActionForm = ({
	initialValues,
	onSubmit,
	isSubmitting,
	submitLabel,
	onCancel,
	title,
}: {
	initialValues: CashierActionFormValues;
	onSubmit: (values: CashierActionFormValues) => Promise<void> | void;
	isSubmitting: boolean;
	submitLabel: string;
	onCancel?: () => void;
	title: string;
}) => {
	const navigate = useNavigate();
	return (
		<div className="px-6 py-6">
			<Form<CashierActionFormValues>
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				<FormTitle>{title}</FormTitle>
				<div className="grid grid-cols-1 gap-4">
					<Input
						name="amount"
						label="Amount"
						type="number"
						placeholder="Enter amount"
					/>
					<Input
						name="currencyCode"
						label="Currency"
						type="text"
						disabled={true}
					/>
					<Input name="notes" label="Notes" placeholder="Notes (optional)" />
					<Input name="date" label="Transaction date" type="date" />
					<div className="flex flex-col sm:flex-row justify-end gap-3">
						<SubmitButton
							label={isSubmitting ? `${submitLabel}...` : submitLabel}
						/>
						<Button
							variant="outline"
							onClick={() =>
								onCancel ? onCancel() : navigate({ to: "/tellers" })
							}
						>
							Cancel
						</Button>
					</div>
				</div>
			</Form>
		</div>
	);
};
