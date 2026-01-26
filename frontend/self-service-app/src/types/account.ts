/**
 * Account types for Fineract savings accounts
 */

export interface SavingsAccount {
	id: string;
	accountNo: string;
	externalId?: string;
	clientId: number;
	clientName: string;
	savingsProductId: number;
	savingsProductName: string;
	fieldOfficerId?: number;
	status: AccountStatus;
	currency: Currency;
	accountBalance: number;
	availableBalance: number;
	nominalAnnualInterestRate?: number;
	minRequiredOpeningBalance?: number;
	lockinPeriodFrequency?: number;
	withdrawalFeeForTransfers?: boolean;
	allowOverdraft?: boolean;
	overdraftLimit?: number;
}

export interface AccountStatus {
	id: number;
	code: string;
	value: string;
	submittedAndPendingApproval: boolean;
	approved: boolean;
	rejected: boolean;
	withdrawnByApplicant: boolean;
	active: boolean;
	closed: boolean;
	prematureClosed: boolean;
	transferInProgress: boolean;
	transferOnHold: boolean;
	matured: boolean;
}

export interface Currency {
	code: string;
	name: string;
	decimalPlaces: number;
	inMultiplesOf?: number;
	displaySymbol: string;
	nameCode: string;
	displayLabel: string;
}

export interface AccountSummary {
	totalDeposits: number;
	totalWithdrawals: number;
	totalInterestEarned: number;
	totalInterestPosted: number;
	totalWithdrawalFees: number;
	totalFeeCharge: number;
	totalPenaltyCharge: number;
	accountBalance: number;
	availableBalance: number;
}

export interface DepositRequest {
	transactionDate: string;
	transactionAmount: number;
	paymentTypeId: number;
	accountNumber?: string;
	receiptNumber?: string;
	bankNumber?: string;
	note?: string;
}

export interface WithdrawalRequest {
	transactionDate: string;
	transactionAmount: number;
	paymentTypeId: number;
	accountNumber?: string;
	receiptNumber?: string;
	bankNumber?: string;
	note?: string;
}

export interface PaymentType {
	id: number;
	name: string;
	description?: string;
	isCashPayment: boolean;
	position?: number;
}

export type PaymentMethodId =
	| "mtn_transfer"
	| "orange_transfer"
	| "uba_bank_transfer"
	| "afriland_bank_transfer";

export interface PaymentMethod {
	id: PaymentMethodId;
	paymentTypeId: number;
	name: string;
	icon: string;
	color: string;
	bgColor: string;
	enabled: boolean;
	minAmount: number;
	maxAmount: number;
	requiresKycTier: number;
}
