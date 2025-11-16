import { usePermissions } from "../../hooks/usePermissions";
import { GLAccountsView } from "./GLAccountsView";
import { useGLAccounts } from "./useGLAccounts";

export function GLAccountsContainer() {
	const {
		glAccounts,
		isLoading,
		searchTerm,
		accountType,
		onSearch,
		onFilterByType,
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
			canCreateAccount={canCreateGLAccount}
			canEditAccount={canEditGLAccount}
			canDeleteAccount={canDeleteGLAccount}
			onSearch={onSearch}
			onFilterByType={onFilterByType}
			onExportCSV={onExportCSV}
			onCreateAccount={onCreateAccount}
			onEditAccount={onEditAccount}
			onDeleteAccount={onDeleteAccount}
		/>
	);
}
