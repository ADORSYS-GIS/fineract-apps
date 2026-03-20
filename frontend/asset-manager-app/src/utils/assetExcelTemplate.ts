import type { CreateAssetRequest } from "@/services/assetApi";

interface ColumnDef {
	key: string;
	header: string;
	required: boolean;
	comment: string;
	example: string | number | boolean;
	type: "string" | "number" | "date" | "boolean";
	validation?: string[];
}

const COLUMNS: ColumnDef[] = [
	// Required fields
	{
		key: "name",
		header: "name *",
		required: true,
		comment:
			"Human-readable display name for the asset. REQUIRED. Max 200 characters.",
		example: "BRVM Composite Index",
		type: "string",
	},
	{
		key: "symbol",
		header: "symbol *",
		required: true,
		comment:
			"Short ticker symbol (max 10 chars, must be unique across all assets). REQUIRED.",
		example: "BRVM",
		type: "string",
	},
	{
		key: "currencyCode",
		header: "currencyCode *",
		required: true,
		comment:
			"ISO-style currency code used internally by Adorsys Core Banking (max 10 chars, must be unique). REQUIRED.",
		example: "BRV",
		type: "string",
	},
	{
		key: "category",
		header: "category *",
		required: true,
		comment:
			"Asset classification. REQUIRED. One of: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, CRYPTO, BONDS.",
		example: "STOCKS",
		type: "string",
		validation: [
			"REAL_ESTATE",
			"COMMODITIES",
			"AGRICULTURE",
			"STOCKS",
			"CRYPTO",
			"BONDS",
		],
	},
	{
		key: "issuerPrice",
		header: "issuerPrice *",
		required: true,
		comment:
			"Face value / issuer price in XAF. REQUIRED. This is the base price used for coupon and income calculations, not the trading price. Must be positive.",
		example: 5000,
		type: "number",
	},
	{
		key: "totalSupply",
		header: "totalSupply *",
		required: true,
		comment:
			"Maximum number of units that can ever exist for this asset. REQUIRED. The liquidity partner's account will be credited with this amount on creation. Must be positive.",
		example: 100000,
		type: "number",
	},
	{
		key: "decimalPlaces",
		header: "decimalPlaces *",
		required: true,
		comment:
			"Number of decimal places for fractional ownership (0 = whole units only, up to 8). REQUIRED. For example, 2 allows buying 0.01 units.",
		example: 2,
		type: "number",
	},
	{
		key: "lpAskPrice",
		header: "lpAskPrice *",
		required: true,
		comment:
			"LP ask price in XAF — the price investors pay to buy this asset. REQUIRED. Must be >= issuerPrice.",
		example: 5100,
		type: "number",
	},
	{
		key: "lpBidPrice",
		header: "lpBidPrice *",
		required: true,
		comment:
			"LP bid price in XAF — the price investors receive when selling this asset. REQUIRED. Must be <= lpAskPrice. The difference (ask - bid) is the LP spread.",
		example: 4900,
		type: "number",
	},
	{
		key: "subscriptionStartDate",
		header: "subscriptionStartDate *",
		required: true,
		comment:
			"Start of subscription period (YYYY-MM-DD). REQUIRED. BUY orders are only accepted within the subscription window. SELL orders are always allowed.",
		example: "2026-04-01",
		type: "date",
	},
	{
		key: "subscriptionEndDate",
		header: "subscriptionEndDate *",
		required: true,
		comment:
			"End of subscription period (YYYY-MM-DD). REQUIRED. BUY orders are rejected after this date. SELL orders are always allowed.",
		example: "2027-04-01",
		type: "date",
	},
	{
		key: "lpClientId",
		header: "lpClientId *",
		required: true,
		comment:
			"Client ID of the liquidity partner in Adorsys Core Banking. REQUIRED. This is the entity that holds the asset inventory and provides liquidity for trades. Replace with your actual LP client ID.",
		example: 1,
		type: "number",
	},

	// Optional general fields
	{
		key: "description",
		header: "description",
		required: false,
		comment:
			"Long-form description of the asset. Max 1000 characters. Shown to investors on the asset detail page.",
		example: "BRVM Composite stock index tracking West African equities",
		type: "string",
	},
	{
		key: "tradingFeePercent",
		header: "tradingFeePercent",
		required: false,
		comment:
			"Platform trading fee as a decimal (e.g. 0.005 = 0.5%). Charged on each buy/sell transaction. Leave empty for the default 0.5%.",
		example: 0.005,
		type: "number",
	},

	// Exposure limits
	{
		key: "maxPositionPercent",
		header: "maxPositionPercent",
		required: false,
		comment:
			"Maximum percentage of total supply that a single investor can hold (e.g. 10 = 10%). Prevents concentration risk. Empty = unlimited.",
		example: 10,
		type: "number",
	},
	{
		key: "maxOrderSize",
		header: "maxOrderSize",
		required: false,
		comment:
			"Maximum units per single order. Limits how much an investor can buy/sell in one transaction. Empty = unlimited.",
		example: 1000,
		type: "number",
	},
	{
		key: "minOrderSize",
		header: "minOrderSize",
		required: false,
		comment:
			"Minimum units per single order. Orders below this amount are rejected. Empty = no minimum.",
		example: 1,
		type: "number",
	},
	{
		key: "minOrderCashAmount",
		header: "minOrderCashAmount",
		required: false,
		comment:
			"Minimum XAF amount per single order. Orders with a total value below this are rejected. Empty = no minimum.",
		example: 10000,
		type: "number",
	},
	{
		key: "dailyTradeLimitXaf",
		header: "dailyTradeLimitXaf",
		required: false,
		comment:
			"Maximum XAF trading volume per user per day. Limits daily exposure. Empty = unlimited.",
		example: 5000000,
		type: "number",
	},
	{
		key: "lockupDays",
		header: "lockupDays",
		required: false,
		comment:
			"Minimum holding period in days after purchase before the investor can sell. Prevents short-term speculation. Leave empty for no lock-up restriction.",
		example: 30,
		type: "number",
	},

	// Bond fields
	{
		key: "issuerName",
		header: "issuerName",
		required: false,
		comment:
			"Name of the entity that issued this asset (e.g. 'Republic of Cameroon', 'Etat du Sénégal'). Required when category is BONDS.",
		example: "Etat du Sénégal",
		type: "string",
	},
	{
		key: "isinCode",
		header: "isinCode",
		required: false,
		comment:
			"International Securities Identification Number (ISO 6166, max 12 chars). A globally unique code identifying the bond. Optional.",
		example: "SN0000038741",
		type: "string",
	},
	{
		key: "maturityDate",
		header: "maturityDate",
		required: false,
		comment:
			"Bond maturity date (YYYY-MM-DD). The date when the bond principal is repaid. Required when category is BONDS.",
		example: "2031-06-30",
		type: "date",
	},
	{
		key: "interestRate",
		header: "interestRate",
		required: false,
		comment:
			"Annual coupon interest rate as a percentage (e.g. 5.80 = 5.80% per year). Used to calculate periodic coupon payments. Required for BONDS.",
		example: 5.8,
		type: "number",
	},
	{
		key: "couponFrequencyMonths",
		header: "couponFrequencyMonths",
		required: false,
		comment:
			"How often coupon payments are made: 1 = Monthly, 3 = Quarterly, 6 = Semi-Annual, 12 = Annual. Required for BONDS.",
		example: 6,
		type: "number",
		validation: ["1", "3", "6", "12"],
	},
	{
		key: "nextCouponDate",
		header: "nextCouponDate",
		required: false,
		comment:
			"Date of the first coupon payment (YYYY-MM-DD). Subsequent payments are auto-scheduled based on couponFrequencyMonths. Required for BONDS.",
		example: "2026-12-30",
		type: "date",
	},

	// Income distribution
	{
		key: "incomeType",
		header: "incomeType",
		required: false,
		comment:
			"Type of income this asset distributes to holders. DIVIDEND = stock dividends, RENT = real estate rental income, HARVEST_YIELD = agricultural produce income, PROFIT_SHARE = commodity profit sharing. Leave empty for no income.",
		example: "DIVIDEND",
		type: "string",
		validation: ["", "DIVIDEND", "RENT", "HARVEST_YIELD", "PROFIT_SHARE"],
	},
	{
		key: "incomeRate",
		header: "incomeRate",
		required: false,
		comment:
			"Annual income rate as a percentage (e.g. 5.0 = 5% per year). Income per period = issuerPrice × (incomeRate/100) × (frequencyMonths/12).",
		example: 5.0,
		type: "number",
	},
	{
		key: "distributionFrequencyMonths",
		header: "distributionFrequencyMonths",
		required: false,
		comment:
			"How often income is distributed to holders: 1 = Monthly, 3 = Quarterly, 6 = Semi-Annual, 12 = Annual.",
		example: 3,
		type: "number",
		validation: ["1", "3", "6", "12"],
	},
	{
		key: "nextDistributionDate",
		header: "nextDistributionDate",
		required: false,
		comment:
			"Date of the first income distribution (YYYY-MM-DD). Subsequent distributions are auto-scheduled based on distributionFrequencyMonths.",
		example: "2026-07-01",
		type: "date",
	},

	// Tax configuration
	{
		key: "registrationDutyEnabled",
		header: "registrationDutyEnabled",
		required: false,
		comment:
			"Registration duty (droit d'enregistrement) — a 2% transfer tax on each trade transaction, collected by DGI (Direction Générale des Impôts). Default: true. Use TRUE or FALSE.",
		example: true,
		type: "boolean",
	},
	{
		key: "registrationDutyRate",
		header: "registrationDutyRate",
		required: false,
		comment:
			"Override rate for registration duty (default 0.02 = 2%). Only change if a special rate applies to this asset class.",
		example: 0.02,
		type: "number",
	},
	{
		key: "ircmEnabled",
		header: "ircmEnabled",
		required: false,
		comment:
			"IRCM (Impôt sur les Revenus des Capitaux Mobiliers) — withholding tax on income distributions (dividends, coupons, rent). Auto-determined: 16.5% standard, 11% for BVMAC-listed, 5.5% for bonds ≥5yr. Default: true. Use TRUE or FALSE.",
		example: true,
		type: "boolean",
	},
	{
		key: "ircmRateOverride",
		header: "ircmRateOverride",
		required: false,
		comment:
			"Override the auto-determined IRCM rate (e.g. 0.165 = 16.5%). Leave empty to use automatic rate based on asset type and listing status.",
		example: 0.165,
		type: "number",
	},
	{
		key: "ircmExempt",
		header: "ircmExempt",
		required: false,
		comment:
			"Exempt this asset from IRCM withholding. Typically true for government bonds. Default: false. Use TRUE or FALSE.",
		example: false,
		type: "boolean",
	},
	{
		key: "capitalGainsTaxEnabled",
		header: "capitalGainsTaxEnabled",
		required: false,
		comment:
			"Capital gains tax on profitable sales. Applied when an investor sells at a price higher than their purchase price. Gains below 500,000 XAF/year are exempt. Default: true. Use TRUE or FALSE.",
		example: true,
		type: "boolean",
	},
	{
		key: "capitalGainsRate",
		header: "capitalGainsRate",
		required: false,
		comment:
			"Capital gains tax rate override (default 0.165 = 16.5%). Only change for special tax treatment.",
		example: 0.165,
		type: "number",
	},
	{
		key: "isBvmacListed",
		header: "isBvmacListed",
		required: false,
		comment:
			"Whether this asset is listed on BVMAC (Bourse des Valeurs Mobilières de l'Afrique Centrale). If true, a reduced 11% IRCM rate applies instead of the standard 16.5%. Default: false. Use TRUE or FALSE.",
		example: false,
		type: "boolean",
	},
	{
		key: "isGovernmentBond",
		header: "isGovernmentBond",
		required: false,
		comment:
			"Government-issued bond. If true, IRCM exemption is automatically applied (no withholding tax on coupon payments). Default: false. Use TRUE or FALSE.",
		example: false,
		type: "boolean",
	},
];

export const REQUIRED_KEYS = COLUMNS.filter((c) => c.required).map(
	(c) => c.key,
);

// Sample data rows that can be imported directly for testing
const SAMPLE_ROWS: Record<string, string | number | boolean>[] = [
	{
		// COMMODITIES sample
		name: "Gold Reserve Token",
		symbol: "GRT",
		currencyCode: "GRT",
		category: "COMMODITIES",
		issuerPrice: 3000,
		totalSupply: 50000,
		decimalPlaces: 2,
		lpAskPrice: 3060,
		lpBidPrice: 2940,
		subscriptionStartDate: "2026-05-01",
		subscriptionEndDate: "2027-05-01",
		lpClientId: 1,
		description:
			"Gold-backed commodity token representing fractional ownership of certified gold reserves",
		tradingFeePercent: 0.005,
		maxPositionPercent: 10,
		maxOrderSize: 500,
		minOrderSize: 1,
		minOrderCashAmount: 5000,
		dailyTradeLimitXaf: 2000000,
		lockupDays: 14,
		issuerName: "",
		isinCode: "",
		maturityDate: "",
		interestRate: "",
		couponFrequencyMonths: "",
		nextCouponDate: "",
		incomeType: "PROFIT_SHARE",
		incomeRate: 2.5,
		distributionFrequencyMonths: 3,
		nextDistributionDate: "2026-08-01",
		registrationDutyEnabled: true,
		registrationDutyRate: 0.02,
		ircmEnabled: true,
		ircmRateOverride: "",
		ircmExempt: false,
		capitalGainsTaxEnabled: true,
		capitalGainsRate: "",
		isBvmacListed: false,
		isGovernmentBond: false,
	},
	{
		// BONDS sample
		name: "Cameroon Gov Bond 2030",
		symbol: "CGB",
		currencyCode: "CGB",
		category: "BONDS",
		issuerPrice: 10000,
		totalSupply: 100000,
		decimalPlaces: 0,
		lpAskPrice: 10200,
		lpBidPrice: 9800,
		subscriptionStartDate: "2026-05-01",
		subscriptionEndDate: "2028-05-01",
		lpClientId: 1,
		description:
			"Republic of Cameroon government bond maturing 2030 with 5.80% annual coupon",
		tradingFeePercent: 0.003,
		maxPositionPercent: 15,
		maxOrderSize: 1000,
		minOrderSize: 1,
		minOrderCashAmount: 10000,
		dailyTradeLimitXaf: 5000000,
		lockupDays: 0,
		issuerName: "Republic of Cameroon",
		isinCode: "CM0000001234",
		maturityDate: "2030-12-31",
		interestRate: 5.8,
		couponFrequencyMonths: 6,
		nextCouponDate: "2026-12-30",
		incomeType: "",
		incomeRate: "",
		distributionFrequencyMonths: "",
		nextDistributionDate: "",
		registrationDutyEnabled: true,
		registrationDutyRate: 0.02,
		ircmEnabled: true,
		ircmRateOverride: "",
		ircmExempt: true,
		capitalGainsTaxEnabled: true,
		capitalGainsRate: "",
		isBvmacListed: false,
		isGovernmentBond: true,
	},
	{
		// REAL_ESTATE sample
		name: "Douala Tower Token",
		symbol: "DTT",
		currencyCode: "DTT",
		category: "REAL_ESTATE",
		issuerPrice: 5000,
		totalSupply: 100000,
		decimalPlaces: 2,
		lpAskPrice: 5100,
		lpBidPrice: 4900,
		subscriptionStartDate: "2026-05-01",
		subscriptionEndDate: "2027-05-01",
		lpClientId: 1,
		description:
			"Tokenized commercial property in Douala business district generating quarterly rental income",
		tradingFeePercent: 0.005,
		maxPositionPercent: 10,
		maxOrderSize: 500,
		minOrderSize: 1,
		minOrderCashAmount: 10000,
		dailyTradeLimitXaf: 3000000,
		lockupDays: 30,
		issuerName: "",
		isinCode: "",
		maturityDate: "",
		interestRate: "",
		couponFrequencyMonths: "",
		nextCouponDate: "",
		incomeType: "RENT",
		incomeRate: 3.5,
		distributionFrequencyMonths: 3,
		nextDistributionDate: "2026-08-01",
		registrationDutyEnabled: true,
		registrationDutyRate: 0.02,
		ircmEnabled: true,
		ircmRateOverride: "",
		ircmExempt: false,
		capitalGainsTaxEnabled: true,
		capitalGainsRate: "",
		isBvmacListed: false,
		isGovernmentBond: false,
	},
];

export async function exportAssetTemplate(): Promise<void> {
	const ExcelJS = await import("exceljs");
	const { saveAs } = await import("file-saver");

	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("Asset Import Template", {
		views: [{ state: "frozen", ySplit: 1 }],
	});

	// Define columns
	sheet.columns = COLUMNS.map((col) => ({
		header: col.header,
		key: col.key,
		width: Math.max(col.header.length + 4, 18),
	}));

	// Style header row
	const headerRow = sheet.getRow(1);
	headerRow.eachCell((cell, colNumber) => {
		const col = COLUMNS[colNumber - 1];
		cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
		cell.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: col.required ? "FFB91C1C" : "FF2563EB" },
		};
		cell.alignment = { horizontal: "center", vertical: "middle" };
		cell.border = {
			bottom: { style: "thin", color: { argb: "FF000000" } },
		};

		// Add comment with field description
		cell.note = {
			texts: [{ text: col.comment, font: { size: 10 } }],
		};
	});

	// Add example row (row 2 — skipped during import)
	const exampleData: Record<string, string | number | boolean> = {};
	for (const col of COLUMNS) {
		exampleData[col.key] = col.example;
	}
	const exampleRow = sheet.addRow(exampleData);
	exampleRow.eachCell((cell) => {
		cell.font = { italic: true, color: { argb: "FF6B7280" } };
	});

	// Add sample data rows (rows 3-5 — these WILL be imported)
	for (const sampleData of SAMPLE_ROWS) {
		sheet.addRow(sampleData);
	}

	// Add data validation for dropdowns (range-based for efficiency)
	for (let i = 0; i < COLUMNS.length; i++) {
		const col = COLUMNS[i];
		if (col.validation && col.validation.length > 0) {
			const colRef = sheet.getColumn(i + 1).letter;
			// Apply validation from row 6 onwards (row 1 = header, row 2 = example, rows 3-5 = samples)
			for (let row = 6; row <= 105; row++) {
				sheet.getCell(`${colRef}${row}`).dataValidation = {
					type: "list",
					allowBlank: !col.required,
					formulae: [`"${col.validation.join(",")}"`],
					showErrorMessage: true,
					errorTitle: "Invalid value",
					error: `Must be one of: ${col.validation.join(", ")}`,
				};
			}
		}
	}

	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	saveAs(blob, "asset-import-template.xlsx");
}

export interface ParseError {
	row: number;
	field: string;
	message: string;
}

export interface ParseResult {
	rows: CreateAssetRequest[];
	errors: ParseError[];
}

function isExampleRow(row: Record<string, unknown>): boolean {
	return row.symbol === "BRVM" && row.name === "BRVM Composite Index";
}

function parseBoolean(val: unknown): boolean | undefined {
	if (val === true || val === "TRUE" || val === "true") return true;
	if (val === false || val === "FALSE" || val === "false") return false;
	return undefined;
}

function parseDate(val: unknown): string | undefined {
	if (!val) return undefined;
	if (val instanceof Date) {
		return val.toISOString().split("T")[0];
	}
	const str = String(val).trim();
	if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
	// Try parsing other date formats
	const d = new Date(str);
	if (!Number.isNaN(d.getTime())) return d.toISOString().split("T")[0];
	return undefined;
}

function parseNumber(val: unknown): number | undefined {
	if (val === null || val === undefined || val === "") return undefined;
	const n = Number(val);
	return Number.isNaN(n) ? undefined : n;
}

export async function parseAssetExcel(
	file: File | ArrayBuffer,
): Promise<ParseResult> {
	const ExcelJS = await import("exceljs");
	const workbook = new ExcelJS.Workbook();
	const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
	await workbook.xlsx.load(buffer);

	const sheet = workbook.getWorksheet(1);
	if (!sheet) {
		return {
			rows: [],
			errors: [{ row: 0, field: "", message: "No worksheet found in file" }],
		};
	}

	// Map header row to column indices
	const headerRow = sheet.getRow(1);
	const headerMap = new Map<string, number>();
	headerRow.eachCell((cell, colNumber) => {
		const val = String(cell.value ?? "")
			.replace(/\s*\*$/, "")
			.trim();
		headerMap.set(val, colNumber);
	});

	const rows: CreateAssetRequest[] = [];
	const errors: ParseError[] = [];

	sheet.eachRow((row, rowNumber) => {
		if (rowNumber <= 1) return; // skip header

		// Build raw data object
		const raw: Record<string, unknown> = {};
		for (const col of COLUMNS) {
			const colIdx = headerMap.get(col.key);
			if (colIdx) {
				const cellValue = row.getCell(colIdx).value;
				raw[col.key] = cellValue;
			}
		}

		// Skip example row
		if (rowNumber === 2 && isExampleRow(raw)) return;

		// Skip completely empty rows
		const hasAnyValue = Object.values(raw).some(
			(v) => v !== null && v !== undefined && v !== "",
		);
		if (!hasAnyValue) return;

		// Validate required fields
		for (const reqKey of REQUIRED_KEYS) {
			const val = raw[reqKey];
			if (val === null || val === undefined || val === "") {
				errors.push({
					row: rowNumber,
					field: reqKey,
					message: `${reqKey} is required`,
				});
			}
		}

		// Validate category enum
		const category = String(raw.category ?? "");
		const validCategories = [
			"REAL_ESTATE",
			"COMMODITIES",
			"AGRICULTURE",
			"STOCKS",
			"CRYPTO",
			"BONDS",
		];
		if (category && !validCategories.includes(category)) {
			errors.push({
				row: rowNumber,
				field: "category",
				message: `Invalid category: ${category}`,
			});
		}

		// Build CreateAssetRequest
		const asset: CreateAssetRequest = {
			name: String(raw.name ?? ""),
			symbol: String(raw.symbol ?? ""),
			currencyCode: String(raw.currencyCode ?? ""),
			category: String(raw.category ?? ""),
			issuerPrice: parseNumber(raw.issuerPrice) ?? 0,
			totalSupply: parseNumber(raw.totalSupply) ?? 0,
			decimalPlaces: parseNumber(raw.decimalPlaces) ?? 0,
			lpAskPrice: parseNumber(raw.lpAskPrice) ?? 0,
			lpBidPrice: parseNumber(raw.lpBidPrice) ?? 0,
			subscriptionStartDate: parseDate(raw.subscriptionStartDate) ?? "",
			subscriptionEndDate: parseDate(raw.subscriptionEndDate) ?? "",
			lpClientId: parseNumber(raw.lpClientId) ?? 0,
		};

		// Apply optional fields using data-driven mapping
		const optionalStr = [
			"description",
			"issuerName",
			"isinCode",
			"incomeType",
		] as const;
		for (const k of optionalStr) {
			if (raw[k]) (asset as Record<string, unknown>)[k] = String(raw[k]);
		}

		const optionalNum = [
			"tradingFeePercent",
			"maxPositionPercent",
			"maxOrderSize",
			"minOrderSize",
			"minOrderCashAmount",
			"dailyTradeLimitXaf",
			"lockupDays",
			"interestRate",
			"couponFrequencyMonths",
			"incomeRate",
			"distributionFrequencyMonths",
			"registrationDutyRate",
			"ircmRateOverride",
			"capitalGainsRate",
		] as const;
		for (const k of optionalNum) {
			const v = parseNumber(raw[k]);
			if (v !== undefined) (asset as Record<string, unknown>)[k] = v;
		}

		const optionalDate = [
			"maturityDate",
			"nextCouponDate",
			"nextDistributionDate",
		] as const;
		for (const k of optionalDate) {
			const v = parseDate(raw[k]);
			if (v) (asset as Record<string, unknown>)[k] = v;
		}

		const optionalBool = [
			"registrationDutyEnabled",
			"ircmEnabled",
			"ircmExempt",
			"capitalGainsTaxEnabled",
		] as const;
		for (const k of optionalBool) {
			const v = parseBoolean(raw[k]);
			if (v !== undefined) (asset as Record<string, unknown>)[k] = v;
		}

		rows.push(asset);
	});

	return { rows, errors };
}
