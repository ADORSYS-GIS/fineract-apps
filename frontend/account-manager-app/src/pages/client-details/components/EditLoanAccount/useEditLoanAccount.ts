import { LoansService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useLoanAccountForm } from "@/pages/loan/common/useLoanAccountForm";

export const useEditLoanAccount = (loanId: number, onClose: () => void) => {
	const { data: loanData } = useQuery({
		queryKey: ["loan", loanId],
		queryFn: () => LoansService.getV1LoansByLoanId({ loanId }),
	});

	const loanAccountForm = useLoanAccountForm({
		clientId: Number(loanData?.clientId),
		loanId,
		onClose,
	});

	return {
		...loanAccountForm,
		onClose,
	};
};
