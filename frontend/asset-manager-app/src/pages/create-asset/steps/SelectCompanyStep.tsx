import { Card } from "@fineract-apps/ui";
import { Building2, PlusCircle } from "lucide-react";
import { FC } from "react";
import { CreateLPDialog } from "@/components/CreateLPDialog";
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
	validationErrors: string[];
	isLPDialogOpen: boolean;
	onOpenCreateLP: () => void;
	onCloseCreateLP: () => void;
	onCreateLP: (fullname: string) => void;
	isCreatingLP: boolean;
}

export const SelectCompanyStep: FC<Props> = ({
	formData,
	updateFormData,
	clients,
	isLoadingClients,
	validationErrors,
	isLPDialogOpen,
	onOpenCreateLP,
	onCloseCreateLP,
	onCreateLP,
	isCreatingLP,
}) => {
	const hasError = validationErrors.some((e) =>
		e.toLowerCase().includes("liquidity partner"),
	);
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold text-gray-800 mb-1">
					Select Liquidity Partner
				</h2>
				<p className="text-sm text-gray-500">
					Choose the company that will act as the liquidity partner (market
					maker) for this asset. The company's XAF cash account will be used
					automatically for trade settlements.
				</p>
			</div>

			{/* Company Selection */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Liquidity Partner
				</label>
				<p className="text-xs text-gray-400 mb-2">
					The client that will hold the LP account for this asset
				</p>
				{isLoadingClients ? (
					<div className="animate-pulse h-10 bg-gray-200 rounded" />
				) : (
					<select
						aria-label="Select liquidity partner"
						className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${hasError ? "border-red-400 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
						value={formData.lpClientId ?? ""}
						onChange={(e) => {
							const clientId = Number(e.target.value);
							const client = clients.find((c) => c.id === clientId);
							updateFormData({
								lpClientId: clientId || null,
								lpClientName: client?.displayName ?? "",
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
				<button
					type="button"
					onClick={onOpenCreateLP}
					className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
				>
					<PlusCircle className="h-4 w-4" />
					Create new LP
				</button>
			</div>

			{/* Selected Company Info */}
			{formData.lpClientId && (
				<Card className="p-4 bg-blue-50 border-blue-200">
					<div className="flex items-center gap-3">
						<Building2 className="h-8 w-8 text-blue-600" />
						<div>
							<p className="font-medium text-gray-900">
								{formData.lpClientName}
							</p>
							<p className="text-sm text-gray-500">
								Client ID: {formData.lpClientId}
							</p>
						</div>
					</div>
				</Card>
			)}

			<CreateLPDialog
				isOpen={isLPDialogOpen}
				isCreating={isCreatingLP}
				onSubmit={onCreateLP}
				onCancel={onCloseCreateLP}
			/>
		</div>
	);
};
