import { AuditsService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ColumnHeader } from "@/pages/reports/report-viewer/ReportViewer.types";
import { exportToCSV, exportToExcel } from "@/utils/exportHelpers";
import type {
	Transaction,
	TransactionFilters,
	TransactionHistoryData,
} from "./TransactionHistory.types";

const ITEMS_PER_PAGE = 20;

const getActionName = (transactionType: string) => {
	switch (transactionType.toLowerCase()) {
		case "deposit":
			return "DEPOSIT";
		case "withdrawal":
			return "WITHDRAWAL";
		case "transfer":
			return "TRANSFER";
		default:
			return "";
	}
};

export function useTransactionHistory(): TransactionHistoryData {
	const [currentPage, setCurrentPage] = useState(1);
	const [filters, setFilters] = useState<TransactionFilters>({
		fromDate: "",
		toDate: "",
		transactionType: "",
	});

	// Fetch transactions from audits API
	const { data: auditsData, isLoading } = useQuery({
		queryKey: ["transactions", currentPage, filters],
		queryFn: async () => {
			const params: Record<string, unknown> = {
				paged: true,
				offset: (currentPage - 1) * ITEMS_PER_PAGE,
				limit: ITEMS_PER_PAGE,
				orderBy: "id",
				sortOrder: "DESC",
				entityName: "SAVINGSACCOUNT", // Focus on savings transactions
				dateFormat: "dd MMMM yyyy",
				locale: "en",
			};

			// Add filters if provided
			if (filters.fromDate) {
				params.fromDate = `${filters.fromDate}T00:00:00.000Z`;
			}
			if (filters.toDate) {
				params.toDate = `${filters.toDate}T23:59:59.999Z`;
			}
			if (filters.transactionType) {
				params.actionName = getActionName(filters.transactionType);
			}

			const response = await AuditsService.getV1Audits(params);
			return response as unknown as {
				pageItems: Transaction[];
				totalFilteredRecords: number;
			};
		},
	});

	const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setCurrentPage(1); // Reset to first page when filters change
	};

	const handleExportCSV = () => {
		if (!transactions || transactions.length === 0) {
			toast.error("No data to export");
			return;
		}

		try {
			const headers = [
				{
					columnName: "ID",
					columnDisplayType: "INTEGER" as const,
					columnType: "Integer",
				},
				{
					columnName: "Action",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
				{
					columnName: "Entity",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
				{
					columnName: "Made By",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
				{
					columnName: "Date",
					columnDisplayType: "DATE" as const,
					columnType: "Date",
				},
				{
					columnName: "Status",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
			];
			const data = transactions.map((transaction) => ({
				row: [
					transaction.id,
					transaction.actionName,
					transaction.entityName,
					transaction.maker,
					transaction.madeOnDate,
					transaction.processingResult,
				],
			}));
			exportToCSV(
				headers as ColumnHeader[],
				data,
				`transaction_history_${new Date().toISOString().split("T")[0]}.csv`,
			);
			toast.success("Transaction history exported to CSV");
		} catch (error) {
			toast.error("Failed to export CSV");
			console.error("CSV export error:", error);
		}
	};

	const handleExportExcel = () => {
		if (!transactions || transactions.length === 0) {
			toast.error("No data to export");
			return;
		}

		try {
			const headers = [
				{
					columnName: "ID",
					columnDisplayType: "INTEGER" as const,
					columnType: "Integer",
				},
				{
					columnName: "Action",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
				{
					columnName: "Entity",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
				{
					columnName: "Made By",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
				{
					columnName: "Date",
					columnDisplayType: "DATE" as const,
					columnType: "Date",
				},
				{
					columnName: "Status",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
			];
			const data = transactions.map((transaction) => ({
				row: [
					transaction.id,
					transaction.actionName,
					transaction.entityName,
					transaction.maker,
					transaction.madeOnDate,
					transaction.processingResult,
				],
			}));
			exportToExcel(
				headers as ColumnHeader[],
				data,
				`transaction_history_${new Date().toISOString().split("T")[0]}.xlsx`,
			);
			toast.success("Transaction history exported to Excel");
		} catch (error) {
			toast.error("Failed to export Excel");
			console.error("Excel export error:", error);
		}
	};

	const transactions = auditsData?.pageItems || [];
	const totalItems = auditsData?.totalFilteredRecords || 0;
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

	return {
		transactions,
		isLoading,
		pagination: {
			currentPage,
			totalPages,
			totalItems,
		},
		filters,
		onFilterChange: handleFilterChange,
		onPageChange: setCurrentPage,
		onExportCSV: handleExportCSV,
		onExportExcel: handleExportExcel,
	};
}
