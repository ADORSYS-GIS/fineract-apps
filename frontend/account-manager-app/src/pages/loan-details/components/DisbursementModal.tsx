import {
	GetLoansLoanIdTransactionsTemplateResponse,
	PostLoansLoanIdRequest,
} from "@fineract-apps/fineract-api";
import { Button, Form, Input, useBusinessDate } from "@fineract-apps/ui";
import { format } from "date-fns";
import { FC } from "react";
import { Modal } from "@/components/Modal/Modal";

interface DisbursementModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: PostLoansLoanIdRequest) => void;
	template?: GetLoansLoanIdTransactionsTemplateResponse;
	isSubmitting: boolean;
	variant: "disburse" | "disburseToSavings";
}

export const DisbursementModal: FC<DisbursementModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	template,
	isSubmitting,
	variant,
}) => {
	const { businessDate } = useBusinessDate();

	if (!isOpen) return null;

	const title =
		variant === "disburse" ? "Disburse Loan" : "Disburse to Savings";

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
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
					actualDisbursementDate: businessDate,
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
					{variant === "disburse" && (
						<>
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
						</>
					)}
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
