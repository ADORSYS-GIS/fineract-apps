import { Button, Card } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { FormikProvider } from "formik";
import { useTranslation } from "react-i18next";
import { LoanAccountForm } from "../common/LoanAccountForm";
import { useCreateLoanAccount } from "./useCreateLoanAccount";

export const CreateLoanAccountView = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
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
			<Button
				variant="outline"
				className="mb-4"
				onClick={() => navigate({ to: ".." })}
			>
				{t("back", "Back")}
			</Button>
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
