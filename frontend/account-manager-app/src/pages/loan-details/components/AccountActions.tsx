import {
	GetLoansLoanIdResponse,
	PostLoansLoanIdRequest,
} from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { FC, useState } from "react";
import { useDisburseLoan } from "../hooks/useDisburseLoan";
import { DisburseLoanModal } from "./DisburseLoanModal";

interface AccountActionsProps {
	loan: GetLoansLoanIdResponse;
}

export const AccountActions: FC<AccountActionsProps> = ({ loan }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { template, isTemplateLoading, disburseLoan, isDisbursing } =
		useDisburseLoan(loan.id ?? 0, loan.externalId);
	const canDisburse = loan.status?.code === "loanStatusType.approved";

	if (!loan.id) return null;

	const handleSubmit = (data: PostLoansLoanIdRequest) => {
		disburseLoan(data, {
			onSuccess: () => setIsModalOpen(false),
		});
	};

	return (
		<div className="flex items-center gap-4">
			{canDisburse && (
				<Button
					onClick={() => setIsModalOpen(true)}
					disabled={isTemplateLoading}
				>
					{isTemplateLoading ? "Loading..." : "Disburse Loan"}
				</Button>
			)}
			<DisburseLoanModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleSubmit}
				template={template}
				isSubmitting={isDisbursing}
			/>
		</div>
	);
};
