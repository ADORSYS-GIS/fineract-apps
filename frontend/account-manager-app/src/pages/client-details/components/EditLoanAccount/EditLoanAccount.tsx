import { FormikProvider } from "formik";

import { useEditLoanAccount } from "./useEditLoanAccount";
import { EditLoanAccountView } from "./EditLoanAccount.view";


export const EditLoanAccount = ({ loanId, onClose }: { loanId: number; onClose: () => void }) => {
	const props = useEditLoanAccount(loanId, onClose);
	return (
		<FormikProvider value={props.formik}>
			<EditLoanAccountView {...props} />
		</FormikProvider>
	);
};
