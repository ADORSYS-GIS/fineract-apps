export type SettleValues = {
	tellerId: string;
	cashierId: string;
	amount: number | string;
	currencyCode: string;
	date: string; // yyyy-MM-dd
	notes?: string;
};

export type TellerItem = { id: number; name?: string };
export type CashierItem = {
	id: number;
	staffName?: string;
	description?: string;
};

export type SettlePayload = {
	currencyCode: string;
	dateFormat: string;
	locale: string;
	txnAmount: number;
	txnDate: string;
	txnNote: string;
};
