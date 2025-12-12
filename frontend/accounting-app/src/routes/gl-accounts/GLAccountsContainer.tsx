import { usePermissions } from "../../hooks/usePermissions";
import { GLAccountsView } from "./GLAccountsView";
import { useGLAccounts } from "./useGLAccounts";

export function GLAccountsContainer() {
	const {
		glAccounts,
		isLoading,
		searchTerm,
		accountType,
		currentPage,
		totalPages,
		totalCount,
		onSearch,
		onFilterByType,
		onPageChange,
		onExportCSV,
		onCreateAccount,
		onEditAccount,
		onDeleteAccount,
	} = useGLAccounts();

	const { canCreateGLAccount, canEditGLAccount, canDeleteGLAccount } =
		usePermissions();

	return (
		<GLAccountsView
			glAccounts={glAccounts}
			isLoading={isLoading}
			searchTerm={searchTerm}
			accountType={accountType}
			currentPage={currentPage}
			totalPages={totalPages}
			totalCount={totalCount}
			canCreateAccount={canCreateGLAccount}
			canEditAccount={canEditGLAccount}
			canDeleteAccount={canDeleteGLAccount}
			onSearch={onSearch}
			onFilterByType={onFilterByType}
			onPageChange={onPageChange}
			onExportCSV={onExportCSV}
			onCreateAccount={onCreateAccount}
			onEditAccount={onEditAccount}
			onDeleteAccount={onDeleteAccount}
		/>
	);
}
