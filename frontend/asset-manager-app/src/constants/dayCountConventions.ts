/** Day count convention options for interest accrual calculations. */
export const DAY_COUNT_OPTIONS = [
	{ value: "ACT_360", label: "ACT/360 (BTA standard)" },
	{ value: "ACT_365", label: "ACT/365 (OTA standard)" },
	{ value: "THIRTY_360", label: "30/360" },
] as const;

export const DAY_COUNT_LABELS: Record<string, string> = Object.fromEntries(
	DAY_COUNT_OPTIONS.map((d) => [d.value, d.label]),
);
