import { Card, formatCurrency } from "@fineract-apps/ui";
import { Activity, Building2, TrendingUp, Users } from "lucide-react";
import type { useAgencyDashboard } from "./useAgencyDashboard";

type Props = ReturnType<typeof useAgencyDashboard>;

export function AgencyDashboardView(props: Props) {
	const {
		fromDate,
		setFromDate,
		toDate,
		setToDate,
		selectedBranch,
		setSelectedBranch,
		branches,
		report,
		isLoading,
		error,
	} = props;

	return (
		<div className="space-y-4">
			{/* Filters */}
			<Card className="p-4">
				<div className="flex flex-wrap gap-4 items-end">
					<div>
						<label className="text-sm text-gray-500 block mb-1">Du</label>
						<input
							type="date"
							value={fromDate}
							onChange={(e) => setFromDate(e.target.value)}
							className="border rounded-md px-3 py-2 text-sm"
						/>
					</div>
					<div>
						<label className="text-sm text-gray-500 block mb-1">Au</label>
						<input
							type="date"
							value={toDate}
							onChange={(e) => setToDate(e.target.value)}
							className="border rounded-md px-3 py-2 text-sm"
						/>
					</div>
					<div>
						<label className="text-sm text-gray-500 block mb-1">Agence</label>
						<select
							value={selectedBranch ?? ""}
							onChange={(e) =>
								setSelectedBranch(
									e.target.value ? Number.parseInt(e.target.value, 10) : null,
								)
							}
							className="border rounded-md px-3 py-2 text-sm"
						>
							<option value="">Toutes les agences</option>
							{branches.map((b) => (
								<option key={b.officeId} value={b.officeId}>
									{b.name}
								</option>
							))}
						</select>
					</div>
				</div>
			</Card>

			{/* Summary Cards */}
			{report && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<Activity className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Opérations</p>
								<p className="text-2xl font-semibold">{report.totalOps}</p>
							</div>
						</div>
					</Card>
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<TrendingUp className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Total Provisionné</p>
								<p className="text-2xl font-semibold">
									{formatCurrency(report.totalAmount, "XAF")}
								</p>
							</div>
						</div>
					</Card>
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Users className="w-5 h-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Agents Servis</p>
								<p className="text-2xl font-semibold">{report.totalAgents}</p>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Loading / Error */}
			{isLoading && (
				<Card className="p-8 text-center text-gray-500">
					Chargement des données...
				</Card>
			)}
			{error && (
				<Card className="p-4 text-red-500">
					Erreur: {(error as Error).message}
				</Card>
			)}

			{/* Per-Branch Table */}
			{report && report.stats.length > 0 && (
				<Card className="p-4">
					<h3 className="font-medium mb-3 flex items-center gap-2">
						<Building2 className="w-4 h-4" />
						Détail par Agence
					</h3>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b text-left text-gray-500">
									<th className="pb-2 pr-4">Agence</th>
									<th className="pb-2 pr-4 text-right">Opérations</th>
									<th className="pb-2 pr-4 text-right">Agents Servis</th>
									<th className="pb-2 text-right">Total Provisionné</th>
								</tr>
							</thead>
							<tbody>
								{report.stats.map((s) => (
									<tr key={s.officeId} className="border-b last:border-0">
										<td className="py-2 pr-4 font-medium">{s.branchName}</td>
										<td className="py-2 pr-4 text-right">{s.opsCount}</td>
										<td className="py-2 pr-4 text-right">{s.agentsServed}</td>
										<td className="py-2 text-right font-semibold">
											{formatCurrency(s.totalProvisionedXaf, "XAF")}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			)}

			{report && report.stats.length === 0 && (
				<Card className="p-8 text-center text-gray-500">
					Aucune opération pour la période sélectionnée
				</Card>
			)}
		</div>
	);
}
