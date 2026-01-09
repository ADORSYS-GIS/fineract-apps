import {
	Button,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const cashierActionSchema = z.object({
	amount: z.number().gt(0, "cashierActionForm.amountGreaterThanZero"),
	currencyCode: z.string().min(1, "cashierActionForm.currencyRequired"),
	date: z.string().min(1, "cashierActionForm.dateRequired"),
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
	const { t } = useTranslation();
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
						label={t("cashierActionForm.amount")}
						type="number"
						placeholder={t("cashierActionForm.enterAmount")}
					/>
					<Input
						name="currencyCode"
						label={t("cashierActionForm.currency")}
						type="text"
						disabled={true}
					/>
					<Input
						name="notes"
						label={t("cashierActionForm.notes")}
						placeholder={t("cashierActionForm.notesOptional")}
					/>
					<Input
						name="date"
						label={t("cashierActionForm.transactionDate")}
						type="date"
					/>
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
							{t("common.cancel")}
						</Button>
					</div>
				</div>
			</Form>
		</div>
	);
};
