/** Distribution/coupon frequency options (value = months between payments). */
export const FREQUENCY_OPTIONS = [
	{ value: 1, label: "Monthly" },
	{ value: 3, label: "Quarterly" },
	{ value: 6, label: "Semi-Annual" },
	{ value: 12, label: "Annual" },
] as const;

/** Quick label lookup by months value. */
export const FREQUENCY_LABELS: Record<number, string> = Object.fromEntries(
	FREQUENCY_OPTIONS.map((f) => [f.value, f.label]),
);
