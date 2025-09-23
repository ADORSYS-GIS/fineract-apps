import { ClientSearchView } from './ClientSearch.view';
import { useClientSearch } from './useClientSearch';

interface ClientSearchProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}

export const ClientSearch = ({
  query,
  onQueryChange,
}: ClientSearchProps) => {
  const { data: searchResults, isLoading, error } = useClientSearch(query);

  return (
    <ClientSearchView
      query={query}
      onQueryChange={onQueryChange}
      onSearch={() => onQueryChange(query)}
      searchResults={searchResults?.content || []}
      isSearching={isLoading}
      searchError={error}
    />
  );
};