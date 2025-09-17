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
	minChars = 2,
	debounceMs = 250,
	maxSuggestions = 8,
}: SearchBarProps) {
	const [items, setItems] = useState<Suggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const abortRef = useRef<AbortController | null>(null);

	// Debounce the input value for suggestions
	const debouncedInputValue = useDebouncedValue(inputValue, debounceMs);

	// Fetch or filter suggestions when debounced input changes
	useEffect(() => {
		if (!suggestionProvider && !externalSuggestions) return;
		if (debouncedInputValue.length < minChars) {
			setItems([]);
			return;
		}

		let cancelled = false;

		const fetchSuggestions = async () => {
			setIsLoading(true);
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
				if (err instanceof Error && err.name === "AbortError") return;
				console.error("SearchBar suggestion fetch error:", err);
				if (!cancelled) setItems([]);
			} finally {
				if (!cancelled) setIsLoading(false);
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
	]);

	// Setup downshift
	const {
		isOpen,
		getMenuProps,
		getInputProps,
		getItemProps,
		getComboboxProps,
		highlightedIndex,
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
		if (onSearch) {
			onSearch(inputValue);
		}
	}, [inputValue, onSearch]);

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
		getComboboxProps,
		highlightedIndex,
	};
}
