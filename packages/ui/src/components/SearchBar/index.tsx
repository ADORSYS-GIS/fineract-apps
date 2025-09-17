import { forwardRef } from "react";
import { SearchBarProps } from "./SearchBar.types";
import { SearchBarView } from "./SearchBar.view";
import { useSearchBar } from "./useSearchBar";

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
	(props, ref) => {
		const {
			className,
			placeholder,
			showClear,
			onSearch,
			onClear,
			suggestions,
			suggestionProvider,
			onSuggestionSelect,
			minChars = 2,
			debounceMs = 300,
			maxSuggestions = 8,
			showSearchButton,
		} = props;

		const {
			inputValue,
			items,
			isLoading,
			isOpen,
			highlightedIndex,
			getInputProps,
			getItemProps,
			getMenuProps,
			handleClear,
		} = useSearchBar({
			suggestions,
			suggestionProvider,
			onSearch,
			onSuggestionSelect,
			onClear,
			minChars,
			debounceMs,
			maxSuggestions,
		});

		return (
			<SearchBarView
				ref={ref}
				className={className}
				placeholder={placeholder}
				showClear={showClear}
				showSearchButton={showSearchButton}
				onClear={handleClear}
				items={items}
				isLoading={isLoading}
				inputValue={inputValue}
				comboboxProps={{
					isOpen,
					highlightedIndex,
					getInputProps,
					getItemProps,
					getMenuProps,
				}}
			/>
		);
	},
);

SearchBar.displayName = "SearchBar";
