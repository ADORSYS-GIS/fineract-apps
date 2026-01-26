/**
 * Transaction types for Fineract savings transactions
 */

export interface Transaction {
	id: string;
	transactionType: TransactionType;
	accountId: string;
	accountNo: string;
	date: string;
	currency: TransactionCurrency;
	amount: number;
	runningBalance: number;
	reversed: boolean;
	submittedOnDate: string;
	isManualTransaction?: boolean;
	isReversed?: boolean;
	paymentDetail?: PaymentDetail;
	transfer?: TransferDetail;
}

export interface TransactionType {
	id: number;
	code: string;
	value: string;
	deposit: boolean;
	dividendPayout: boolean;
	withdrawal: boolean;
	interestPosting: boolean;
	feeDeduction: boolean;
	initiateTransfer: boolean;
	approveTransfer: boolean;
	withdrawTransfer: boolean;
	rejectTransfer: boolean;
	overdraftInterest: boolean;
	writtenoff: boolean;
	overdraftFee: boolean;
	withholdTax: boolean;
	escheat: boolean;
	amountHold: boolean;
	amountRelease: boolean;
}

export interface TransactionCurrency {
	code: string;
	name: string;
	decimalPlaces: number;
	displaySymbol: string;
	nameCode: string;
	displayLabel: string;
}

export interface PaymentDetail {
	id: number;
	paymentType: {
		id: number;
		name: string;
	};
	accountNumber?: string;
	checkNumber?: string;
	routingCode?: string;
	receiptNumber?: string;
	bankNumber?: string;
}

export interface TransferDetail {
	id: number;
	reversed: boolean;
	currency: TransactionCurrency;
	transferAmount: number;
	transferDate: string;
	transferDescription: string;
}

export type TransactionFilter = "all" | "deposit" | "withdrawal";

export interface TransactionListParams {
	accountId: string;
	fromDate?: string;
	toDate?: string;
	offset?: number;
	limit?: number;
}

export interface TransactionSummary {
	totalDeposits: number;
	totalWithdrawals: number;
	depositCount: number;
	withdrawalCount: number;
	netChange: number;
}

export function isDeposit(tx: Transaction): boolean {
	return tx.transactionType.deposit;
}

export function isWithdrawal(tx: Transaction): boolean {
	return tx.transactionType.withdrawal;
}

export function getTransactionTypeLabel(
	tx: Transaction,
): "deposit" | "withdrawal" | "other" {
	if (tx.transactionType.deposit) return "deposit";
	if (tx.transactionType.withdrawal) return "withdrawal";
	return "other";
}
