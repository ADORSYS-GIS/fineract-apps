import { Card } from "@fineract-apps/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { LoanDetailsFormValues } from "../CreateLoanAccount.schema";
import {
	GetLoansTemplateResponse,
	LoanDetailsTemplate,
} from "../CreateLoanAccount.types";

interface PreviewStepProps {
	values: LoanDetailsFormValues;
	loanTemplate?: GetLoansTemplateResponse;
	loanDetails?: LoanDetailsTemplate;
}

const DetailItem: FC<{ label: string; value: React.ReactNode }> = ({
	label,
	value,
}) => (
	<div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
		<span className="text-gray-600">{label}</span>
		<span className="font-medium text-left sm:text-right">{value}</span>
	</div>
);

export const PreviewStepView: FC<PreviewStepProps> = ({
	values,
	loanTemplate,
	loanDetails,
}) => {
	const { t } = useTranslation();
	const effectiveTemplate = loanDetails ?? loanTemplate;

	const getOptionLabel = <T extends { id?: number; name?: string }>(
		options: T[] | undefined,
		id: number | string | undefined,
	) => options?.find((option) => option.id === Number(id))?.name ?? id;

	const getOptionValue = <T extends { id?: number; value?: string }>(
		options: T[] | undefined,
		id: number | string | undefined,
	) => options?.find((option) => option.id === Number(id))?.value ?? id;

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-4xl">
				<div className="p-4">
					<h2 className="text-lg font-semibold mb-4">
						{t("preview", "Preview")}
					</h2>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
						<div>
							<h3 className="font-semibold text-blue-500 mb-2">
								{t("details", "Details")}
							</h3>
							<DetailItem
								label={t("product", "Product")}
								value={getOptionLabel(
									effectiveTemplate?.productOptions,
									values.loanProductId,
								)}
							/>
							<DetailItem
								label={t("loanOfficer", "Loan Officer")}
								value={
									values.loanOfficerId
										? (effectiveTemplate?.loanOfficerOptions?.find(
												(option) => option.id === Number(values.loanOfficerId),
											)?.displayName ??
											t("noLoanOfficerName", "Unknown Officer"))
										: t("noLoanOfficer", "Not Assigned")
								}
							/>
							<DetailItem
								label={t("loanPurpose", "Loan Purpose")}
								value={getOptionLabel(
									effectiveTemplate?.loanPurposeOptions,
									values.loanPurposeId,
								)}
							/>
							<DetailItem
								label={t("fund", "Fund")}
								value={getOptionLabel(
									effectiveTemplate?.fundOptions,
									values.fundId,
								)}
							/>
							<DetailItem
								label={t("submittedOn", "Submitted On")}
								value={values.submittedOnDate}
							/>
							<DetailItem
								label={t("disbursementOn", "Disbursement On")}
								value={values.expectedDisbursementDate}
							/>
						</div>
						<div>
							<h3 className="font-semibold text-blue-500 mb-2">
								{t("terms", "Terms")}
							</h3>
							<DetailItem
								label={t("principal", "Principal")}
								value={values.principal}
							/>
							<DetailItem
								label={t("loanTerm", "Loan Term")}
								value={`${values.loanTermFrequency ?? "-"} ${
									getOptionValue(
										effectiveTemplate?.termFrequencyTypeOptions,
										values.loanTermFrequencyType,
									) ?? "-"
								}`}
							/>
							<DetailItem
								label={t("numberOfRepayments", "Number of Repayments")}
								value={values.numberOfRepayments ?? "-"}
							/>
							<DetailItem
								label={t("repaidEvery", "Repaid Every")}
								value={`${values.repaymentEvery ?? "-"} ${
									getOptionValue(
										effectiveTemplate?.repaymentFrequencyTypeOptions,
										values.repaymentFrequencyType,
									) ?? "-"
								}`}
							/>
							<DetailItem
								label={t("nominalInterestRate", "Nominal Interest Rate")}
								value={
									values.interestRatePerPeriod
										? `${values.interestRatePerPeriod}%`
										: "-"
								}
							/>
							<DetailItem
								label={t("amortization", "Amortization")}
								value={
									getOptionValue(
										effectiveTemplate?.amortizationTypeOptions,
										values.amortizationType,
									) ?? "-"
								}
							/>
							<DetailItem
								label={t("interestMethod", "Interest Method")}
								value={
									getOptionValue(
										effectiveTemplate?.interestTypeOptions,
										values.interestType,
									) ?? "-"
								}
							/>
							<DetailItem
								label={t(
									"interestCalculationPeriod",
									"Interest Calculation Period",
								)}
								value={
									getOptionValue(
										effectiveTemplate?.interestCalculationPeriodTypeOptions,
										values.interestCalculationPeriodType,
									) ?? "-"
								}
							/>
							<DetailItem
								label={t("repaymentStrategy", "Repayment Strategy")}
								value={
									effectiveTemplate?.transactionProcessingStrategyOptions?.find(
										(opt) =>
											opt.code === values.transactionProcessingStrategyCode,
									)?.name ?? "-"
								}
							/>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};
