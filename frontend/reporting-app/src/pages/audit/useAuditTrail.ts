import { AuditsService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ColumnHeader } from "@/pages/reports/report-viewer/ReportViewer.types";
import { exportToCSV, exportToExcel } from "@/utils/exportHelpers";
import type {
	AuditEntry,
	AuditFilters,
	AuditTrailData,
} from "./AuditTrail.types";

const ITEMS_PER_PAGE = 20;

export function useAuditTrail(): AuditTrailData {
	const [currentPage, setCurrentPage] = useState(1);
	const [filters, setFilters] = useState<AuditFilters>({
		fromDate: "",
		toDate: "",
		actionName: "",
		entityName: "",
	});

	// Fetch audits from API
	const { data: auditsData, isLoading } = useQuery({
		queryKey: ["audits", currentPage, filters],
		queryFn: async () => {
			const params: Record<string, unknown> = {
				paged: true,
				offset: (currentPage - 1) * ITEMS_PER_PAGE,
				limit: ITEMS_PER_PAGE,
				orderBy: "id",
				sortOrder: "DESC",
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
			if (filters.actionName) {
				params.actionName = filters.actionName;
			}
			if (filters.entityName) {
				params.entityName = filters.entityName;
			}

			const response = await AuditsService.getV1Audits(params);
			return response as unknown as {
				pageItems: AuditEntry[];
				totalFilteredRecords: number;
			};
		},
	});

	const handleFilterChange = (key: keyof AuditFilters, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setCurrentPage(1); // Reset to first page when filters change
	};

	const handleExportCSV = () => {
		if (!audits || audits.length === 0) {
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
					columnName: "Made On",
					columnDisplayType: "DATE" as const,
					columnType: "Date",
				},
				{
					columnName: "Status",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
			];
			const data = audits.map((audit) => ({
				row: [
					audit.id,
					audit.actionName,
					audit.entityName,
					audit.maker,
					audit.madeOnDate,
					audit.processingResult,
				],
			}));
			exportToCSV(
				headers as ColumnHeader[],
				data,
				`audit_trail_${new Date().toISOString().split("T")[0]}.csv`,
			);
			toast.success("Audit trail exported to CSV");
		} catch (error) {
			toast.error("Failed to export CSV");
			console.error("CSV export error:", error);
		}
	};

	const handleExportExcel = () => {
		if (!audits || audits.length === 0) {
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
					columnName: "Made On",
					columnDisplayType: "DATE" as const,
					columnType: "Date",
				},
				{
					columnName: "Status",
					columnDisplayType: "TEXT" as const,
					columnType: "String",
				},
			];
			const data = audits.map((audit) => ({
				row: [
					audit.id,
					audit.actionName,
					audit.entityName,
					audit.maker,
					audit.madeOnDate,
					audit.processingResult,
				],
			}));
			exportToExcel(
				headers as ColumnHeader[],
				data,
				`audit_trail_${new Date().toISOString().split("T")[0]}.xlsx`,
			);
			toast.success("Audit trail exported to Excel");
		} catch (error) {
			toast.error("Failed to export Excel");
			console.error("Excel export error:", error);
		}
	};

	const audits = auditsData?.pageItems || [];
	const totalItems = auditsData?.totalFilteredRecords || 0;
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

	return {
		audits,
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
