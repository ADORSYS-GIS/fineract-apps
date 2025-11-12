import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLoanSearch } from "../../hooks/useLoanSearch";

export const LoanSearchView = () => {
	const { searchQuery, setSearchQuery, handleSearch, error, isLoading } =
		useLoanSearch();
	const { t } = useTranslation();

	const onSearch = () => {
		if (searchQuery) {
			handleSearch();
		}
	};

	return (
		<Card className="w-full">
			<div className="p-4">
				<div className="flex gap-2">
					<SearchBar
						value={searchQuery}
						onValueChange={setSearchQuery}
						onSearch={onSearch}
						isLoading={isLoading}
						placeholder={t("search")}
					/>
					<Button onClick={onSearch} className="px-4">
						<Search size={20} />
					</Button>
				</div>
				{error && <p className="text-red-500 mt-2">{error.message}</p>}
			</div>
		</Card>
	);
};
