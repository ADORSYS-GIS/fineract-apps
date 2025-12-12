import {
	type GetGLAccountsResponse,
	type GetOfficesResponse,
} from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { format } from "date-fns";
import { Download, Eye } from "lucide-react";
import { DataTable, FiltersBar, PageHeader } from "../../components";
import type { Filters, JournalEntry } from "./useJournalEntries";

interface JournalEntriesViewProps {
	journalEntries: JournalEntry[];
	offices: GetOfficesResponse[];
	glAccounts: GetGLAccountsResponse[];
	filters: Filters;
	isLoading: boolean;
	onFilterChange: (filterName: keyof Filters, value: string) => void;
	onExportCSV: () => void;
}

export function JournalEntriesView({
	journalEntries,
	offices,
	glAccounts,
	filters,
	isLoading,
	onFilterChange,
	onExportCSV,
}: JournalEntriesViewProps) {
	const actions = [
		{
			label: "Export CSV",
			onClick: onExportCSV,
			icon: <Download className="h-4 w-4" />,
		},
	];

	const columns = [
		{ key: "transactionId", header: "Transaction ID" },
		{
			key: "transactionDate",
			header: "Date",
			render: (value: unknown) =>
				value ? format(new Date(value as string), "dd MMM yyyy") : "-",
		},
		{ key: "officeName", header: "Office" },
		{
			key: "createdByUserName",
			header: "Created By",
			render: (value: unknown) => String(value || "-"),
		},
		{
			key: "amount",
			header: "Amount",
			className: "text-right",
			render: (value: unknown) => `$${Number(value).toLocaleString()}`,
		},
		{
			key: "actions",
			header: "Actions",
			className: "text-center",
			render: (_: unknown, entry: JournalEntry) => (
				<Button
					onClick={() => {
						/* Handle view details */
					}}
					variant="ghost"
					size="sm"
					className="inline-flex items-center gap-1"
				>
					<Eye className="h-4 w-4" />
					View
				</Button>
			),
		},
	];

	const officeOptions = offices.map((office) => ({
		value: String(office.id),
		label: office.nameDecorated || office.name || "",
	}));

	const glAccountOptions = glAccounts.map((acc) => ({
		value: String(acc.id),
		label: `${acc.name} - ${acc.glCode}`,
	}));

	return (
		<div className="p-6 min-h-screen">
			<PageHeader title="Journal Entries" actions={actions} />

			<FiltersBar
				filters={[
					{
						key: "fromDate",
						label: "From Date",
						type: "date",
						value: filters.fromDate,
						onChange: (value) => onFilterChange("fromDate", value),
					},
					{
						key: "toDate",
						label: "To Date",
						type: "date",
						value: filters.toDate,
						onChange: (value) => onFilterChange("toDate", value),
					},
					{
						key: "officeId",
						label: "Office",
						type: "select",
						value: filters.officeId,
						onChange: (value) => onFilterChange("officeId", value),
						options: [{ value: "", label: "All Offices" }, ...officeOptions],
					},
					{
						key: "glAccountId",
						label: "GL Account",
						type: "select",
						value: filters.glAccountId,
						onChange: (value) => onFilterChange("glAccountId", value),
						options: [
							{ value: "", label: "All GL Accounts" },
							...glAccountOptions,
						],
					},
				]}
			/>

			<DataTable
				data={journalEntries}
				columns={columns}
				isLoading={isLoading}
				emptyMessage="No journal entries found for the selected filters."
			/>
		</div>
	);
}
