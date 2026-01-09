import {
	type GetGLAccountsResponse,
	type GetOfficesResponse,
} from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Download, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/hooks/useCurrency";
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
	const { t } = useTranslation();
	const { currencyCode } = useCurrency();
	const actions = [
		{
			label: t("exportCSV"),
			onClick: onExportCSV,
			icon: <Download className="h-4 w-4" />,
		},
	];

	const columns = [
		{ key: "transactionId", header: t("transactionId") },
		{
			key: "transactionDate",
			header: t("date"),
			render: (value: unknown) =>
				value ? format(new Date(value as string), "dd MMM yyyy") : "-",
		},
		{ key: "officeName", header: t("office") },
		{
			key: "createdByUserName",
			header: t("createdBy"),
			render: (value: unknown) => String(value || "-"),
		},
		{
			key: "amount",
			header: t("amount"),
			className: "text-right",
			render: (value: unknown) =>
				`${currencyCode} ${Number(value).toLocaleString()}`,
		},
		{
			key: "actions",
			header: t("actions"),
			className: "text-center",
			render: (_: unknown, entry: JournalEntry) => (
				<Link
					to="/journal-entries/$entryId"
					params={{ entryId: String(entry.id) }}
				>
					<Button
						variant="ghost"
						size="sm"
						className="inline-flex items-center gap-1"
					>
						<Eye className="h-4 w-4" />
						{t("view")}
					</Button>
				</Link>
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
		<div className="p-4 sm:p-6">
			<PageHeader title={t("journalEntries")} actions={actions} />
			<div className="bg-white rounded-lg shadow p-6 my-6">
				<FiltersBar
					filters={[
						{
							key: "fromDate",
							label: t("fromDate"),
							type: "date",
							value: filters.fromDate,
							onChange: (value) => onFilterChange("fromDate", value),
						},
						{
							key: "toDate",
							label: t("toDate"),
							type: "date",
							value: filters.toDate,
							onChange: (value) => onFilterChange("toDate", value),
						},
						{
							key: "officeId",
							label: t("office"),
							type: "select",
							value: filters.officeId,
							onChange: (value) => onFilterChange("officeId", value),
							options: [
								{ value: "", label: t("allOffices") },
								...officeOptions,
							],
						},
						{
							key: "glAccountId",
							label: t("glAccount"),
							type: "select",
							value: filters.glAccountId,
							onChange: (value) => onFilterChange("glAccountId", value),
							options: [
								{ value: "", label: t("allGLAccounts") },
								...glAccountOptions,
							],
						},
					]}
				/>
			</div>
			<div className="bg-white rounded-lg shadow p-6">
				<DataTable
					data={journalEntries}
					columns={columns}
					isLoading={isLoading}
					emptyMessage={t("noJournalEntriesFound")}
				/>
			</div>
		</div>
	);
}
