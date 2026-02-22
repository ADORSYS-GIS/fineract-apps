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
