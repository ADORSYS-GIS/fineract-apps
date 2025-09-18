import type { SearchBarProps } from "./SearchBar.types";
import { SearchBarView } from "./SearchBar.view";
import { useSearchBar } from "./useSearchBar";

export function SearchBar(props: Readonly<SearchBarProps>) {
	const searchBarState = useSearchBar(props);

	return <SearchBarView {...props} {...searchBarState} />;
}

export type { SearchBarProps, Suggestion } from "./SearchBar.types";
