import { Button, Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { FormikProvider } from "formik";
import { ArrowLeft } from "lucide-react";
import { LoanAccountForm } from "../common/LoanAccountForm";
import { Route, useCreateLoanAccount } from "./useCreateLoanAccount";

export const CreateLoanAccountView = () => {
	const { clientId } = Route.useParams();
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
			<header className="p-4 flex items-center border-b bg-white">
				<Link to="/client-details/$clientId" params={{ clientId }}>
					<Button variant="ghost">
						<ArrowLeft className="h-6 w-6" />
					</Button>
				</Link>
				<h1 className="text-lg font-semibold ml-4">Create Loan Account</h1>
			</header>
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
