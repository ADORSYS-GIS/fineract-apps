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
	isAdmin: boolean;
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

	const isAdmin = hasRole("Admin");
	const isAccountant = hasRole("Accountant");
	const isManager = hasRole("Manager");
	const isViewer = hasRole("Viewer");

	// Admin has all permissions
	const canCreateGLAccount = isAdmin || hasPermission("CREATE_GLACCOUNT");
	const canEditGLAccount = isAdmin || hasPermission("UPDATE_GLACCOUNT");
	const canDeleteGLAccount = isAdmin || hasPermission("DELETE_GLACCOUNT");

	const canCreateJournalEntry =
		isAdmin ||
		isAccountant ||
		isManager ||
		hasPermission("CREATE_JOURNALENTRY");

	const canReverseJournalEntry =
		isAdmin || isManager || hasPermission("REVERSE_JOURNALENTRY");

	const canApproveEntries =
		isAdmin ||
		hasPermission("APPROVE_JOURNALENTRY") ||
		hasPermission("APPROVE");

	const canRejectEntries =
		isAdmin || hasPermission("REJECT_JOURNALENTRY") || hasPermission("REJECT");

	const canCreateClosure = isAdmin || hasPermission("CREATE_GLCLOSURE");
	const canDeleteClosure = isAdmin || hasPermission("DELETE_GLCLOSURE");

	// Everyone can view (unless they're explicitly a Viewer role with no other roles)
	const canViewGLAccounts = true;
	const canViewJournalEntries = true;
	const canViewApprovalQueue = true;
	const canViewClosures = true;

	// Cash Short/Over can be used by accountants and admins
	const canUseCashShortOver =
		isAdmin || isAccountant || hasPermission("CREATE_JOURNALENTRY");

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
		isAdmin,
		isAccountant,
		isManager,
		isViewer,
	};
}
