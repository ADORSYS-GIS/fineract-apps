import { Card, SearchBar } from "@fineract-apps/ui";
import { ClientSearchViewProps } from "./ClientSearch.types";

export const ClientSearchView = ({
	searchQuery,
	setSearchQuery,
	handleSearch,
	isLoading,
	searchError,
}: ClientSearchViewProps) => {
	return (
		<Card className="w-full">
			<div className="p-4">
				<SearchBar
					value={searchQuery}
					onValueChange={setSearchQuery}
					onSearch={handleSearch}
					isLoading={isLoading}
				/>
				{searchError && <p className="text-blue-300">{searchError.message}</p>}
			</div>
		</Card>
	);
};
