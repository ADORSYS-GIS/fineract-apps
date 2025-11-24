import {
	Button,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const cashierActionSchema = z.object({
	amount: z.number().gt(0),
	currencyCode: z.string().min(1),
	date: z.string().min(1),
	notes: z.string().optional(),
});

export const getCashierActionSchema = (t: TFunction) =>
	z.object({
		amount: z.number().gt(0, t("amountMustBeGreaterThan0")),
		currencyCode: z.string().min(1, t("currencyIsRequired")),
		date: z.string().min(1, t("dateIsRequired")),
		notes: z.string().optional(),
	});

export type CashierActionFormValues = z.infer<
	ReturnType<typeof getCashierActionSchema>
>;

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
	const { t } = useTranslation();
	return (
		<div className="px-6 py-6">
			<Form<CashierActionFormValues>
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={getCashierActionSchema(t)}
			>
				<FormTitle>{title}</FormTitle>
				<div className="grid grid-cols-1 gap-4">
					<Input
						name="amount"
						label={t("amount")}
						type="number"
						placeholder={t("enterAmount")}
					/>
					<Input
						name="currencyCode"
						label={t("currency")}
						type="text"
						disabled={true}
					/>
					<Input
						name="notes"
						label={t("notes")}
						placeholder={t("enterNotes")}
					/>
					<Input name="date" label={t("date")} type="date" />
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
							{t("cancel")}
						</Button>
					</div>
				</div>
			</Form>
		</div>
	);
};
