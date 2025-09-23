import { ClientSearchData } from '@fineract-apps/fineract-api';

export interface ClientSearchViewProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  searchResults: ClientSearchData[];
  isSearching: boolean;
  searchError: Error | null;
}