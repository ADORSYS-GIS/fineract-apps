import { useCombobox } from "downshift";
import { useCallback, useEffect, useState } from "react";
import type { SearchBarProps } from "./SearchBar.types";
import { useSuggestions } from "./useSuggestions";

/**
 * Custom hook for debouncing a value
 * @param value - The value to debounce
 * @param ms - Debounce delay in milliseconds
 * @returns The debounced value
 */
function useDebouncedValue<T>(value: T, ms = 250) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), ms);
		return () => clearTimeout(timer);
	}, [value, ms]);

	return debouncedValue;
}

/**
 * Main search bar hook that orchestrates all search functionality.
 * Handles input state, suggestion management, and user interactions.
 *
 * @param props - SearchBar configuration props
 * @returns Object containing all search bar state and handlers
 */
export function useSearchBar({
	suggestions: externalSuggestions,
	suggestionProvider,
	onSearch,
	onSuggestionSelect,
	isLoading: externalIsLoading,
	minChars = 2,
	debounceMs = 250,
	maxSuggestions = 8,
}: Readonly<SearchBarProps>) {
	const [inputValue, setInputValue] = useState("");

	// Debounce the input value to prevent excessive API calls
	const debouncedInputValue = useDebouncedValue(inputValue, debounceMs);

	// Handle suggestion fetching with the extracted hook
	const { items, isLoading: internalIsLoading } = useSuggestions({
		query: debouncedInputValue,
		suggestionProvider,
		externalSuggestions,
		maxSuggestions,
		minChars,
	});

	const isLoading = externalIsLoading ?? internalIsLoading;

	// Setup downshift for accessibility and keyboard navigation
	const {
		isOpen,
		getMenuProps,
		getInputProps,
		getItemProps,
		highlightedIndex,
		closeMenu,
		reset,
	} = useCombobox({
		items,
		inputValue,
		onSelectedItemChange: ({ selectedItem }) => {
			if (selectedItem) {
				onSuggestionSelect?.(selectedItem);
				setInputValue(selectedItem.label);
			}
		},
		onInputValueChange: ({ inputValue: newValue }) => {
			setInputValue(newValue ?? "");
		},
		itemToString: (item) => (item ? item.label : ""),
	});

	// Handle search submission
	const handleSearch = useCallback(() => {
		onSearch?.(inputValue);
		closeMenu();
	}, [inputValue, onSearch, closeMenu]);

	// Handle input clearing
	const handleClear = useCallback(() => {
		setInputValue("");
		reset();
	}, [reset]);

	return {
		inputValue,
		handleSearch,
		handleClear,
		isLoading,
		items,
		// Downshift props for accessibility and keyboard navigation
		isOpen,
		getMenuProps,
		getInputProps,
		getItemProps,
		highlightedIndex,
	};
}
