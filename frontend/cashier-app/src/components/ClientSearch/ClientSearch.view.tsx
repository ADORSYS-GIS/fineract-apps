import { Card, SearchBar } from "@fineract-apps/ui";
import { useTranslation } from "react-i18next";
import { ClientSearchViewProps } from "./ClientSearch.types";

export const ClientSearchView = ({
	searchQuery,
	setSearchQuery,
	handleSearch,
	isLoading,
	searchError,
}: ClientSearchViewProps) => {
	const { t } = useTranslation();
	return (
		<Card className="w-full">
			<div className="p-4">
				<SearchBar
					value={searchQuery}
					onValueChange={setSearchQuery}
					onSearch={handleSearch}
					isLoading={isLoading}
					placeholder={t("clientSearch.searchPlaceholder")}
				/>
				{searchError && (
					<p className="text-blue-300">
						{t("clientSearch.error", { message: searchError.message })}
					</p>
				)}
			</div>
		</Card>
	);
};
