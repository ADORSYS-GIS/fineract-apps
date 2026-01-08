import { AuditsService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
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
			};

			// Add filters if provided
			if (filters.fromDate) {
				params.makerDateTimeFrom = `${filters.fromDate} 00:00:00`;
			}
			if (filters.toDate) {
				params.makerDateTimeTo = `${filters.toDate} 23:59:59`;
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

	const handleExport = () => {
		toast.success("Exporting audit trail...");
		// TODO: Implement export functionality
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
		onExport: handleExport,
	};
}
