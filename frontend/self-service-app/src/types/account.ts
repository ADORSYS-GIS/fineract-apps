export interface SavingsAccount {
	id: string;
	accountNo: string;
	productName: string;
	status: {
		id: number;
		code: string;
		value: string;
	};
	currency: {
		code: string;
		name: string;
		decimalPlaces: number;
		displaySymbol: string;
	};
	accountBalance: number;
	availableBalance: number;
}
