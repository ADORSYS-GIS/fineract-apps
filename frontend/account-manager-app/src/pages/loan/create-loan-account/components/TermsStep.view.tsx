import {
	EnumOptionData,
	TransactionProcessingStrategyData,
} from "@fineract-apps/fineract-api";
import { Input } from "@fineract-apps/ui";
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "../../common/CurrencyInput";
import { LoanDetailsTemplate } from "../CreateLoanAccount.types";

interface TermsStepViewProps {
	loanDetails: LoanDetailsTemplate;
}

export const TermsStepView = ({ loanDetails }: TermsStepViewProps) => {
	const { t } = useTranslation();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<CurrencyInput
				name="principal"
				label={t("principal", "Principal")}
				type="number"
			/>
			<div className="grid grid-cols-2 gap-2">
				<Input
					name="loanTermFrequency"
					label={t("loanTerm", "Loan Term")}
					type="number"
				/>
				<Input
					name="loanTermFrequencyType"
					label=" "
					type="select"
					options={
						loanDetails?.termFrequencyTypeOptions
							?.map((option: EnumOptionData) => ({
								label: option.value,
								value: option.id,
							}))
							.filter(
								(option): option is { label: string; value: number } =>
									option.label !== undefined && option.value !== undefined,
							) || []
					}
				/>
			</div>
			<Input
				name="numberOfRepayments"
				label={t("numberOfRepayments", "Number of Repayments")}
				type="number"
			/>
			<div className="grid grid-cols-2 gap-2">
				<Input
					name="repaymentEvery"
					label={t("repaidEvery", "Repaid Every")}
					type="number"
				/>
				<Input
					name="repaymentFrequencyType"
					label=" "
					type="select"
					options={
						loanDetails?.repaymentFrequencyTypeOptions
							?.map((option: EnumOptionData) => ({
								label: option.value,
								value: option.id,
							}))
							.filter(
								(option): option is { label: string; value: number } =>
									option.label !== undefined && option.value !== undefined,
							) || []
					}
				/>
			</div>
			<Input
				name="interestRatePerPeriod"
				label={t("nominalInterestRate", "Nominal Interest Rate")}
				type="number"
			/>
			<Input
				name="amortizationType"
				label={t("amortization", "Amortization")}
				type="select"
				options={
					loanDetails?.amortizationTypeOptions
						?.map((option: EnumOptionData) => ({
							label: option.value,
							value: option.id,
						}))
						.filter(
							(option): option is { label: string; value: number } =>
								option.label !== undefined && option.value !== undefined,
						) || []
				}
			/>
			<Input
				name="interestType"
				label={t("interestMethod", "Interest Method")}
				type="select"
				options={
					loanDetails?.interestTypeOptions
						?.map((option: EnumOptionData) => ({
							label: option.value,
							value: option.id,
						}))
						.filter(
							(option): option is { label: string; value: number } =>
								option.label !== undefined && option.value !== undefined,
						) || []
				}
			/>
			<Input
				name="interestCalculationPeriodType"
				label={t("interestCalculationPeriod", "Interest Calculation Period")}
				type="select"
				options={
					loanDetails?.interestCalculationPeriodTypeOptions
						?.map((option: EnumOptionData) => ({
							label: option.value,
							value: option.id,
						}))
						.filter(
							(option): option is { label: string; value: number } =>
								option.label !== undefined && option.value !== undefined,
						) || []
				}
			/>
			<Input
				name="transactionProcessingStrategyCode"
				label={t("repaymentStrategy", "Repayment Strategy")}
				type="select"
				options={
					loanDetails?.transactionProcessingStrategyOptions
						?.map((option: TransactionProcessingStrategyData) => ({
							label: option.name,
							value: option.code,
						}))
						.filter(
							(option): option is { label: string; value: string } =>
								option.label !== undefined && option.value !== undefined,
						) || []
				}
			/>
		</div>
	);
};
