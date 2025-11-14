import { EditLoanAccountView } from "./EditLoanAccount.view";

export const EditLoanAccount = ({
	loanId,
	onClose,
}: {
	loanId: number;
	onClose: () => void;
}) => {
	return <EditLoanAccountView loanId={loanId} onClose={onClose} />;
};
