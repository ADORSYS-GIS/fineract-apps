import { Button, Card, formatCurrency } from "@fineract-apps/ui";
import { Printer, RotateCcw, Search } from "lucide-react";
import type { useAgentProvisioning } from "./useAgentProvisioning";

type Props = ReturnType<typeof useAgentProvisioning>;

export function AgentProvisioningView(props: Props) {
	const {
		phoneSearch,
		setPhoneSearch,
		amount,
		setAmount,
		servicingOfficeId,
		setServicingOfficeId,
		agent,
		branches,
		isSearching,
		searchError,
		isSubmitting,
		showConfirmation,
		receipt,
		handleSearch,
		handleConfirm,
		handleCancel,
		handleSubmit,
		handleNewProvision,
	} = props;

	// Receipt view
	if (receipt) {
		return (
			<Card className="max-w-lg mx-auto p-6">
				<div className="text-center mb-4">
					<div className="text-green-600 text-4xl mb-2">✓</div>
					<h2 className="text-xl font-semibold">Provisionnement Réussi</h2>
				</div>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-gray-500">Référence</span>
						<span className="font-mono">{receipt.receiptRef}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-500">Montant</span>
						<span className="font-semibold">
							{formatCurrency(receipt.amount, "XAF")}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-500">Date</span>
						<span>{new Date(receipt.executedAt).toLocaleString("fr-CM")}</span>
					</div>
				</div>
				<div className="flex gap-2 mt-6">
					<Button
						variant="outline"
						className="flex-1"
						onClick={() => window.print()}
					>
						<Printer className="w-4 h-4 mr-2" />
						Imprimer
					</Button>
					<Button className="flex-1" onClick={handleNewProvision}>
						<RotateCcw className="w-4 h-4 mr-2" />
						Nouveau
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<div className="space-y-4 max-w-2xl mx-auto">
			{/* Search */}
			<Card className="p-4">
				<h3 className="font-medium mb-3">Rechercher un agent</h3>
				<div className="flex gap-2">
					<input
						type="tel"
						placeholder="Numéro de téléphone de l'agent"
						value={phoneSearch}
						onChange={(e) => setPhoneSearch(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
						className="flex-1 border rounded-md px-3 py-2 text-sm"
					/>
					<Button
						onClick={handleSearch}
						disabled={isSearching || !phoneSearch.trim()}
					>
						<Search className="w-4 h-4 mr-2" />
						{isSearching ? "Recherche..." : "Rechercher"}
					</Button>
				</div>
				{searchError && (
					<p className="text-red-500 text-sm mt-2">Agent non trouvé</p>
				)}
			</Card>

			{/* Agent Info */}
			{agent && (
				<Card className="p-4">
					<h3 className="font-medium mb-3">Information Agent</h3>
					<div className="grid grid-cols-2 gap-3 text-sm">
						<div>
							<span className="text-gray-500">Nom</span>
							<p className="font-medium">{agent.name}</p>
						</div>
						<div>
							<span className="text-gray-500">Téléphone</span>
							<p className="font-medium">{agent.phone}</p>
						</div>
						<div>
							<span className="text-gray-500">Solde Float</span>
							<p className="font-semibold text-blue-600">
								{formatCurrency(agent.floatBalance, "XAF")}
							</p>
						</div>
						<div>
							<span className="text-gray-500">Agence de référence</span>
							<p className="font-medium">{agent.homeBranchName}</p>
						</div>
					</div>
				</Card>
			)}

			{/* Provisioning Form */}
			{agent && (
				<Card className="p-4">
					<h3 className="font-medium mb-3">Provisionnement Float</h3>
					<div className="space-y-3">
						<div>
							<label className="text-sm text-gray-500 block mb-1">
								Montant (XAF)
							</label>
							<input
								type="number"
								placeholder="0"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="w-full border rounded-md px-3 py-2 text-sm"
								min="1"
							/>
						</div>
						<div>
							<label className="text-sm text-gray-500 block mb-1">
								Agence exécutante
							</label>
							<select
								value={servicingOfficeId}
								onChange={(e) => setServicingOfficeId(e.target.value)}
								className="w-full border rounded-md px-3 py-2 text-sm"
							>
								<option value="">Sélectionner une agence</option>
								{branches.map((b) => (
									<option key={b.officeId} value={b.officeId}>
										{b.name}
									</option>
								))}
							</select>
						</div>
						<Button
							className="w-full"
							onClick={handleConfirm}
							disabled={!amount || !servicingOfficeId || isSubmitting}
						>
							{isSubmitting ? "Traitement..." : "Confirmer le provisionnement"}
						</Button>
					</div>
				</Card>
			)}

			{/* Confirmation Modal */}
			{showConfirmation && agent && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<Card className="p-6 max-w-md w-full mx-4">
						<h3 className="font-semibold text-lg mb-4">
							Confirmer le provisionnement
						</h3>
						<div className="space-y-2 text-sm mb-6">
							<div className="flex justify-between">
								<span className="text-gray-500">Agent</span>
								<span>{agent.name}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-500">Montant</span>
								<span className="font-semibold">
									{formatCurrency(Number.parseInt(amount, 10), "XAF")}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-500">Agence exécutante</span>
								<span>
									{branches.find(
										(b) =>
											b.officeId === Number.parseInt(servicingOfficeId, 10),
									)?.name || servicingOfficeId}
								</span>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								className="flex-1"
								onClick={handleCancel}
							>
								Annuler
							</Button>
							<Button
								className="flex-1"
								onClick={handleSubmit}
								disabled={isSubmitting}
							>
								{isSubmitting ? "Traitement..." : "Confirmer"}
							</Button>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
