import { Card } from "@fineract-apps/ui";
import { Building2 } from "lucide-react";
import { FC } from "react";
import type { AssetFormData } from "../useCreateAsset";

interface Props {
	formData: AssetFormData;
	updateFormData: (updates: Partial<AssetFormData>) => void;
	clients: Array<{
		id?: number;
		displayName?: string;
		accountNo?: string;
		officeName?: string;
	}>;
	isLoadingClients: boolean;
	clientAccounts: Array<{
		id?: number;
		accountNo?: string;
		productName?: string;
		currency?: { code?: string };
		status?: { active?: boolean };
	}>;
	isLoadingAccounts: boolean;
}

export const SelectCompanyStep: FC<Props> = ({
	formData,
	updateFormData,
	clients,
	isLoadingClients,
	clientAccounts,
	isLoadingAccounts,
}) => {
	const xafAccounts = clientAccounts.filter(
		(a) => a.currency?.code === "XAF" && a.status?.active,
	);

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold text-gray-800 mb-1">
					Select Treasury Company
				</h2>
				<p className="text-sm text-gray-500">
					Choose the company that will act as the treasury (market maker) for
					this asset.
				</p>
			</div>

			{/* Company Selection */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Company
				</label>
				{isLoadingClients ? (
					<div className="animate-pulse h-10 bg-gray-200 rounded" />
				) : (
					<select
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={formData.treasuryClientId ?? ""}
						onChange={(e) => {
							const clientId = Number(e.target.value);
							const client = clients.find((c) => c.id === clientId);
							updateFormData({
								treasuryClientId: clientId || null,
								treasuryClientName: client?.displayName ?? "",
								treasuryCashAccountId: null,
							});
						}}
					>
						<option value="">Select a company...</option>
						{clients.map((client) => (
							<option key={client.id} value={client.id}>
								{client.displayName} ({client.accountNo}) - {client.officeName}
							</option>
						))}
					</select>
				)}
			</div>

			{/* Selected Company Info */}
			{formData.treasuryClientId && (
				<Card className="p-4 bg-blue-50 border-blue-200">
					<div className="flex items-center gap-3">
						<Building2 className="h-8 w-8 text-blue-600" />
						<div>
							<p className="font-medium text-gray-900">
								{formData.treasuryClientName}
							</p>
							<p className="text-sm text-gray-500">
								Client ID: {formData.treasuryClientId}
							</p>
						</div>
					</div>
				</Card>
			)}

			{/* XAF Cash Account Selection */}
			{formData.treasuryClientId && (
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						XAF Cash Account (for trading settlements)
					</label>
					{isLoadingAccounts ? (
						<div className="animate-pulse h-10 bg-gray-200 rounded" />
					) : xafAccounts.length === 0 ? (
						<p className="text-sm text-red-600">
							No active XAF savings accounts found for this company.
						</p>
					) : (
						<select
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={formData.treasuryCashAccountId ?? ""}
							onChange={(e) =>
								updateFormData({
									treasuryCashAccountId: Number(e.target.value) || null,
								})
							}
						>
							<option value="">Select an account...</option>
							{xafAccounts.map((acc) => (
								<option key={acc.id} value={acc.id}>
									{acc.accountNo} - {acc.productName}
								</option>
							))}
						</select>
					)}
				</div>
			)}
		</div>
	);
};
