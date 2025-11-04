import {
	GetLoansLoanIdResponse,
	PostLoansLoanIdRequest,
} from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { MoreVertical } from "lucide-react";
import { FC, useState } from "react";
import { useDisburseLoan } from "../hooks/useDisburseLoan";
import { useDisburseToSavings } from "../hooks/useDisburseToSavings";
import { DisburseLoanModal } from "./DisburseLoanModal";
import { DisburseToSavingsModal } from "./DisburseToSavingsModal";

interface AccountActionsProps {
	loan: GetLoansLoanIdResponse;
}

export const AccountActions: FC<AccountActionsProps> = ({ loan }) => {
	const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
	const [isDisburseToSavingsModalOpen, setIsDisburseToSavingsModalOpen] =
		useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const {
		template: disburseTemplate,
		isTemplateLoading: isDisburseTemplateLoading,
		disburseLoan,
		isDisbursing,
	} = useDisburseLoan(loan.id ?? 0, loan.externalId);
	const {
		template: disburseToSavingsTemplate,
		isTemplateLoading: isDisburseToSavingsTemplateLoading,
		disburseToSavings,
		isDisbursing: isDisbursingToSavings,
	} = useDisburseToSavings(loan.id ?? 0, loan.externalId);

	const canDisburse = loan.status?.code === "loanStatusType.approved";

	if (!loan.id) return null;

	const handleDisburseSubmit = (data: PostLoansLoanIdRequest) => {
		disburseLoan(data, {
			onSuccess: () => setIsDisburseModalOpen(false),
		});
	};

	const handleDisburseToSavingsSubmit = (data: PostLoansLoanIdRequest) => {
		disburseToSavings(data, {
			onSuccess: () => setIsDisburseToSavingsModalOpen(false),
		});
	};

	return (
		<div className="relative">
			{canDisburse && (
				<Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
					<MoreVertical className="h-6 w-6" />
				</Button>
			)}
			{isMenuOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
					<div className="py-1">
						<button
							onClick={() => {
								setIsDisburseModalOpen(true);
								setIsMenuOpen(false);
							}}
							className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							disabled={isDisburseTemplateLoading}
						>
							{isDisburseTemplateLoading ? "Loading..." : "Disburse"}
						</button>
						<button
							onClick={() => {
								setIsDisburseToSavingsModalOpen(true);
								setIsMenuOpen(false);
							}}
							className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							disabled={isDisburseToSavingsTemplateLoading}
						>
							{isDisburseToSavingsTemplateLoading
								? "Loading..."
								: "Disburse to Savings"}
						</button>
					</div>
				</div>
			)}
			<DisburseLoanModal
				isOpen={isDisburseModalOpen}
				onClose={() => setIsDisburseModalOpen(false)}
				onSubmit={handleDisburseSubmit}
				template={disburseTemplate}
				isSubmitting={isDisbursing}
			/>
			<DisburseToSavingsModal
				isOpen={isDisburseToSavingsModalOpen}
				onClose={() => setIsDisburseToSavingsModalOpen(false)}
				onSubmit={handleDisburseToSavingsSubmit}
				template={disburseToSavingsTemplate}
				isSubmitting={isDisbursingToSavings}
			/>
		</div>
	);
};
