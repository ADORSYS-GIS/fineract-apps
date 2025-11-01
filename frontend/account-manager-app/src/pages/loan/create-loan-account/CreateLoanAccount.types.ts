import {
	GetLoansTemplateResponse as BaseGetLoansTemplateResponse,
	PostLoansRequest as BasePostLoansRequest,
	ChargeData,
	CodeValueData,
	EnumOptionData,
	FundData,
	StaffData,
	TransactionProcessingStrategyData,
} from "@fineract-apps/fineract-api";

export interface GetLoansTemplateResponse extends BaseGetLoansTemplateResponse {
	loanOfficerOptions?: StaffData[];
	loanPurposeOptions?: CodeValueData[];
	fundOptions?: FundData[];
	termFrequencyTypeOptions?: EnumOptionData[];
	repaymentFrequencyTypeOptions?: EnumOptionData[];
	interestRateFrequencyTypeOptions?: EnumOptionData[];
	amortizationTypeOptions?: EnumOptionData[];
	interestTypeOptions?: EnumOptionData[];
	interestCalculationPeriodTypeOptions?: EnumOptionData[];
	transactionProcessingStrategyOptions?: TransactionProcessingStrategyData[];
	chargeOptions?: ChargeData[];
}

export interface PostLoansRequest extends BasePostLoansRequest {
	loanPurposeId?: number;
	fundId?: number;
}

export interface LoanDetailsTemplate extends GetLoansTemplateResponse {
	principal?: number;
	termFrequency?: number;
	termPeriodFrequencyType?: EnumOptionData;
	numberOfRepayments?: number;
	repaymentEvery?: number;
	repaymentFrequencyType?: EnumOptionData;
	interestRatePerPeriod?: number;
	amortizationType?: EnumOptionData;
	interestType?: EnumOptionData;
	interestCalculationPeriodType?: EnumOptionData;
	transactionProcessingStrategyCode?: string;
	charges?: ChargeData[];
}

export interface LoanRepaymentSchedule {
	currency: {
		code: string;
		name: string;
		decimalPlaces: number;
		inMultiplesOf: number;
		displaySymbol: string;
		nameCode: string;
		displayLabel: string;
	};
	loanTermInDays: number;
	totalPrincipalDisbursed: number;
	totalPrincipalExpected: number;
	totalPrincipalPaid: number;
	totalInterestCharged: number;
	totalFeeChargesCharged: number;
	totalPenaltyChargesCharged: number;
	totalRepaymentExpected: number;
	totalOutstanding: number;
	totalCredits: number;
	periods: Array<{
		period: number;
		daysInPeriod: number;
		dueDate: number[];
		principalDisbursed?: number;
		principalLoanBalanceOutstanding: number;
		principalDue: number;
		interestDue: number;
		feeChargesDue: number;
		penaltyChargesDue: number;
		totalDueForPeriod: number;
		totalOutstandingForPeriod: number;
		totalActualCostOfLoanForPeriod: number;
	}>;
}

export interface CreateLoanAccountProps {
	loanTemplate?: GetLoansTemplateResponse;
	isLoading: boolean;
	loanDetails?: LoanDetailsTemplate;
	isLoadingLoanDetails: boolean;
}
