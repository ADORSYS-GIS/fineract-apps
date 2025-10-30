export type ApproveSavingsAccountListItem = {
	id: number;
	savingsProductName?: string;
	clientName?: string;
	accountNo?: string | number;
	status?: string;
};

export type ApproveFormValues = {
	approvedOnDate: string;
	note?: string;
};

export type DetailData = {
	productName?: string;
	clientName?: string;
	accountNo?: string | number;
	status?: string;
	balance?: number | string;
	defaultDate: string;
};
