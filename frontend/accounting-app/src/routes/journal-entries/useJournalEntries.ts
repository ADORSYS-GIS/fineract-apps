import {
	BusinessDateManagementService,
	JournalEntriesService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../lib/api";

export interface JournalEntry {
	id: number;
	transactionId: string;
	transactionDate: string;
	officeName: string;
	referenceNumber?: string;
	amount: number;
	comments?: string;
}

export interface DateRange {
	from: Date;
	to: Date;
}

export function useJournalEntries() {
	const today = new Date();
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
	const [offset, setOffset] = useState(0);
	const [totalRecords, setTotalRecords] = useState(0);

	const [dateRange, setDateRange] = useState<DateRange>({
		from: thirtyDaysAgo,
		to: today,
	});
	const [transactionType, setTransactionType] = useState("");

	const { data: journalEntries = [], isLoading } = useQuery<JournalEntry[]>({
		queryKey: ["journal-entries", dateRange, offset],
		queryFn: async () => {
			await BusinessDateManagementService.postV1Businessdate({
				requestBody: {
					date: dateRange.from.toISOString().split("T")[0],
					dateFormat: "yyyy-MM-dd",
					locale: "en",
					type: "BUSINESS_DATE",
				},
			});
			await BusinessDateManagementService.postV1Businessdate({
				requestBody: {
					date: dateRange.to.toISOString().split("T")[0],
					dateFormat: "yyyy-MM-dd",
					locale: "en",
					type: "BUSINESS_DATE",
				},
			});

			const response = await JournalEntriesService.getV1Journalentries({
				// @ts-ignore
				fromDate: dateRange.from.toISOString().split("T")[0],
				// @ts-ignore
				toDate: dateRange.to.toISOString().split("T")[0],
				locale: "en",
				dateFormat: "yyyy-MM-dd",
				limit: 10,
				offset,
			});
			// Map the response to our JournalEntry interface
			const entries = response as unknown as {
				totalFilteredRecords?: number;
				pageItems?: Array<{
					id: number;
					transactionId: string;
					transactionDate?: number[];
					officeName: string;
					referenceNumber?: string;
					amount?: number;
					comments?: string;
				}>;
			};
			setTotalRecords(entries.totalFilteredRecords || 0);

			const items = entries.pageItems || [];

			return items.map((entry) => {
				// Convert date array [year, month, day] to ISO string
				const date = entry.transactionDate
					? new Date(
							entry.transactionDate[0],
							entry.transactionDate[1] - 1,
							entry.transactionDate[2],
						).toISOString()
					: new Date().toISOString();

				return {
					id: entry.id,
					transactionId: entry.transactionId,
					transactionDate: date,
					officeName: entry.officeName,
					referenceNumber: entry.referenceNumber,
					amount: entry.amount || 0,
					comments: entry.comments,
				};
			});
		},
	});

	const filteredEntries = journalEntries.filter((entry) => {
		if (transactionType === "") return true;
		// Filter logic would go here based on entry type
		return true;
	});

	const handleExportCSV = () => {
		const headers = [
			"Transaction ID",
			"Date",
			"Office",
			"Reference Number",
			"Amount",
		];
		const rows = filteredEntries.map((entry) => [
			entry.transactionId,
			new Date(entry.transactionDate).toLocaleDateString(),
			entry.officeName,
			entry.referenceNumber || "-",
			entry.amount.toString(),
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) =>
				row
					.map((cell) => {
						const cellStr = String(cell);
						if (cellStr.includes(",") || cellStr.includes('"')) {
							return `"${cellStr.replace(/"/g, '""')}"`;
						}
						return cellStr;
					})
					.join(","),
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`journal-entries-${new Date().toISOString()}.csv`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success("Journal entries exported successfully");
	};

	const handleViewDetails = (entryId: number) => {
		toast.success(`Viewing details for entry ${entryId}`);
		console.log("View details for entry:", entryId);
	};

	const handlePageChange = (page: number) => {
		setOffset((page - 1) * 10);
	};

	return {
		journalEntries: filteredEntries,
		isLoading,
		dateRange,
		transactionType,
		onDateRangeChange: setDateRange,
		onFilterByType: setTransactionType,
		onExportCSV: handleExportCSV,
		onViewDetails: handleViewDetails,
		onPageChange: handlePageChange,
		currentPage: offset / 10 + 1,
		totalPages: Math.ceil(totalRecords / 10),
	};
}
