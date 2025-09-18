import { useCombobox } from "downshift";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchBarProps, Suggestion } from "./SearchBar.types";

function useDebouncedValue<T>(value: T, ms = 250) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), ms);
		return () => clearTimeout(timer);
	}, [value, ms]);

	return debouncedValue;
}

export function useSearchBar({
	suggestions: externalSuggestions,
	suggestionProvider,
	onSearch,
	onSuggestionSelect,
	isLoading: externalIsLoading,
	minChars = 2,
	debounceMs = 250,
	maxSuggestions = 8,
}: SearchBarProps) {
	const [items, setItems] = useState<Suggestion[]>([]);
	const [internalIsLoading, setInternalIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const abortRef = useRef<AbortController | null>(null);

	const isLoading = externalIsLoading ?? internalIsLoading;

	// Debounce the input value for suggestions
	const debouncedInputValue = useDebouncedValue(inputValue, debounceMs);

	// Setup downshift
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

	// Helper functions to reduce complexity
	const shouldFetchSuggestions = useCallback(() => {
		return (
			(suggestionProvider || externalSuggestions) &&
			debouncedInputValue.length >= minChars
		);
	}, [
		suggestionProvider,
		externalSuggestions,
		debouncedInputValue.length,
		minChars,
	]);

	const clearSuggestionsAndCloseMenu = useCallback(() => {
		setItems([]);
		closeMenu();
	}, [closeMenu]);

	const fetchProviderSuggestions = useCallback(
		async (query: string, signal: AbortSignal): Promise<Suggestion[]> => {
			if (!suggestionProvider) return [];
			const results = await suggestionProvider(query, signal);
			return results.slice(0, maxSuggestions);
		},
		[suggestionProvider, maxSuggestions],
	);

	const filterExternalSuggestions = useCallback(
		(query: string): Suggestion[] => {
			if (!externalSuggestions) return [];
			const lowerQuery = query.toLowerCase();
			const filtered = externalSuggestions.filter(
				(s) =>
					String(s.label).toLowerCase().includes(lowerQuery) ||
					String(s.id).toLowerCase().includes(lowerQuery),
			);
			return filtered.slice(0, maxSuggestions);
		},
		[externalSuggestions, maxSuggestions],
	);

	// Fetch or filter suggestions when debounced input changes
	useEffect(() => {
		if (!shouldFetchSuggestions()) {
			clearSuggestionsAndCloseMenu();
			return;
		}

		let cancelled = false;

		const fetchSuggestions = async () => {
			setInternalIsLoading(true);
			try {
				let results: Suggestion[] = [];

				if (suggestionProvider) {
					// Abort previous request
					abortRef.current?.abort();
					const ac = new AbortController();
					abortRef.current = ac;

					results = await fetchProviderSuggestions(
						debouncedInputValue,
						ac.signal,
					);
				} else {
					results = filterExternalSuggestions(debouncedInputValue);
				}

				if (!cancelled) {
					setItems(results);
				}
			} catch (err) {
				// Do not log AbortError
				if (err instanceof Error && err.name === "AbortError") return;

				console.error("SearchBar suggestion fetch error:", err);
				if (!cancelled) setItems([]);
			} finally {
				if (!cancelled) setInternalIsLoading(false);
			}
		};

		fetchSuggestions();
		return () => {
			cancelled = true;
			abortRef.current?.abort();
		};
	}, [
		shouldFetchSuggestions,
		clearSuggestionsAndCloseMenu,
		fetchProviderSuggestions,
		filterExternalSuggestions,
		debouncedInputValue,
		suggestionProvider,
	]);

	// Handle search submission
	const handleSearch = useCallback(() => {
		if (onSearch) {
			onSearch(inputValue);
		}
		closeMenu();
	}, [inputValue, onSearch, closeMenu]);

	// Handle clear
	const handleClear = useCallback(() => {
		setInputValue("");
		reset();
	}, [reset]);

	return {
		inputValue,
		setInputValue,
		handleSearch,
		handleClear,
		isLoading,
		items,
		// Downshift props
		isOpen,
		getMenuProps,
		getInputProps,
		getItemProps,
		highlightedIndex,
	};
}
