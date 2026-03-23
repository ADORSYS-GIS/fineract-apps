import { createFileRoute } from "@tanstack/react-router";
import { AgentProvisioning } from "@/components/AgentProvisioning";

export const Route = createFileRoute("/agent-provisioning/")({
	component: AgentProvisioningPage,
});

function AgentProvisioningPage() {
	return (
		<div className="p-4">
			<h1 className="text-xl font-semibold mb-1">Provisionnement Agent</h1>
			<p className="text-gray-500 text-sm mb-4">
				Rechercher un agent et provisionner son compte float
			</p>
			<AgentProvisioning />
		</div>
	);
}
