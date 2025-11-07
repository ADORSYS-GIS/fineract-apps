import { Card, SearchBar } from "@fineract-apps/ui";
import { useLoanSearch } from "../../hooks/useLoanSearch";

export const LoanSearchView = () => {
  const { searchQuery, setSearchQuery, handleSearch, error, isLoading } = useLoanSearch();

  return (
    <Card className="w-full">
      <div className="p-4">
        <SearchBar
          value={searchQuery}
          onValueChange={setSearchQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        {error && <p className="text-red-500">{error.message}</p>}
      </div>
    </Card>
  );
};