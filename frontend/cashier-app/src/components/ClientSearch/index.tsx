import { ClientSearchView } from "./ClientSearch.view";
import { useClientSearch } from "./useClientSearch";

export const ClientSearch = () => {
	const { isLoading, error, searchQuery, setSearchQuery, handleSearch } =
		useClientSearch();

	return (
		<ClientSearchView
			searchQuery={searchQuery}
			setSearchQuery={setSearchQuery}
			handleSearch={handleSearch}
			isLoading={isLoading}
			searchError={error}
		/>
	);
};
