import {
	GetLoansLoanIdTransactionsTemplateResponse,
	PostLoansLoanIdRequest,
} from "@fineract-apps/fineract-api";
import { Button, Form, Input } from "@fineract-apps/ui";
import { format } from "date-fns";
import { FC } from "react";
import { Modal } from "@/components/Modal/Modal";

interface DisburseToSavingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: PostLoansLoanIdRequest) => void;
	template?: GetLoansLoanIdTransactionsTemplateResponse;
	isSubmitting: boolean;
}

export const DisburseToSavingsModal: FC<DisburseToSavingsModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	template,
	isSubmitting,
}) => {
	if (!isOpen) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Disburse to Savings">
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
				<div className="space-y-4">
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
					<Input name="note" label="Note" type="textarea" />
					<Button
						type="submit"
						className="w-full bg-green-500 hover:bg-green-600 text-white mt-6"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Submit"}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
