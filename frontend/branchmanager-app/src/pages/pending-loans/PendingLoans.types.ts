export type Loan = {
	id: number;
	clientName?: string;
	loanOfficerName?: string;
	principal?: number;
	submittedOnDate?: string;
	loanProductName?: string;
};

export type PendingLoansViewProps = {
	loans: Loan[];
	isLoading: boolean;
	error?: string;
};
