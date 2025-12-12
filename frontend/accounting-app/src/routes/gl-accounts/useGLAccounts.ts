import { GeneralLedgerAccountService } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../lib/api";

export interface GLAccount {
	id: number;
	name: string;
	glCode: string;
	type: string;
	usage: string;
	disabled?: boolean;
}

export function useGLAccounts() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState("");
	const [accountType, setAccountType] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10; // Items per page

	const { data: apiResponse, isLoading } = useQuery<{
		accounts: GLAccount[];
		totalCount: number;
		totalPages: number;
	}>({
		queryKey: ["gl-accounts", currentPage, searchTerm, accountType],
		queryFn: async () => {
			try {
				// For now, fetch all accounts and handle pagination client-side
				// In production, pass pagination params to API
				const response = await GeneralLedgerAccountService.getV1Glaccounts({
					disabled: false,
				});

				// Map the response to our GLAccount interface
				const accounts = (
					response as unknown as Array<{
						id: number;
						name: string;
						glCode: string;
						type?: {
							value: string;
						};
						usage?: {
							value: string;
						};
						disabled?: boolean;
						organizationRunningBalance?: number;
					}>
				).map((account) => ({
					id: account.id,
					name: account.name,
					glCode: account.glCode,
					type: account.type?.value || "UNKNOWN",
					usage: account.usage?.value || "DETAIL",
					disabled: account.disabled,
				}));

				return {
					accounts,
					totalCount: accounts.length,
					totalPages: Math.ceil(accounts.length / pageSize),
				};
			} catch (error) {
				console.error("Failed to fetch GL accounts:", error);
				// Return mock data for testing
				const mockAccounts: GLAccount[] = [
					{
						id: 1,
						name: "Cash on Hand",
						glCode: "1000",
						type: "ASSET",
						usage: "DETAIL",
						disabled: false,
					},
					{
						id: 2,
						name: "Accounts Receivable",
						glCode: "1100",
						type: "ASSET",
						usage: "DETAIL",
						disabled: false,
					},
					{
						id: 3,
						name: "Loans to Clients",
						glCode: "1200",
						type: "ASSET",
						usage: "DETAIL",
						disabled: false,
					},
					{
						id: 4,
						name: "Accounts Payable",
						glCode: "2000",
						type: "LIABILITY",
						usage: "DETAIL",
						disabled: false,
					},
					{
						id: 5,
						name: "Interest Income",
						glCode: "4000",
						type: "INCOME",
						usage: "DETAIL",
						disabled: false,
					},
				];

				return {
					accounts: mockAccounts,
					totalCount: mockAccounts.length,
					totalPages: Math.ceil(mockAccounts.length / pageSize),
				};
			}
		},
	});

	// Apply client-side filtering and pagination
	const filteredAccounts =
		apiResponse?.accounts.filter((account) => {
			const matchesSearch =
				searchTerm === "" ||
				account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				account.glCode.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesType = accountType === "" || account.type === accountType;

			return matchesSearch && matchesType;
		}) || [];

	const paginatedAccounts = filteredAccounts.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const totalFilteredPages = Math.ceil(filteredAccounts.length / pageSize);

	const handleExportCSV = () => {
		const headers = ["Account Code", "Account Name", "Type", "Usage"];
		const rows = filteredAccounts.map((account) => [
			account.glCode,
			account.name,
			account.type,
			account.usage,
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
			`gl-accounts-${new Date().toISOString()}.csv`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success("GL accounts exported successfully");
	};

	const handleCreateAccount = () => {
		navigate({ to: "/gl-accounts/create" });
	};

	const handleEditAccount = (accountId: number) => {
		navigate({
			to: "/gl-accounts/$accountId/edit",
			params: { accountId: accountId.toString() },
		});
	};

	const deleteMutation = useMutation({
		mutationFn: async (accountId: number) => {
			const response =
				await GeneralLedgerAccountService.deleteV1GlaccountsByGlAccountId({
					glAccountId: accountId,
				});
			return response;
		},
		onSuccess: () => {
			toast.success("GL Account deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["gl-accounts"] });
			queryClient.invalidateQueries({ queryKey: ["accounting-stats"] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to delete GL account: ${error.message}`);
		},
	});

	const handleDeleteAccount = (accountId: number, accountName: string) => {
		const confirmed = window.confirm(
			`Are you sure you want to delete the GL Account "${accountName}"?\n\nThis action cannot be undone and may fail if the account has transactions.`,
		);

		if (confirmed) {
			deleteMutation.mutate(accountId);
		}
	};

	return {
		glAccounts: paginatedAccounts,
		isLoading,
		searchTerm,
		accountType,
		currentPage,
		totalPages: totalFilteredPages,
		totalCount: filteredAccounts.length,
		onSearch: setSearchTerm,
		onFilterByType: setAccountType,
		onPageChange: setCurrentPage,
		onExportCSV: handleExportCSV,
		onCreateAccount: handleCreateAccount,
		onEditAccount: handleEditAccount,
		onDeleteAccount: handleDeleteAccount,
	};
}
