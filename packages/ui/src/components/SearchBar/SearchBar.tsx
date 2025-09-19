import { cn } from "../../lib/utils";
// searchBarVariants intentionally not imported here; handled inside subcomponents
import type { SearchBarProps, Suggestion } from "./SearchBar.types";
import { SearchInput } from "./SearchInput";
import { SuggestionsList } from "./SuggestionsList";
import { useSearchBar } from "./useSearchBar";

export function SearchBar(props: Readonly<SearchBarProps>) {
	const { size = "md", className } = props;

	const {
		inputProps,
		menuProps,
		getItemProps,
		items,
		highlightedIndex,
		ui: {
			showLoader,
			showClearButton,
			showSearchButton,
			showSuggestions,
			disabled,
		},
		actions: { handleClear, handleSearchClick },
	} = useSearchBar(props);

	return (
		<div className={cn("relative w-full", className)}>
			<SearchInput
				size={size}
				inputProps={inputProps}
				showLoader={showLoader}
				showClearButton={!!showClearButton}
				showSearchButton={showSearchButton}
				disabled={disabled}
				onClear={handleClear}
				onSearchClick={handleSearchClick}
			/>

			<SuggestionsList
				menuProps={menuProps}
				items={items as ReadonlyArray<Suggestion>}
				getItemProps={getItemProps}
				highlightedIndex={highlightedIndex}
				show={showSuggestions}
			/>
		</div>
	);
}
