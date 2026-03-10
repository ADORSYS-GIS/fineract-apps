export interface ClientSearchViewProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	handleSearch: (value: string) => void;
	isLoading: boolean;
	searchError: { message: string } | null;
}
