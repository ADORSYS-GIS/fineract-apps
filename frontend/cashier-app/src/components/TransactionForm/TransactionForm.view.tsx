import {
	Button,
	Card,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useTranslation } from "react-i18next";
import type { TransactionFormViewProps } from "./TransactionForm.types";
import { useTransactionForm } from "./useTransactionForm";

export const TransactionFormView = ({
	transactionType,
	accountNumber,
	onSubmit,
	onCancel,
	errorMessage,
	isSubmitting,
	isSuccess,
}: TransactionFormViewProps) => {
	const { t } = useTranslation();
	const { initialValues, validationSchema } = useTransactionForm();
	const getSubmitButtonLabel = () => {
		if (isSubmitting) {
			return t("submitting");
		}
		if (transactionType === "deposit") {
			return t("deposit");
		}
		return t("withdrawal");
	};
	return (
		<div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center">
			<Card
				variant="elevated"
				className="p-4 w-full max-w-md"
				title={
					<div className="flex justify-between items-center">
						<FormTitle>
							{transactionType === "deposit" ? t("deposit") : t("withdrawal")}
						</FormTitle>
						<p className="text-sm">
							{t("account")}: {accountNumber}
						</p>
					</div>
				}
			>
				{isSuccess ? (
					<div className="text-center py-8">
						<p className="text-2xl text-green-600">
							{t("transactionSuccessful")}
						</p>
					</div>
				) : (
					<Form
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
						className="flex flex-col gap-4"
					>
						{errorMessage && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
								{errorMessage}
							</div>
						)}
						<fieldset disabled={isSubmitting}>
							<Input
								name="amount"
								label={t("amount")}
								type="text"
								inputMode="decimal"
								placeholder={t("enterAmount")}
							/>
							<Input
								name="receiptNumber"
								label={t("notes")}
								type="text"
								placeholder={t("enterNotes")}
							/>
							<div className="flex justify-end gap-2 mt-4">
								<Button variant="outline" onClick={onCancel}>
									{t("cancel")}
								</Button>
								<SubmitButton label={getSubmitButtonLabel()} />
							</div>
						</fieldset>
					</Form>
				)}
			</Card>
		</div>
	);
};
