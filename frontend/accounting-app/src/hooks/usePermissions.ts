import { useAuth } from "../contexts/AuthContext";

export interface AccountingPermissions {
	// Role-based flags
	isAccountant: boolean;
	isSupervisorAccountant: boolean;
	isSuperUser: boolean;

	// Feature flags
	canAccessApp: boolean;
	canCreateJournalEntry: boolean;
	canViewApprovalQueue: boolean;
}

/**
 * Hook to check user permissions for accounting operations based on roles.
 *
 * Permission model:
 * - "Accountant": Can create journal entries, but cannot see the approval queue.
 * - "Supervisor Accountant": Can see the approval queue, but cannot create journal entries.
 * - Any other role: No access to the accounting app.
 */
export function usePermissions(): AccountingPermissions {
	const { hasRole } = useAuth();

	const isAccountant = hasRole("Accountant");
	const isSupervisorAccountant = hasRole("Supervisor Accountant");
	const isSuperUser = hasRole("Admin");

	const canAccessApp = isAccountant || isSupervisorAccountant || isSuperUser;
	const canCreateJournalEntry = isAccountant || isSuperUser;
	const canViewApprovalQueue = isSupervisorAccountant || isSuperUser;

	return {
		isAccountant,
		isSupervisorAccountant,
		canAccessApp,
		canCreateJournalEntry,
		canViewApprovalQueue,
		isSuperUser,
	};
}
