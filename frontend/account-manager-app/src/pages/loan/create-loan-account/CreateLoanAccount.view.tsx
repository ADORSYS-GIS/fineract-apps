import { Card } from "@fineract-apps/ui";
import { FormikProvider } from "formik";
import { LoanAccountForm } from "../common/LoanAccountForm";
import { useCreateLoanAccount } from "./useCreateLoanAccount";

export const CreateLoanAccountView = () => {
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
	} = useCreateLoanAccount();

	return (
		<div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
			<Card>
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
			</Card>
		</div>
	);
};
