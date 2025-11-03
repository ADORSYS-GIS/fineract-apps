import { FormikProvider } from "formik";
import { EditLoanAccountView } from "./EditLoanAccount.view";
import { useEditLoanAccount } from "./useEditLoanAccount";

export const EditLoanAccount = ({
	loanId,
	onClose,
}: {
	loanId: number;
	onClose: () => void;
}) => {
	const props = useEditLoanAccount(loanId, onClose);
	return (
		<FormikProvider value={props.formik}>
			<EditLoanAccountView {...props} />
		</FormikProvider>
	);
};
