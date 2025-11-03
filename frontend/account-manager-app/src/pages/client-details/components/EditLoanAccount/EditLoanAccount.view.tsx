import { FormikProvider } from "formik";
import { Modal } from "@/components/Modal/Modal";
import { LoanAccountForm } from "@/pages/loan/common/LoanAccountForm";
import { useEditLoanAccount } from "./useEditLoanAccount";

export const EditLoanAccountView = (
	props: ReturnType<typeof useEditLoanAccount>,
) => {
	const {
		formik,
		loanTemplate,
		isLoading,
		loanDetails,
		isLoadingLoanDetails,
		repaymentSchedule,
		isCalculatingSchedule,
		handleCalculateSchedule,
		handleSubmit,
		isSubmitting,
		onClose,
	} = props;

	return (
		<Modal isOpen={true} onClose={onClose} title="Edit Loan Account" size="lg">
			<FormikProvider value={formik}>
				<LoanAccountForm
					loanTemplate={loanTemplate}
					isLoading={isLoading}
					loanDetails={loanDetails}
					isLoadingLoanDetails={isLoadingLoanDetails}
					repaymentSchedule={repaymentSchedule}
					isCalculatingSchedule={isCalculatingSchedule}
					handleCalculateSchedule={handleCalculateSchedule}
					handleSubmit={handleSubmit}
					isSubmitting={isSubmitting}
				/>
			</FormikProvider>
		</Modal>
	);
};
