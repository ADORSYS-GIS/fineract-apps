/** Bond type classification for CEMAC treasury instruments. */
export const BOND_TYPE_OPTIONS = [
	{ value: "COUPON", label: "OTA / T-Bonds (Coupon)" },
	{ value: "DISCOUNT", label: "BTA / T-Bills (Discount)" },
] as const;

export const BOND_TYPE_LABELS: Record<string, string> = Object.fromEntries(
	BOND_TYPE_OPTIONS.map((b) => [b.value, b.label]),
);
