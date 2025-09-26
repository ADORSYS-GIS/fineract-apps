import {
	Button,
	Card,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
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
	const { initialValues, validationSchema } = useTransactionForm();
	const getSubmitButtonLabel = () => {
		if (isSubmitting) {
			return "Submitting...";
		}
		if (transactionType === "deposit") {
			return "Deposit";
		}
		return "Withdrawal";
	};
	return (
		<div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center">
			<Card
				variant="elevated"
				className="p-4 w-full max-w-md"
				title={
					<div className="flex justify-between items-center">
						<FormTitle>
							{transactionType === "deposit" ? "Deposit" : "Withdrawal"}
						</FormTitle>
						<p className="text-sm">Account: {accountNumber}</p>
					</div>
				}
			>
				{isSuccess ? (
					<div className="text-center py-8">
						<p className="text-2xl text-green-600">Transaction Successful!</p>
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
								label="Amount"
								type="text"
								inputMode="decimal"
								placeholder="Enter amount"
							/>
							<Input
								name="receiptNumber"
								label="Receipt Number"
								type="text"
								placeholder="Enter receipt number"
							/>
							<div className="flex justify-end gap-2 mt-4">
								<Button variant="outline" onClick={onCancel}>
									Cancel
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
