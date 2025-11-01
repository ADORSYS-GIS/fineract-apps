import { FormikProvider } from "formik";
import { CreateLoanAccountView } from "@/pages/loan/create-loan-account/CreateLoanAccount.view";
import { useCreateLoanAccount } from "@/pages/loan/create-loan-account/useCreateLoanAccount";

export const CreateLoanAccount = () => {
	const props = useCreateLoanAccount();
	return (
		<FormikProvider value={props.formik}>
			<CreateLoanAccountView {...props} />
		</FormikProvider>
	);
};
