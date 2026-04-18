/** Set to true to restrict the UI to OTA and BTA bonds only. Flip to false to re-enable all categories. */
export const BOND_ONLY_MODE = true;

export const BOND_FILTER_OPTIONS = [
	{ value: "", label: "All" },
	{ value: "COUPON", label: "OTA" },
	{ value: "DISCOUNT", label: "BTA" },
] as const;

/** Must match backend enum: AssetCategory.java */
export const ASSET_CATEGORIES = [
	{ value: "REAL_ESTATE", label: "Real Estate" },
	{ value: "COMMODITIES", label: "Commodities" },
	{ value: "AGRICULTURE", label: "Agriculture" },
	{ value: "STOCKS", label: "Stocks" },
	{ value: "CRYPTO", label: "Crypto" },
	{ value: "BONDS", label: "Bonds" },
] as const;

export const ASSET_CATEGORIES_WITH_ALL = [
	{ value: "", label: "All" },
	...ASSET_CATEGORIES,
] as const;

export const ASSET_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
	ASSET_CATEGORIES.map((c) => [c.value, c.label]),
);
