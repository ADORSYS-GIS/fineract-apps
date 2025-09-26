export const formatCurrency = (amount: number | undefined | null) => {
	if (amount === undefined || amount === null) {
		return "";
	}
	return new Intl.NumberFormat("en-US", {
		style: "decimal",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
};
