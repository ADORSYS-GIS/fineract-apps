import { Button, Card } from "@fineract-apps/ui";
import { Download, Plus, Search } from "lucide-react";
import type { GLAccount } from "./useGLAccounts";

interface GLAccountsViewProps {
	glAccounts: GLAccount[];
	isLoading: boolean;
	searchTerm: string;
	accountType: string;
	onSearch: (term: string) => void;
	onFilterByType: (type: string) => void;
	onExportCSV: () => void;
	onCreateAccount: () => void;
}

export function GLAccountsView({
	glAccounts,
	isLoading,
	searchTerm,
	accountType,
	onSearch,
	onFilterByType,
	onExportCSV,
	onCreateAccount,
}: GLAccountsViewProps) {
	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">General Ledger Accounts</h1>
				<div className="flex gap-2">
					<Button onClick={onCreateAccount} className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						Create Account
					</Button>
					<Button onClick={onExportCSV} variant="outline" className="flex items-center gap-2">
						<Download className="h-4 w-4" />
						Export CSV
					</Button>
				</div>
			</div>

			<Card className="p-6 mb-6">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="text"
							placeholder="Search by account name or code..."
							value={searchTerm}
							onChange={(e) => onSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<select
						value={accountType}
						onChange={(e) => onFilterByType(e.target.value)}
						className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">All Account Types</option>
						<option value="ASSET">Asset</option>
						<option value="LIABILITY">Liability</option>
						<option value="EQUITY">Equity</option>
						<option value="INCOME">Income</option>
						<option value="EXPENSE">Expense</option>
					</select>
				</div>
			</Card>

			{isLoading ? (
				<Card className="p-6">
					<div className="animate-pulse space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-12 bg-gray-200 rounded" />
						))}
					</div>
				</Card>
			) : glAccounts.length === 0 ? (
				<Card className="p-6 text-center text-gray-500">
					<p>No GL accounts found matching your criteria.</p>
				</Card>
			) : (
				<Card className="overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Account Code
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Account Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Usage
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Balance
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{glAccounts.map((account) => (
									<tr key={account.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{account.glCode}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{account.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
												{account.type}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
												{account.usage}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
											${account.balance?.toLocaleString() || "0.00"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			)}
		</div>
	);
}
