import * as ExcelJS from "exceljs";
import { parseAssetExcel, REQUIRED_KEYS } from "@/utils/assetExcelTemplate";

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
		"currencyCode *",
		"category *",
		"issuerPrice *",
		"totalSupply *",
		"decimalPlaces *",
		"lpAskPrice *",
		"lpBidPrice *",
		"subscriptionStartDate *",
		"subscriptionEndDate *",
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
			"BRV",
			"STOCKS",
			5000,
			100000,
			2,
			5100,
			4900,
			"2026-04-01",
			"2027-04-01",
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
			expect(REQUIRED_KEYS).toContain("currencyCode");
			expect(REQUIRED_KEYS).toContain("category");
			expect(REQUIRED_KEYS).toContain("issuerPrice");
			expect(REQUIRED_KEYS).toContain("totalSupply");
			expect(REQUIRED_KEYS).toContain("decimalPlaces");
			expect(REQUIRED_KEYS).toContain("lpAskPrice");
			expect(REQUIRED_KEYS).toContain("lpBidPrice");
			expect(REQUIRED_KEYS).toContain("subscriptionStartDate");
			expect(REQUIRED_KEYS).toContain("subscriptionEndDate");
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
					currencyCode: "GLD",
					category: "COMMODITIES",
					issuerPrice: 50000,
					totalSupply: 10000,
					decimalPlaces: 2,
					lpAskPrice: 51000,
					lpBidPrice: 49000,
					subscriptionStartDate: "2026-05-01",
					subscriptionEndDate: "2027-05-01",
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
					currencyCode: "INC",
					category: "STOCKS",
					// issuerPrice missing
					totalSupply: 100,
					decimalPlaces: 0,
					lpAskPrice: 100,
					lpBidPrice: 90,
					subscriptionStartDate: "2026-06-01",
					subscriptionEndDate: "2027-06-01",
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
					currencyCode: "BAD",
					category: "INVALID",
					issuerPrice: 100,
					totalSupply: 100,
					decimalPlaces: 0,
					lpAskPrice: 110,
					lpBidPrice: 90,
					subscriptionStartDate: "2026-06-01",
					subscriptionEndDate: "2027-06-01",
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
					currencyCode: "AAA",
					category: "STOCKS",
					issuerPrice: 1000,
					totalSupply: 50000,
					decimalPlaces: 0,
					lpAskPrice: 1050,
					lpBidPrice: 950,
					subscriptionStartDate: "2026-06-01",
					subscriptionEndDate: "2027-06-01",
					lpClientId: 1,
				},
				{
					name: "Asset B",
					symbol: "BBB",
					currencyCode: "BBB",
					category: "REAL_ESTATE",
					issuerPrice: 25000,
					totalSupply: 1000,
					decimalPlaces: 2,
					lpAskPrice: 25500,
					lpBidPrice: 24500,
					subscriptionStartDate: "2026-07-01",
					subscriptionEndDate: "2027-07-01",
					lpClientId: 1,
				},
			]);

			const result = await parseAssetExcel(file);
			expect(result.rows).toHaveLength(2);
			expect(result.rows[0].symbol).toBe("AAA");
			expect(result.rows[1].symbol).toBe("BBB");
		});

		it("handles date values as Date objects", async () => {
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Sheet1");

			const headers = [
				"name *",
				"symbol *",
				"currencyCode *",
				"category *",
				"issuerPrice *",
				"totalSupply *",
				"decimalPlaces *",
				"lpAskPrice *",
				"lpBidPrice *",
				"subscriptionStartDate *",
				"subscriptionEndDate *",
				"lpClientId *",
			];
			sheet.addRow(headers);

			// Add row with Date objects
			sheet.addRow([
				"Date Test",
				"DTE",
				"DTE",
				"STOCKS",
				1000,
				5000,
				0,
				1100,
				900,
				new Date("2026-06-01"),
				new Date("2027-06-01"),
				1,
			]);

			const buf = await workbook.xlsx.writeBuffer();
			const uint8 = new Uint8Array(buf);
			const arrayBuffer = uint8.buffer.slice(
				uint8.byteOffset,
				uint8.byteOffset + uint8.byteLength,
			);

			const result = await parseAssetExcel(arrayBuffer);
			expect(result.rows).toHaveLength(1);
			expect(result.rows[0].subscriptionStartDate).toMatch(
				/^\d{4}-\d{2}-\d{2}$/,
			);
			expect(result.rows[0].subscriptionEndDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});

		it("skips completely empty rows", async () => {
			const file = await createTestWorkbook([
				{
					name: "Real Asset",
					symbol: "REA",
					currencyCode: "REA",
					category: "AGRICULTURE",
					issuerPrice: 2000,
					totalSupply: 8000,
					decimalPlaces: 0,
					lpAskPrice: 2100,
					lpBidPrice: 1900,
					subscriptionStartDate: "2026-06-01",
					subscriptionEndDate: "2027-06-01",
					lpClientId: 1,
				},
				{}, // empty row
			]);

			const result = await parseAssetExcel(file);
			expect(result.rows).toHaveLength(1);
		});

		it("parses optional tradingFeePercent", async () => {
			const file = await createTestWorkbook([
				{
					name: "Fee Asset",
					symbol: "FEE",
					currencyCode: "FEE",
					category: "STOCKS",
					issuerPrice: 500,
					totalSupply: 20000,
					decimalPlaces: 2,
					lpAskPrice: 520,
					lpBidPrice: 480,
					subscriptionStartDate: "2026-06-01",
					subscriptionEndDate: "2027-06-01",
					lpClientId: 1,
					tradingFeePercent: 0.01,
				},
			]);

			const result = await parseAssetExcel(file);
			expect(result.rows).toHaveLength(1);
			expect(result.rows[0].tradingFeePercent).toBe(0.01);
		});
	});
});
