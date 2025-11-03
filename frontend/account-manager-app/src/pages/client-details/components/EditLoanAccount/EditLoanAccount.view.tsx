import { Button, } from "@fineract-apps/ui";
import { Modal } from "@/components/Modal/Modal";
import { useFormikContext } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Stepper } from "@/components/Stepper";
import { LoanDetailsFormValues } from "@/pages/loan/create-loan-account/CreateLoanAccount.schema";
import { ChargesStepView } from "@/pages/loan/create-loan-account/components/ChargesStep.view";
import { DetailsStepView } from "@/pages/loan/create-loan-account/components/DetailsStep.view";
import { PreviewStepView } from "@/pages/loan/create-loan-account/components/PreviewStep.view";
import { RepaymentScheduleStepView } from "@/pages/loan/create-loan-account/components/RepaymentScheduleStep.view";
import { TermsStepView } from "@/pages/loan/create-loan-account/components/TermsStep.view";
import { useEditLoanAccount } from "./useEditLoanAccount";

const steps = [
	{ key: "details", label: "Details" },
	{ key: "terms", label: "Terms" },
	{ key: "charges", label: "Charges" },
	{ key: "repaymentSchedule", label: "Repayment Schedule" },
	{ key: "preview", label: "Preview" },
];

interface CurrentStepComponentProps {
	currentStep: number;
	loanTemplate: ReturnType<typeof useEditLoanAccount>["loanTemplate"];
	loanDetails: ReturnType<typeof useEditLoanAccount>["loanDetails"];
	isLoading: boolean;
	isLoadingLoanDetails: boolean;
	repaymentSchedule: ReturnType<
		typeof useEditLoanAccount
	>["repaymentSchedule"];
	isCalculatingSchedule: boolean;
	handleCalculateSchedule: ReturnType<
		typeof useEditLoanAccount
	>["handleCalculateSchedule"];
	values: LoanDetailsFormValues;
}

const CurrentStepComponent = ({
	currentStep,
	loanTemplate,
	loanDetails,
	isLoading,
	isLoadingLoanDetails,
	repaymentSchedule,
	isCalculatingSchedule,
	handleCalculateSchedule,
	values,
}: CurrentStepComponentProps) => {
	const { t } = useTranslation();

	switch (currentStep) {
		case 0:
			return (
				<DetailsStepView
					loanTemplate={loanTemplate}
					loanDetails={loanDetails}
					isLoading={isLoading}
					isLoadingLoanDetails={isLoadingLoanDetails}
				/>
			);
		case 1:
			return isLoadingLoanDetails ? (
				<div>{t("loading", "Loading...")}</div>
			) : (
				loanDetails && <TermsStepView loanDetails={loanDetails} />
			);
		case 2:
			return isLoadingLoanDetails ? (
				<div>{t("loading", "Loading...")}</div>
			) : (
				loanDetails && <ChargesStepView isLoading={isLoadingLoanDetails} />
			);
		case 3:
			return (
				<RepaymentScheduleStepView
					repaymentSchedule={repaymentSchedule}
					isCalculatingSchedule={isCalculatingSchedule}
					handleCalculateSchedule={handleCalculateSchedule}
				/>
			);
		case 4:
			return (
				<PreviewStepView
					values={values}
					loanTemplate={loanTemplate}
					loanDetails={loanDetails}
				/>
			);
		default:
			return null;
	}
};

export const EditLoanAccountView = (
	props: ReturnType<typeof useEditLoanAccount>,
) => {
	const {
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
	const { t } = useTranslation();
	const { values } = useFormikContext<LoanDetailsFormValues>();
	const [currentStep, setCurrentStep] = useState(0);

	const handleNext = () => {
		setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
	};

	const handleBack = () => {
		setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
	};

	return (
		<Modal isOpen={true} onClose={onClose} title="Edit Loan Account" size="lg">
			<div className="p-4 md:p-6">
				<Stepper
						steps={steps.map((step) => ({ label: t(step.key, step.label) }))}
						activeStep={currentStep}
					/>
				</div>
				<div className="p-4 md:p-6 border-t border-gray-200">
					<CurrentStepComponent
						currentStep={currentStep}
						loanTemplate={loanTemplate}
						loanDetails={loanDetails}
						isLoading={isLoading}
						isLoadingLoanDetails={isLoadingLoanDetails}
						repaymentSchedule={repaymentSchedule}
						isCalculatingSchedule={isCalculatingSchedule}
						handleCalculateSchedule={handleCalculateSchedule}
						values={values}
					/>
				</div>
				<div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center p-4 md:p-6 border-t border-gray-200 gap-2">
					<div className="w-full sm:w-auto">
						{currentStep > 0 && (
							<Button variant="outline" className="w-full" onClick={handleBack}>
								{t("back", "Back")}
							</Button>
						)}
					</div>
					<div className="w-full sm:w-auto">
						{currentStep < steps.length - 1 && (
							<Button className="w-full" onClick={handleNext}>
								{t("next", "Next")}
							</Button>
						)}
						{currentStep === steps.length - 1 && (
							<Button
								className="w-full"
								onClick={() => handleSubmit()}
								disabled={isSubmitting}
							>
								{isSubmitting
									? t("submitting", "Submitting...")
									: t("submit", "Submit")}
							</Button>
						)}
					</div>
				</div>
		
		</Modal>
	);
};
