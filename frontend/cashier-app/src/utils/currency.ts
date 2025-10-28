export const formatCurrency = (
	amount: number | undefined | null,
	currencyCode?: string,
) => {
	if (amount === undefined || amount === null) {
		return "";
	}
	const formattedAmount = new Intl.NumberFormat("en-US", {
		style: "decimal",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);

	if (currencyCode) {
		return `${currencyCode} ${formattedAmount}`;
	}

	return formattedAmount;
};
