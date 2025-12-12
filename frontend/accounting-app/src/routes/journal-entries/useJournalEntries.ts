import {
	GeneralLedgerAccountService,
	type GetGLAccountsResponse,
	type GetOfficesResponse,
	type GetV1JournalentriesResponse,
	JournalEntriesService,
	type JournalEntryTransactionItem,
	OfficesService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../lib/api";
import { format } from "date-fns";

export type JournalEntry = JournalEntryTransactionItem & { id: number };

export interface Filters {
	officeId: string;
	glAccountId: string;
	fromDate: string;
	toDate: string;
}

export function useJournalEntries() {
	const today = new Date();
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(today.getDate() - 30);

	const [filters, setFilters] = useState<Filters>({
		officeId: "",
		glAccountId: "",
		fromDate: format(thirtyDaysAgo, "yyyy-MM-dd"),
		toDate: format(today, "yyyy-MM-dd"),
	});

	const { data: journalEntries = [], isLoading } = useQuery<JournalEntry[]>({
		queryKey: ["journal-entries", filters],
		queryFn: async () => {
			const response = (await JournalEntriesService.getV1Journalentries({
				officeId: Number(filters.officeId) || undefined,
				glAccountId: Number(filters.glAccountId) || undefined,
				fromDate: filters.fromDate,
				toDate: filters.toDate,
				dateFormat: "yyyy-MM-dd",
				locale: "en",
			} as unknown as Parameters<
				typeof JournalEntriesService.getV1Journalentries
			>[0])) as GetV1JournalentriesResponse;
			return (response.pageItems || []).filter(
				(item): item is JournalEntry => typeof item.id === "number",
			);
		},
	});

	const { data: offices = [], isLoading: isLoadingOffices } = useQuery<
		GetOfficesResponse[]
	>({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices({}),
	});

	const { data: glAccounts = [], isLoading: isLoadingGLAccounts } = useQuery<
		GetGLAccountsResponse[]
	>({
		queryKey: ["gl-accounts"],
		queryFn: () => GeneralLedgerAccountService.getV1Glaccounts({}),
	});

	const handleFilterChange = (filterName: keyof Filters, value: string) => {
		setFilters((prev) => ({ ...prev, [filterName]: value }));
	};

	const handleExportCSV = () => {
		const headers = [
			"Transaction ID",
			"Date",
			"Office",
			"Created By",
			"Amount",
		];
		const rows = journalEntries.map((entry) => [
			entry.transactionId,
			entry.transactionDate
				? format(new Date(entry.transactionDate as string), "dd MMM yyyy")
				: "",
			entry.officeName,
			entry.createdByUserName || "-",
			entry.amount?.toString() || "0",
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) =>
				row
					.map((cell) => {
						const cellStr = String(cell);
						return cellStr.includes(",") ? `"${cellStr}"` : cellStr;
					})
					.join(","),
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `journal-entries-${new Date().toISOString()}.csv`;
		link.click();
		toast.success("Journal entries exported successfully");
	};

	return {
		journalEntries,
		offices,
		glAccounts,
		filters,
		isLoading: isLoading || isLoadingOffices || isLoadingGLAccounts,
		onFilterChange: handleFilterChange,
		onExportCSV: handleExportCSV,
	};
}
