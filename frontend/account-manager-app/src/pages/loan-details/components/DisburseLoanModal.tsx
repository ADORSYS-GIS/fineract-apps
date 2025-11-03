import {
	GetLoansLoanIdTransactionsTemplateResponse,
	PostLoansLoanIdRequest,
} from "@fineract-apps/fineract-api";
import { Button, Card, Form, Input } from "@fineract-apps/ui";
import { format } from "date-fns";
import { FC } from "react";

interface DisburseLoanModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: PostLoansLoanIdRequest) => void;
	template?: GetLoansLoanIdTransactionsTemplateResponse;
	isSubmitting: boolean;
}

export const DisburseLoanModal: FC<DisburseLoanModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	template,
	isSubmitting,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-gray-200 bg-opacity-75 backdrop-blur-sm flex items-center justify-center">
			<Card className="p-6 rounded-lg shadow-lg w-full max-w-md bg-white">
				<h2 className="text-2xl font-bold mb-6 text-gray-800">Disburse Loan</h2>
				<Form
					onSubmit={(data) => {
						const formattedDate = format(
							new Date(data.actualDisbursementDate),
							"dd MMMM yyyy",
						);
						onSubmit({
							...data,
							actualDisbursementDate: formattedDate,
							dateFormat: "dd MMMM yyyy",
							locale: "en",
						});
					}}
					initialValues={{
						actualDisbursementDate: new Date().toLocaleDateString("en-CA"),
						transactionAmount: template?.amount,
					}}
				>
					<div className="grid grid-cols-1 gap-4">
						<Input
							name="actualDisbursementDate"
							label="Disbursed On"
							type="date"
							required
						/>
						<Input
							name="transactionAmount"
							label="Transaction Amount"
							type="number"
							required
						/>
						<Input name="externalId" label="External Id" />
						<Input
							name="paymentTypeId"
							label="Payment Type"
							type="select"
							options={
								template?.paymentTypeOptions?.map((option) => ({
									label: option.name ?? "",
									value: option.id ?? "",
								})) ?? []
							}
							required
						/>
						<Input name="note" label="Note" type="textarea" />
					</div>
					<div className="flex justify-end gap-4 mt-6">
						<Button type="button" onClick={onClose} variant="outline">
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Submitting..." : "Submit"}
						</Button>
					</div>
				</Form>
			</Card>
		</div>
	);
};
