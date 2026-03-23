const BASE_URL = import.meta.env.VITE_CUSTOMER_SERVICE_URL || "/api/v1";

async function fetchJson<T>(url: string): Promise<T> {
	const res = await fetch(`${BASE_URL}${url}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"Fineract-Platform-TenantId":
				import.meta.env.VITE_FINERACT_TENANT_ID || "default",
		},
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || `Request failed: ${res.status}`);
	}
	return res.json();
}

export interface AgencyStats {
	branchName: string;
	officeId: number;
	opsCount: number;
	agentsServed: number;
	totalProvisionedXaf: number;
}

export interface AgencyReportResponse {
	stats: AgencyStats[];
	totalOps: number;
	totalAmount: number;
	totalAgents: number;
}

export interface BranchInfo {
	officeId: number;
	name: string;
	externalId: string;
}

export async function getAgencyReport(
	officeId: number | null,
	from: string,
	to: string,
): Promise<AgencyReportResponse> {
	const params = new URLSearchParams({ from, to });
	const path = officeId
		? `/provisioning/admin/branches/${officeId}/report?${params}`
		: `/provisioning/admin/branches/0/report?${params}`;
	return fetchJson<AgencyReportResponse>(path);
}

export async function getBranches(): Promise<BranchInfo[]> {
	return fetchJson<BranchInfo[]>("/provisioning/branches");
}
