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

	// Fetch or filter suggestions when debounced input changes
	useEffect(() => {
		if (!suggestionProvider && !externalSuggestions) {
			setItems([]);
			closeMenu();
			return;
		}
		if (debouncedInputValue.length < minChars) {
			setItems([]);
			closeMenu();
			return;
		}

		let cancelled = false;

		const fetchSuggestions = async () => {
			setInternalIsLoading(true);
			try {
				if (suggestionProvider) {
					// Abort previous request
					abortRef.current?.abort();
					const ac = new AbortController();
					abortRef.current = ac;

					const results = await suggestionProvider(
						debouncedInputValue,
						ac.signal,
					);
					if (!cancelled) {
						setItems(results.slice(0, maxSuggestions));
					}
				} else if (externalSuggestions) {
					// Client-side filtering
					const query = debouncedInputValue.toLowerCase();
					const filtered = externalSuggestions.filter(
						(s) =>
							String(s.label).toLowerCase().includes(query) ||
							String(s.id).toLowerCase().includes(query),
					);
					if (!cancelled) {
						setItems(filtered.slice(0, maxSuggestions));
					}
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
		debouncedInputValue,
		externalSuggestions,
		suggestionProvider,
		minChars,
		maxSuggestions,
		closeMenu,
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
