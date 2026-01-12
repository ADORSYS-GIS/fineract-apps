import { Button, Pagination } from "@fineract-apps/ui";
import { Download, Edit, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DataTable, FiltersBar, PageHeader } from "../../components";
import type { GLAccount } from "./useGLAccounts";

interface GLAccountsViewProps {
	glAccounts: GLAccount[];
	isLoading: boolean;
	searchTerm: string;
	accountType: string;
	currentPage: number;
	totalPages: number;
	totalCount: number;
	canCreateAccount: boolean;
	canEditAccount: boolean;
	canDeleteAccount: boolean;
	onSearch: (term: string) => void;
	onFilterByType: (type: string) => void;
	onPageChange: (page: number) => void;
	onExportCSV: () => void;
	onCreateAccount: () => void;
	onEditAccount: (accountId: number) => void;
	onDeleteAccount: (accountId: number, accountName: string) => void;
}

export function GLAccountsView({
	glAccounts,
	isLoading,
	searchTerm,
	accountType,
	currentPage,
	totalPages,
	canCreateAccount,
	canEditAccount,
	canDeleteAccount,
	onSearch,
	onFilterByType,
	onPageChange,
	onExportCSV,
	onCreateAccount,
	onEditAccount,
	onDeleteAccount,
}: GLAccountsViewProps) {
	const { t } = useTranslation();
	const actions = [
		...(canCreateAccount
			? [
					{
						label: t("createAccount"),
						onClick: onCreateAccount,
						icon: <Plus className="h-4 w-4" />,
					},
				]
			: []),
		{
			label: t("exportCSV"),
			onClick: onExportCSV,
			variant: "outline" as const,
			icon: <Download className="h-4 w-4" />,
		},
	];

	const columns = [
		{ key: "glCode", header: t("accountCode") },
		{ key: "name", header: t("accountName") },
		{
			key: "type",
			header: t("type"),
			render: (value: unknown) => (
				<span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
					{String(value)}
				</span>
			),
		},
		{
			key: "usage",
			header: t("usage"),
			render: (value: unknown) => (
				<span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
					{String(value)}
				</span>
			),
		},
		{
			key: "actions",
			header: t("actions"),
			className: "text-right",
			render: (_: unknown, account: GLAccount) => (
				<div className="flex items-center justify-end gap-2">
					{canEditAccount && (
						<Button
							onClick={() => onEditAccount(account.id)}
							variant="outline"
							className="flex items-center gap-1"
						>
							<Edit className="h-3 w-3" />
							{t("edit")}
						</Button>
					)}
					{canDeleteAccount && (
						<Button
							onClick={() => onDeleteAccount(account.id, account.name)}
							variant="outline"
							className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
						>
							<Trash2 className="h-3 w-3" />
							{t("delete")}
						</Button>
					)}
					{!canEditAccount && !canDeleteAccount && (
						<span className="text-gray-400 text-xs">{t("viewOnly")}</span>
					)}
				</div>
			),
		},
	];

	return (
		<div className="p-6 min-h-screen">
			<PageHeader title={t("generalLedgerAccounts")} actions={actions} />

			<FiltersBar
				filters={[
					{
						key: "search",
						type: "text",
						value: searchTerm,
						onChange: onSearch,
						placeholder: t("searchByAccountNameOrCode"),
					},
					{
						key: "accountType",
						label: t("accountType"),
						type: "select",
						value: accountType,
						onChange: onFilterByType,
						options: [
							{ value: "", label: t("allAccountTypes") },
							{ value: "ASSET", label: t("asset") },
							{ value: "LIABILITY", label: t("liability") },
							{ value: "EQUITY", label: t("equity") },
							{ value: "INCOME", label: t("income") },
							{ value: "EXPENSE", label: t("expense") },
						],
					},
				]}
			/>

			<DataTable
				data={glAccounts}
				columns={columns}
				isLoading={isLoading}
				emptyMessage={t("noGLAccountsFound")}
			/>

			{totalPages > 1 && (
				<div className="mt-6 flex justify-center">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={onPageChange}
					/>
				</div>
			)}
		</div>
	);
}
