import { createFileRoute } from "@tanstack/react-router";
import { AgencyDashboard } from "../pages/agency-dashboard/AgencyDashboard";

export const Route = createFileRoute("/agency-dashboard")({
	component: AgencyDashboardPage,
});

function AgencyDashboardPage() {
	return (
		<div className="p-4">
			<h1 className="text-xl font-semibold mb-1">Tableau de Bord Agences</h1>
			<p className="text-gray-500 text-sm mb-4">
				Suivi des opérations de provisionnement par agence bancaire
			</p>
			<AgencyDashboard />
		</div>
	);
}
