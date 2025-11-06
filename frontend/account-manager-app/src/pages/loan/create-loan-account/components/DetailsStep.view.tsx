import {
	CodeValueData,
	FundData,
	LoanProductData,
	StaffData,
} from "@fineract-apps/fineract-api";
import { Input } from "@fineract-apps/ui";
import { useTranslation } from "react-i18next";
import { CreateLoanAccountProps } from "../CreateLoanAccount.types";

export const DetailsStepView = ({
	loanTemplate,
	isLoading,
	loanDetails,
}: CreateLoanAccountProps) => {
	const { t } = useTranslation();

	if (isLoading) {
		return <div>{t("loading", "Loading...")}</div>;
	}

	const effectiveTemplate = loanDetails || loanTemplate;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div className="md:col-span-2 lg:col-span-3">
				<Input
					name="loanProductId"
					label={t("loanProduct", "Loan Product")}
					type="select"
					placeholder="Select a loan product"
					options={
						loanTemplate?.productOptions
							?.map((option: LoanProductData) => ({
								label: option.name,
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
				name="loanOfficerId"
				label={t("loanOfficer", "Loan Officer")}
				type="select"
				options={
					effectiveTemplate?.loanOfficerOptions
						?.map((option: StaffData) => ({
							label: option.displayName,
							value: option.id,
						}))
						.filter(
							(option): option is { label: string; value: number } =>
								option.label !== undefined && option.value !== undefined,
						) || []
				}
			/>
			<Input
				name="loanPurposeId"
				label={t("loanPurpose", "Loan Purpose")}
				type="select"
				options={
					effectiveTemplate?.loanPurposeOptions
						?.map((option: CodeValueData) => ({
							label: option.name,
							value: option.id,
						}))
						.filter(
							(option): option is { label: string; value: number } =>
								option.label !== undefined && option.value !== undefined,
						) || []
				}
			/>
			<Input
				name="fundId"
				label={t("fund", "Fund")}
				type="select"
				options={
					effectiveTemplate?.fundOptions
						?.map((option: FundData) => ({
							label: option.name,
							value: option.id,
						}))
						.filter(
							(option): option is { label: string; value: number } =>
								option.label !== undefined && option.value !== undefined,
						) || []
				}
			/>
			<Input
				name="submittedOnDate"
				label={t("submittedOn", "Submitted On")}
				type="date"
			/>
			<Input
				name="expectedDisbursementDate"
				label={t("disbursementOn", "Disbursement On")}
				type="date"
			/>
			<Input
				name="linkAccountId"
				label={t("linkSavings", "Link Savings")}
				type="select"
				options={
					effectiveTemplate?.accountLinkingOptions
						?.map((option) => ({
							label: `${option.accountNo} ${option.productName}`,
							value: option.id,
						}))
						.filter(
							(option): option is { label: string; value: number } =>
								option.label !== undefined && option.value !== undefined,
						) || []
				}
			/>
		</div>
	);
};
