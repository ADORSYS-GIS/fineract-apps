export interface Transaction {
	id: string;
	type: "deposit" | "withdrawal";
	amount: number;
	currency: string;
	date: string;
	runningBalance: number;
	paymentDetail?: {
		paymentType: {
			id: number;
			name: string;
		};
		receiptNumber?: string;
	};
	submittedOnDate: string;
	reversed: boolean;
}
