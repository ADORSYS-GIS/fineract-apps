import { FormikProvider } from "formik";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/Modal/Modal";
import { LoanAccountForm } from "@/pages/loan/common/LoanAccountForm";
import { useLoanAccountForm } from "@/pages/loan/common/useLoanAccountForm";

interface EditLoanAccountViewProps {
	loanId: number;
	onClose: () => void;
}

export const EditLoanAccountView = ({
	loanId,
	onClose,
}: EditLoanAccountViewProps) => {
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
	} = useLoanAccountForm({ loanId, onClose });
	const { t } = useTranslation();

	return (
		<Modal
			isOpen={true}
			onClose={onClose}
			title={t("editLoanAccount.title")}
			size="lg"
		>
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
