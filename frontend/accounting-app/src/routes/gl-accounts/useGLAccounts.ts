import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../lib/api";

export interface GLAccount {
	id: number;
	name: string;
	glCode: string;
	type: string;
	usage: string;
	balance?: number;
	disabled?: boolean;
}

export function useGLAccounts() {
	const [searchTerm, setSearchTerm] = useState("");
	const [accountType, setAccountType] = useState("");

	const { data: glAccounts = [], isLoading } = useQuery<GLAccount[]>({
		queryKey: ["gl-accounts"],
		queryFn: async () => {
			// Placeholder - in production, fetch from Fineract API
			// const response = await GLAccountsService.getV1Glaccounts();
			// return response as unknown as GLAccount[];

			// Mock data for development
			return [];
		},
	});

	const filteredAccounts = glAccounts.filter((account) => {
		const matchesSearch =
			searchTerm === "" ||
			account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			account.glCode.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesType = accountType === "" || account.type === accountType;

		return matchesSearch && matchesType;
	});

	const handleExportCSV = () => {
		const headers = ["Account Code", "Account Name", "Type", "Usage", "Balance"];
		const rows = filteredAccounts.map((account) => [
			account.glCode,
			account.name,
			account.type,
			account.usage,
			account.balance?.toString() || "0",
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
		link.setAttribute("download", `gl-accounts-${new Date().toISOString()}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success("GL accounts exported successfully");
	};

	return {
		glAccounts: filteredAccounts,
		isLoading,
		searchTerm,
		accountType,
		onSearch: setSearchTerm,
		onFilterByType: setAccountType,
		onExportCSV: handleExportCSV,
	};
}
