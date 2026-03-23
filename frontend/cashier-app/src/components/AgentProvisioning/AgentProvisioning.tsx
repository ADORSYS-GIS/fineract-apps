import { AgentProvisioningView } from "./AgentProvisioning.view";
import { useAgentProvisioning } from "./useAgentProvisioning";

export function AgentProvisioning() {
	const props = useAgentProvisioning();
	return <AgentProvisioningView {...props} />;
}
