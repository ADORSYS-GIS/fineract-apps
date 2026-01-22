import { useAuth } from "../contexts/AuthContext";

export interface AccountingPermissions {
	// GL Account permissions
	canViewGLAccounts: boolean;
	canCreateGLAccount: boolean;
	canEditGLAccount: boolean;
	canDeleteGLAccount: boolean;

	// Journal Entry permissions
	canViewJournalEntries: boolean;
	canCreateJournalEntry: boolean;
	canReverseJournalEntry: boolean;

	// Approval permissions
	canViewApprovalQueue: boolean;
	canApproveEntries: boolean;
	canRejectEntries: boolean;

	// Closure permissions
	canViewClosures: boolean;
	canCreateClosure: boolean;
	canDeleteClosure: boolean;

	// Cash Short/Over permissions
	canUseCashShortOver: boolean;

	// Role-based flags
	isSuperuser: boolean;
	isAccountant: boolean;
	isManager: boolean;
	isViewer: boolean;
}

/**
 * Hook to check user permissions for accounting operations
 *
 * Permission model:
 * - Admin: Full access to all features (create, edit, delete, approve)
 * - Manager: Can create entries and view everything, but cannot approve
 * - Accountant: Can create and view entries, but cannot edit GL accounts or approve
 * - Viewer: Read-only access to all features
 */
export function usePermissions(): AccountingPermissions {
	const { hasRole, hasPermission } = useAuth();

	const isSupueruser = hasRole("super-user");
	const isAccountant = hasRole("accountant");
	const isManager = hasRole("manager");
	const isViewer = hasRole("viewer");

	// Super user has all permissions
	const canCreateGLAccount = isSupueruser || hasPermission("CREATE_GLACCOUNT");
	const canEditGLAccount = isSupueruser || hasPermission("UPDATE_GLACCOUNT");
	const canDeleteGLAccount = isSupueruser || hasPermission("DELETE_GLACCOUNT");

	const canCreateJournalEntry =
		isSupueruser ||
		isAccountant ||
		isManager ||
		hasPermission("CREATE_JOURNALENTRY");

	const canReverseJournalEntry =
		isSupueruser || isManager || hasPermission("REVERSE_JOURNALENTRY");

	const canApproveEntries =
		isSupueruser ||
		hasPermission("APPROVE_JOURNALENTRY") ||
		hasPermission("APPROVE");

	const canRejectEntries =
		isSupueruser ||
		hasPermission("REJECT_JOURNALENTRY") ||
		hasPermission("REJECT");

	const canCreateClosure = isSupueruser || hasPermission("CREATE_GLCLOSURE");
	const canDeleteClosure = isSupueruser || hasPermission("DELETE_GLCLOSURE");

	// Everyone can view (unless they're explicitly a Viewer role with no other roles)
	const canViewGLAccounts = true;
	const canViewJournalEntries = true;
	const canViewApprovalQueue = true;
	const canViewClosures = true;

	// Cash Short/Over can be used by accountants and admins
	const canUseCashShortOver =
		isSupueruser || isAccountant || hasPermission("CREATE_JOURNALENTRY");

	return {
		// GL Account permissions
		canViewGLAccounts,
		canCreateGLAccount,
		canEditGLAccount,
		canDeleteGLAccount,

		// Journal Entry permissions
		canViewJournalEntries,
		canCreateJournalEntry,
		canReverseJournalEntry,

		// Approval permissions
		canViewApprovalQueue,
		canApproveEntries,
		canRejectEntries,

		// Closure permissions
		canViewClosures,
		canCreateClosure,
		canDeleteClosure,

		// Cash Short/Over permissions
		canUseCashShortOver,

		// Role flags
		isSuperuser: isSupueruser,
		isAccountant,
		isManager,
		isViewer,
	};
}
