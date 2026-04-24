import * as ExcelJS from "exceljs";
import {
	buildCemacRows,
	parseAssetExcel,
	REQUIRED_KEYS,
} from "@/utils/assetExcelTemplate";

// Helper: create a workbook ArrayBuffer with header + data rows for testing
async function createTestWorkbook(
	dataRows: Record<string, unknown>[],
	includeExample = true,
): Promise<ArrayBuffer> {
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("Sheet1");

	const headers = [
		"name *",
		"symbol *",
		"category *",
		"issuerPrice *",
		"totalSupply *",
		"decimalPlaces *",
		"lpAskPrice *",
		"lpBidPrice *",
		"lpClientId *",
		"description",
		"tradingFeePercent",
	];

	// Header row
	sheet.addRow(headers);

	// Example row (should be skipped by parser)
	if (includeExample) {
		sheet.addRow([
			"BRVM Composite Index",
			"BRVM",
			"STOCKS",
			5000,
			100000,
			2,
			5100,
			4900,
			1,
			"Example description",
			0.005,
		]);
	}

	// Data rows
	for (const row of dataRows) {
		const vals = headers.map((h) => {
			const key = h.replace(/\s*\*$/, "").trim();
			return row[key] ?? "";
		});
		sheet.addRow(vals);
	}

	const buf = await workbook.xlsx.writeBuffer();
	// Convert Node Buffer to plain ArrayBuffer
	const uint8 = new Uint8Array(buf);
	return uint8.buffer.slice(
		uint8.byteOffset,
		uint8.byteOffset + uint8.byteLength,
	);
}

describe("assetExcelTemplate", () => {
	describe("REQUIRED_KEYS", () => {
		it("contains all mandatory field keys", () => {
			expect(REQUIRED_KEYS).toContain("name");
			expect(REQUIRED_KEYS).toContain("symbol");
			// currencyCode is auto-derived from symbol, not in template
			expect(REQUIRED_KEYS).toContain("category");
			expect(REQUIRED_KEYS).toContain("issuerPrice");
			expect(REQUIRED_KEYS).toContain("totalSupply");
			expect(REQUIRED_KEYS).toContain("decimalPlaces");
			expect(REQUIRED_KEYS).toContain("lpAskPrice");
			expect(REQUIRED_KEYS).toContain("lpBidPrice");
			expect(REQUIRED_KEYS).toContain("lpClientId");
		});

		it("does not contain optional fields", () => {
			expect(REQUIRED_KEYS).not.toContain("description");
			expect(REQUIRED_KEYS).not.toContain("tradingFeePercent");
			expect(REQUIRED_KEYS).not.toContain("issuerName");
			expect(REQUIRED_KEYS).not.toContain("incomeType");
		});
	});

	describe("parseAssetExcel", () => {
		it("parses a valid file with one data row", async () => {
			const file = await createTestWorkbook([
				{
					name: "Gold Token",
					symbol: "GLD",
					category: "COMMODITIES",
					issuerPrice: 50000,
					totalSupply: 10000,
					decimalPlaces: 2,
					lpAskPrice: 51000,
					lpBidPrice: 49000,
					lpClientId: 2,
				},
			]);

			const result = await parseAssetExcel(file);
			expect(result.rows).toHaveLength(1);
			expect(result.errors).toHaveLength(0);
			expect(result.rows[0].symbol).toBe("GLD");
			expect(result.rows[0].category).toBe("COMMODITIES");
			expect(result.rows[0].issuerPrice).toBe(50000);
			expect(result.rows[0].totalSupply).toBe(10000);
		});

		it("skips the example row", async () => {
			const file = await createTestWorkbook([]); // only example row
			const result = await parseAssetExcel(file);
			expect(result.rows).toHaveLength(0);
			expect(result.errors).toHaveLength(0);
		});

		it("validates required fields and returns errors", async () => {
			const file = await createTestWorkbook([
				{
					name: "Incomplete Asset",
					// symbol missing
					category: "STOCKS",
					// issuerPrice missing
					totalSupply: 100,
					decimalPlaces: 0,
					lpAskPrice: 100,
					lpBidPrice: 90,
					lpClientId: 1,
				},
			]);

			const result = await parseAssetExcel(file);
			expect(result.rows).toHaveLength(1); // row still parsed
			expect(result.errors.length).toBeGreaterThan(0);

			const errorFields = result.errors.map((e) => e.field);
			expect(errorFields).toContain("symbol");
			expect(errorFields).toContain("issuerPrice");
		});

		it("validates invalid category", async () => {
			const file = await createTestWorkbook([
				{
					name: "Bad Category",
					symbol: "BAD",
					category: "INVALID",
					issuerPrice: 100,
					totalSupply: 100,
					decimalPlaces: 0,
					lpAskPrice: 110,
					lpBidPrice: 90,
					lpClientId: 1,
				},
			]);

			const result = await parseAssetExcel(file);
			expect(result.errors.some((e) => e.field === "category")).toBe(true);
		});

		it("parses multiple data rows", async () => {
			const file = await createTestWorkbook([
				{
					name: "Asset A",
					symbol: "AAA",
					category: "STOCKS",
					issuerPrice: 1000,
					totalSupply: 50000,
					decimalPlaces: 0,
					lpAskPrice: 1050,
					lpBidPrice: 950,
					lpClientId: 1,
				},
				{
					name: "Asset B",
					symbol: "BBB",
					category: "REAL_ESTATE",
					issuerPrice: 25000,
					totalSupply: 1000,
					decimalPlaces: 2,
					lpAskPrice: 25500,
					lpBidPrice: 24500,
					lpClientId: 1,
				},
			]);

			const result = await parseAssetExcel(file);
			expect(result.rows).toHaveLength(2);
			expect(result.rows[0].symbol).toBe("AAA");
			expect(result.rows[1].symbol).toBe("BBB");
		});

		it("skips completely empty rows", async () => {
			const file = await createTestWorkbook([
				{
					name: "Real Asset",
					symbol: "REA",
					category: "AGRICULTURE",
					issuerPrice: 2000,
					totalSupply: 8000,
					decimalPlaces: 0,
					lpAskPrice: 2100,
					lpBidPrice: 1900,
					lpClientId: 1,
				},
				{}, // empty row
			]);

			const result = await parseAssetExcel(file);
			expect(result.rows).toHaveLength(1);
		});

		it("parses new bond fields: bondType, issuerCountry, dayCountConvention", async () => {
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Sheet1");
			const headers = [
				"name *",
				"symbol *",
				"category *",
				"issuerPrice *",
				"totalSupply *",
				"decimalPlaces *",
				"lpAskPrice *",
				"lpBidPrice *",
				"lpClientId *",
				"bondType",
				"issuerCountry",
				"dayCountConvention",
				"isinCode",
			];
			sheet.addRow(headers);
			sheet.addRow([
				"Test Bond",
				"TST",
				"BONDS",
				10000,
				1000000,
				0,
				10030,
				9970,
				1,
				"DISCOUNT",
				"Cameroun",
				"ACT_360",
				"CM1300001193",
			]);
			const buf = await workbook.xlsx.writeBuffer();
			const uint8 = new Uint8Array(buf as ArrayBuffer);
			const file = uint8.buffer.slice(
				uint8.byteOffset,
				uint8.byteOffset + uint8.byteLength,
			) as ArrayBuffer;

			const result = await parseAssetExcel(file);
			expect(result.errors).toHaveLength(0);
			const asset = result.rows[0] as unknown as Record<string, unknown>;
			expect(asset.bondType).toBe("DISCOUNT");
			expect(asset.issuerCountry).toBe("Cameroun");
			expect(asset.dayCountConvention).toBe("ACT_360");
		});

		it("parses optional tradingFeePercent", async () => {
			const file = await createTestWorkbook([
				{
					name: "Fee Asset",
					symbol: "FEE",
					category: "STOCKS",
					issuerPrice: 500,
					totalSupply: 20000,
					decimalPlaces: 2,
					lpAskPrice: 520,
					lpBidPrice: 480,
					lpClientId: 1,
					tradingFeePercent: 0.01,
				},
			]);

			const result = await parseAssetExcel(file);
			expect(result.rows).toHaveLength(1);
			expect(result.rows[0].tradingFeePercent).toBe(0.01);
		});
	});

	describe("buildCemacRows", () => {
		const LP_ID = 42;
		let rows: ReturnType<typeof buildCemacRows>;

		beforeEach(() => {
			rows = buildCemacRows(LP_ID);
		});

		it("returns exactly 18 rows", () => {
			expect(rows).toHaveLength(18);
		});

		it("sets lpClientId on every row", () => {
			for (const row of rows) {
				expect(row.lpClientId).toBe(LP_ID);
			}
		});

		it("all symbols are 3 characters", () => {
			for (const row of rows) {
				expect(String(row.symbol)).toHaveLength(3);
			}
		});

		it("all symbols are unique", () => {
			const symbols = rows.map((r) => r.symbol);
			expect(new Set(symbols).size).toBe(18);
		});

		it("computes spread correctly for BANGE stock (228085)", () => {
			const bange = rows.find((r) => r.symbol === "BNG");
			expect(bange?.issuerPrice).toBe(228085);
			expect(bange?.lpAskPrice).toBe(Math.round(228085 * 1.003)); // 228769
			expect(bange?.lpBidPrice).toBe(Math.round(228085 * 0.997)); // 227401
		});

		it("BTA rows have bondType=DISCOUNT and no interestRate", () => {
			const btaSymbols = ["CB1", "GB6", "GB1", "TB6"];
			for (const sym of btaSymbols) {
				const row = rows.find((r) => r.symbol === sym);
				expect(row?.bondType).toBe("DISCOUNT");
				expect(row?.dayCountConvention).toBe("ACT_360");
				expect(row?.issuerPrice).toBe(9800);
				expect(row?.faceValue).toBe(10000);
				expect(row?.interestRate).toBe("");
			}
		});

		it("OTA rows have bondType=COUPON, annual frequency, ACT_365", () => {
			const otaSymbols = [
				"CO2",
				"CO3",
				"CO4",
				"CO5",
				"CO7",
				"GO1",
				"TO2",
				"TO3",
			];
			for (const sym of otaSymbols) {
				const row = rows.find((r) => r.symbol === sym);
				expect(row?.bondType).toBe("COUPON");
				expect(row?.dayCountConvention).toBe("ACT_365");
				expect(row?.couponFrequencyMonths).toBe(12);
				expect(row?.issuerPrice).toBe(100000);
			}
		});

		it("CEMAC bond ISINs match the Elite Capital bulletin", () => {
			expect(rows.find((r) => r.symbol === "CB1")?.isinCode).toBe(
				"CM1300001193",
			);
			expect(rows.find((r) => r.symbol === "CO7")?.isinCode).toBe(
				"CM2L00000119",
			);
			expect(rows.find((r) => r.symbol === "GO1")?.isinCode).toBe(
				"CG2A00000684",
			);
		});

		it("OTA interest rates are the lower bound from the yield range", () => {
			expect(rows.find((r) => r.symbol === "CO2")?.interestRate).toBe(6.0);
			expect(rows.find((r) => r.symbol === "CO3")?.interestRate).toBe(6.5);
			expect(rows.find((r) => r.symbol === "CO7")?.interestRate).toBe(7.0);
			expect(rows.find((r) => r.symbol === "GO1")?.interestRate).toBe(5.9);
		});

		it("registration duty is enabled on all rows", () => {
			for (const row of rows) {
				expect(row.registrationDutyEnabled).toBe(true);
				expect(row.registrationDutyRate).toBe(0.02);
			}
		});

		it("CEMAC equities have IRCM and capital-gains tax enabled", () => {
			const stockSymbols = ["SMC", "SFC", "SCP", "LRG", "BNG", "SGR"];
			for (const sym of stockSymbols) {
				const row = rows.find((r) => r.symbol === sym);
				expect(row?.ircmEnabled).toBe(true);
				expect(row?.capitalGainsTaxEnabled).toBe(true);
			}
		});

		it("government bonds have IRCM and capital-gains tax disabled", () => {
			const bondSymbols = [
				"CB1",
				"GB6",
				"GB1",
				"TB6",
				"CO2",
				"CO3",
				"CO4",
				"CO5",
				"CO7",
				"GO1",
				"TO2",
				"TO3",
			];
			for (const sym of bondSymbols) {
				const row = rows.find((r) => r.symbol === sym);
				expect(row?.ircmEnabled).toBe(false);
				expect(row?.capitalGainsTaxEnabled).toBe(false);
			}
		});

		it("all rows have 3% trading fee", () => {
			for (const row of rows) {
				expect(row.tradingFeePercent).toBe(0.003);
			}
		});
	});
});
