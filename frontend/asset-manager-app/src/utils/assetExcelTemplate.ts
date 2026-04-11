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
			"Short ticker symbol (up to 10 chars, e.g. 'BRVM'). REQUIRED. Must be unique. The internal currency code is auto-generated from this symbol.",
		example: "BRVM",
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
		key: "faceValue",
		header: "faceValue",
		required: false,
		comment:
			"Par / redemption value per unit. REQUIRED for DISCOUNT bonds (BTA). Must be greater than issuerPrice for DISCOUNT bonds. For COUPON bonds, defaults to issuerPrice if omitted.",
		example: 10000,
		type: "number",
	},
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
		key: "bondType",
		header: "bondType",
		required: false,
		comment:
			"Bond type: COUPON for interest-bearing bonds (OTA / T-Bonds with periodic coupon payments), DISCOUNT for zero-coupon bills (BTA / T-Bills bought at a discount and redeemed at face value). Required when category is BONDS.",
		example: "COUPON",
		type: "string",
		validation: ["", "COUPON", "DISCOUNT"],
	},
	{
		key: "issuerCountry",
		header: "issuerCountry",
		required: false,
		comment:
			"Country of the issuer (e.g. 'Cameroun', 'Congo', 'Tchad'). Used for bond classification and display.",
		example: "Cameroun",
		type: "string",
	},
	{
		key: "dayCountConvention",
		header: "dayCountConvention",
		required: false,
		comment:
			"Day count convention for interest accrual. ACT_360: standard for BTAs (T-Bills) in CEMAC. ACT_365: standard for OTAs (T-Bonds) in CEMAC. THIRTY_360: European convention.",
		example: "ACT_365",
		type: "string",
		validation: ["", "ACT_360", "ACT_365", "THIRTY_360"],
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
		category: "COMMODITIES",
		issuerPrice: 3000,
		totalSupply: 50000,
		decimalPlaces: 2,
		lpAskPrice: 3060,
		lpBidPrice: 2940,
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
		bondType: "",
		issuerCountry: "",
		dayCountConvention: "",
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
		category: "BONDS",
		issuerPrice: 10000,
		faceValue: 10000,
		totalSupply: 100000,
		decimalPlaces: 0,
		lpAskPrice: 10200,
		lpBidPrice: 9800,
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
		bondType: "COUPON",
		issuerCountry: "Cameroun",
		dayCountConvention: "ACT_365",
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
		category: "REAL_ESTATE",
		issuerPrice: 5000,
		totalSupply: 100000,
		decimalPlaces: 2,
		lpAskPrice: 5100,
		lpBidPrice: 4900,
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
		bondType: "",
		issuerCountry: "",
		dayCountConvention: "",
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

// ─── Shared workbook builder ────────────────────────────────────────────────

interface WorkbookOptions {
	sheetName: string;
	/** Row 2: italic grey example row (skipped during import). Pass null to omit. */
	exampleRow: Record<string, string | number | boolean> | null;
	/** Data rows starting at row 2 (or row 3 if exampleRow is set). */
	dataRows: Record<string, string | number | boolean>[];
	/** First data row index for dropdown validation (1-based). */
	firstDataRow: number;
}

async function buildWorkbook(opts: WorkbookOptions): Promise<ArrayBuffer> {
	const ExcelJS = await import("exceljs");

	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet(opts.sheetName, {
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
		cell.note = {
			texts: [{ text: col.comment, font: { size: 10 } }],
		};
	});

	// Optional example row (row 2 — skipped during import)
	if (opts.exampleRow) {
		const row = sheet.addRow(opts.exampleRow);
		row.eachCell((cell) => {
			cell.font = { italic: true, color: { argb: "FF6B7280" } };
		});
	}

	// Data rows
	for (const data of opts.dataRows) {
		sheet.addRow(data);
	}

	// Dropdown validation (applied to user-input rows only)
	for (let i = 0; i < COLUMNS.length; i++) {
		const col = COLUMNS[i];
		if (col.validation && col.validation.length > 0) {
			const colRef = sheet.getColumn(i + 1).letter;
			for (let row = opts.firstDataRow; row <= opts.firstDataRow + 99; row++) {
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

	return workbook.xlsx.writeBuffer();
}

// ─── Generic empty template ──────────────────────────────────────────────────

export async function exportAssetTemplate(): Promise<void> {
	const { saveAs } = await import("file-saver");

	const exampleData: Record<string, string | number | boolean> = {};
	for (const col of COLUMNS) {
		exampleData[col.key] = col.example;
	}

	const buffer = await buildWorkbook({
		sheetName: "Asset Import Template",
		exampleRow: exampleData,
		dataRows: SAMPLE_ROWS,
		firstDataRow: 6, // row 1=header, row 2=example, rows 3-5=samples → user rows start at 6
	});

	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	saveAs(blob, "asset-import-template.xlsx");
}

// ─── CEMAC bulletin pre-filled template ──────────────────────────────────────

const TAX_BASE = {
	registrationDutyEnabled: true,
	registrationDutyRate: 0.02,
	ircmEnabled: false,
	ircmExempt: false,
	capitalGainsTaxEnabled: false,
	isBvmacListed: false,
	isGovernmentBond: false,
};

function spread(issuerPrice: number) {
	return {
		lpAskPrice: Math.round(issuerPrice * 1.003),
		lpBidPrice: Math.round(issuerPrice * 0.997),
	};
}

function cemacStock(
	symbol: string,
	name: string,
	issuerPrice: number,
	totalSupply: number,
	lpClientId: number,
): Record<string, string | number | boolean> {
	return {
		name,
		symbol,
		// currencyCode omitted — auto-generated from symbol by the backend
		category: "STOCKS",
		issuerPrice,
		totalSupply,
		decimalPlaces: 0,
		...spread(issuerPrice),
		lpClientId,
		tradingFeePercent: 0.003,
		issuerName: "",
		isinCode: "",
		bondType: "",
		issuerCountry: "",
		dayCountConvention: "",
		maturityDate: "",
		interestRate: "",
		couponFrequencyMonths: "",
		nextCouponDate: "",
		incomeType: "",
		incomeRate: "",
		distributionFrequencyMonths: "",
		nextDistributionDate: "",
		...TAX_BASE,
		isBvmacListed: true,
	};
}

function cemacBta(
	symbol: string,
	name: string,
	isinCode: string,
	maturityDate: string,
	totalSupply: number,
	issuerCountry: string,
	lpClientId: number,
): Record<string, string | number | boolean> {
	const faceValue = 10000; // Par/redemption value — standard BTA denomination
	const issuerPrice = 9800; // Discounted purchase price (typical ~2% discount)
	return {
		name,
		symbol,
		// currencyCode omitted — auto-generated from symbol by the backend
		category: "BONDS",
		issuerPrice,
		faceValue,
		totalSupply,
		decimalPlaces: 0,
		...spread(issuerPrice),
		lpClientId,
		tradingFeePercent: 0.003,
		issuerName: issuerCountry,
		isinCode,
		bondType: "DISCOUNT",
		issuerCountry,
		dayCountConvention: "ACT_360",
		maturityDate,
		// No interestRate: DISCOUNT bonds have no coupon — setting this could
		// trigger the backend coupon scheduler. The yield is in the bulletin only.
		interestRate: "",
		couponFrequencyMonths: "",
		nextCouponDate: "",
		incomeType: "",
		incomeRate: "",
		distributionFrequencyMonths: "",
		nextDistributionDate: "",
		...TAX_BASE,
	};
}

function cemacOta(
	symbol: string,
	name: string,
	isinCode: string,
	maturityDate: string,
	totalSupply: number,
	interestRate: number,
	nextCouponDate: string,
	issuerCountry: string,
	lpClientId: number,
): Record<string, string | number | boolean> {
	const issuerPrice = 100000;
	return {
		name,
		symbol,
		// currencyCode omitted — auto-generated from symbol by the backend
		category: "BONDS",
		issuerPrice,
		totalSupply,
		decimalPlaces: 0,
		...spread(issuerPrice),
		lpClientId,
		tradingFeePercent: 0.003,
		issuerName: issuerCountry,
		isinCode,
		bondType: "COUPON",
		issuerCountry,
		dayCountConvention: "ACT_365",
		maturityDate,
		interestRate,
		couponFrequencyMonths: 12,
		nextCouponDate,
		incomeType: "",
		incomeRate: "",
		distributionFrequencyMonths: "",
		nextDistributionDate: "",
		...TAX_BASE,
	};
}

export function buildCemacRows(
	lpClientId: number,
): Record<string, string | number | boolean>[] {
	return [
		// ── BVMAC Stocks ──────────────────────────────────────────────────────
		// Source: Bulletin officiel de la cote (BOC) BVMAC du 27/03/2026
		// totalSupply = BID (shares offered on BVMAC), or ASK when BID=0
		cemacStock("SMC", "SEMC", 50000, 103, lpClientId),
		cemacStock("SFC", "SAFACAM", 33000, 303, lpClientId),
		cemacStock("SCP", "SOCAPALM", 55000, 197, lpClientId),
		cemacStock("LRG", "LA REGIONALE", 42000, 242, lpClientId),
		cemacStock("BNG", "BANGE", 228085, 3, lpClientId),
		cemacStock("SGR", "SCG-RE", 21500, 353, lpClientId),

		// ── Cameroun BTAs (T-Bills) ───────────────────────────────────────────
		cemacBta(
			"CB1",
			"Cameroun BTA 52S 2027",
			"CM1300001193",
			"2027-03-31",
			2000000,
			"Cameroun",
			lpClientId,
		),

		// ── Cameroun OTAs (T-Bonds) ───────────────────────────────────────────
		cemacOta(
			"CO2",
			"Cameroun OTA 2 ANS 2028",
			"CM2A00000146",
			"2028-04-01",
			300000,
			6.0,
			"2027-04-01",
			"Cameroun",
			lpClientId,
		),
		cemacOta(
			"CO3",
			"Cameroun OTA 3 ANS 2029",
			"CM2J00000220",
			"2029-04-01",
			350000,
			6.5,
			"2027-04-01",
			"Cameroun",
			lpClientId,
		),
		cemacOta(
			"CO4",
			"Cameroun OTA 4 ANS 2030",
			"CM2K00000110",
			"2030-04-01",
			300000,
			6.7,
			"2027-04-01",
			"Cameroun",
			lpClientId,
		),
		cemacOta(
			"CO5",
			"Cameroun OTA 5 ANS 2031",
			"CM2B00000210",
			"2031-04-01",
			200000,
			6.8,
			"2027-04-01",
			"Cameroun",
			lpClientId,
		),
		cemacOta(
			"CO7",
			"Cameroun OTA 7 ANS 2032",
			"CM2L00000119",
			"2032-04-01",
			200000,
			7.0,
			"2027-04-01",
			"Cameroun",
			lpClientId,
		),

		// ── Congo BTAs ────────────────────────────────────────────────────────
		cemacBta(
			"GB6",
			"Congo BTA 26S 2026",
			"CG1200001952",
			"2026-10-01",
			1000000,
			"Congo",
			lpClientId,
		),
		cemacBta(
			"GB1",
			"Congo BTA 52S 2027",
			"CG1300001133",
			"2027-04-01",
			1000000,
			"Congo",
			lpClientId,
		),

		// ── Congo OTAs ────────────────────────────────────────────────────────
		// GO1: 1-year bond — nextCouponDate equals maturityDate intentionally
		// (single coupon paid at redemption). The backend scheduler must handle
		// nextCouponDate >= maturityDate by not re-advancing after payment.
		cemacOta(
			"GO1",
			"Congo OTA 1 AN 2027",
			"CG2A00000684",
			"2027-07-17",
			100000,
			5.9,
			"2027-07-17",
			"Congo",
			lpClientId,
		),

		// ── Tchad BTAs ────────────────────────────────────────────────────────
		cemacBta(
			"TB6",
			"Tchad BTA 26S 2026",
			"TD1200002178",
			"2026-10-02",
			1500000,
			"Tchad",
			lpClientId,
		),

		// ── Tchad OTAs ────────────────────────────────────────────────────────
		cemacOta(
			"TO2",
			"Tchad OTA 2 ANS 2028",
			"TD2A00001105",
			"2028-04-03",
			100000,
			6.0,
			"2027-04-03",
			"Tchad",
			lpClientId,
		),
		cemacOta(
			"TO3",
			"Tchad OTA 3 ANS 2029",
			"TD2J00001015",
			"2029-04-03",
			100000,
			6.5,
			"2027-04-03",
			"Tchad",
			lpClientId,
		),
	];
}

export async function exportCemacBulletinTemplate(
	lpClientId: number,
): Promise<void> {
	const { saveAs } = await import("file-saver");

	const buffer = await buildWorkbook({
		sheetName: "CEMAC Bulletin 30-03-2026",
		exampleRow: null, // no example row — all rows are real data
		dataRows: buildCemacRows(lpClientId),
		firstDataRow: 2, // row 1=header, rows 2+=data (no example row)
	});

	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	saveAs(blob, "cemac-bulletin-2026-03-30.xlsx");
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
		let val = String(cell.value ?? "").trim();
		if (val.endsWith("*")) val = val.slice(0, -1).trim();
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
			// currencyCode omitted — auto-generated from symbol by the backend
			category: String(raw.category ?? ""),
			issuerPrice: parseNumber(raw.issuerPrice) ?? 0,
			totalSupply: parseNumber(raw.totalSupply) ?? 0,
			decimalPlaces: parseNumber(raw.decimalPlaces) ?? 0,
			lpAskPrice: parseNumber(raw.lpAskPrice) ?? 0,
			lpBidPrice: parseNumber(raw.lpBidPrice) ?? 0,
			lpClientId: parseNumber(raw.lpClientId) ?? 0,
		};

		// Apply optional fields using data-driven mapping
		const optionalStr = [
			"description",
			"issuerName",
			"isinCode",
			"bondType",
			"issuerCountry",
			"dayCountConvention",
			"incomeType",
		] as const;
		const assetAny = asset as unknown as Record<string, unknown>;
		for (const k of optionalStr) {
			if (raw[k]) assetAny[k] = String(raw[k]);
		}

		const optionalNum = [
			"tradingFeePercent",
			"maxPositionPercent",
			"maxOrderSize",
			"minOrderSize",
			"minOrderCashAmount",
			"dailyTradeLimitXaf",
			"lockupDays",
			"faceValue",
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
			if (v !== undefined) assetAny[k] = v;
		}

		const optionalDate = [
			"maturityDate",
			"nextCouponDate",
			"nextDistributionDate",
		] as const;
		for (const k of optionalDate) {
			const v = parseDate(raw[k]);
			if (v) assetAny[k] = v;
		}

		const optionalBool = [
			"registrationDutyEnabled",
			"ircmEnabled",
			"ircmExempt",
			"capitalGainsTaxEnabled",
			"isBvmacListed",
			"isGovernmentBond",
		] as const;
		for (const k of optionalBool) {
			const v = parseBoolean(raw[k]);
			if (v !== undefined) assetAny[k] = v;
		}

		rows.push(asset);
	});

	return { rows, errors };
}
