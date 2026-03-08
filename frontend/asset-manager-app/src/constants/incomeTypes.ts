/** Must match backend enum values. */
export const INCOME_TYPES = [
	{ value: "", label: "None" },
	{ value: "DIVIDEND", label: "Dividend" },
	{ value: "RENT", label: "Rent" },
	{ value: "HARVEST_YIELD", label: "Harvest Yield" },
	{ value: "PROFIT_SHARE", label: "Profit Share" },
] as const;

/** Quick label lookup by value. */
export const INCOME_TYPE_LABELS: Record<string, string> = Object.fromEntries(
	INCOME_TYPES.filter((t) => t.value).map((t) => [t.value, t.label]),
);

/** Whether the income type is variable (market-dependent) or typically fixed. */
export const INCOME_VARIABILITY: Record<
	string,
	{ label: string; variable: boolean }
> = {
	DIVIDEND: { label: "Variable", variable: true },
	RENT: { label: "Typically Fixed", variable: false },
	HARVEST_YIELD: { label: "Variable", variable: true },
	PROFIT_SHARE: { label: "Variable", variable: true },
};
