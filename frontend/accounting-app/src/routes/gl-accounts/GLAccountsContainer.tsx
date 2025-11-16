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

	return (
		<GLAccountsView
			glAccounts={glAccounts}
			isLoading={isLoading}
			searchTerm={searchTerm}
			accountType={accountType}
			onSearch={onSearch}
			onFilterByType={onFilterByType}
			onExportCSV={onExportCSV}
			onCreateAccount={onCreateAccount}
			onEditAccount={onEditAccount}
			onDeleteAccount={onDeleteAccount}
		/>
	);
}
