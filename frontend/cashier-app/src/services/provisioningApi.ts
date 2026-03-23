const BASE_URL = import.meta.env.VITE_CUSTOMER_SERVICE_URL || "/api/v1";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE_URL}${url}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"Fineract-Platform-TenantId":
				import.meta.env.VITE_FINERACT_TENANT_ID || "default",
		},
		...options,
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || `Request failed: ${res.status}`);
	}
	return res.json();
}

export interface AgentInfo {
	keycloakId: string;
	phone: string;
	name: string;
	floatBalance: number;
	homeBranchOfficeId: number;
	homeBranchName: string;
}

export interface BranchInfo {
	officeId: number;
	name: string;
	externalId: string;
}

export interface ProvisionRequest {
	agentKeycloakId: string;
	agentPhone: string;
	amount: number;
	servicingOfficeId: number;
	servicingBranchName: string;
	staffId: string;
	staffName: string;
}

export interface ProvisionResponse {
	id: string;
	fineractTxnId: number;
	amount: number;
	receiptRef: string;
	executedAt: string;
}

export async function searchAgent(phone: string): Promise<AgentInfo> {
	return fetchJson<AgentInfo>(
		`/provisioning/agent-search?phone=${encodeURIComponent(phone)}`,
	);
}

export async function provisionAgentFloat(
	data: ProvisionRequest,
): Promise<ProvisionResponse> {
	return fetchJson<ProvisionResponse>("/provisioning/agent-float", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function getBranches(): Promise<BranchInfo[]> {
	return fetchJson<BranchInfo[]>("/provisioning/branches");
}
