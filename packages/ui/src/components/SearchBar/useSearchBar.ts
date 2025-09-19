import { useCombobox } from "downshift";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	debounce,
	filterByQuery,
	limitResults,
	shouldIgnoreError,
} from "../../lib/utils";
import type { SearchBarProps, Suggestion } from "./SearchBar.types";

function shouldShowSuggestions(isOpen: boolean, items: Suggestion[]) {
	return isOpen && items.length > 0;
}

function shouldPerformSearch(query: string, minChars: number) {
	return query.trim() && query.length >= minChars;
}

export function useSearchBar(props: Readonly<SearchBarProps>) {
	const {
		value = "",
		onValueChange,
		onSearch,
		placeholder = "Search...",
		disabled = false,
		suggestions = [],
		suggestionProvider,
		onSuggestionSelect,
		isLoading = false,
		showClear = true,
		showSearchButton = true,
		size = "md",
		maxSuggestions = 10,
		minChars = 1,
		debounceMs = 300,
		...rest
	} = props;

	const [query, setQuery] = useState(value);
	const [items, setItems] = useState<Suggestion[]>([]);
	const [loading, setLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		setQuery(value);
	}, [value]);

	const performAsyncSearch = useCallback(
		async (searchQuery: string, controller: AbortController) => {
			setLoading(true);
			try {
				const results = await suggestionProvider!(
					searchQuery,
					controller.signal,
				);
				setItems(limitResults(results, maxSuggestions));
			} catch (error) {
				if (!shouldIgnoreError(error)) {
					console.error("SearchBar error:", error);
					setItems([]);
				}
			} finally {
				setLoading(false);
			}
		},
		[suggestionProvider, maxSuggestions],
	);

	const performClientSearch = useCallback(
		(searchQuery: string) => {
			const filtered = filterByQuery(
				suggestions,
				searchQuery,
				(item) => item.label,
			);
			setItems(limitResults(filtered, maxSuggestions));
		},
		[suggestions, maxSuggestions],
	);

	const performSearch = useCallback(
		async (searchQuery: string) => {
			abortRef.current?.abort();
			if (!shouldPerformSearch(searchQuery, minChars)) {
				setItems([]);
				setLoading(false);
				return;
			}
			if (suggestionProvider) {
				const controller = new AbortController();
				abortRef.current = controller;
				await performAsyncSearch(searchQuery, controller);
			} else {
				performClientSearch(searchQuery);
			}
		},
		[minChars, suggestionProvider, performAsyncSearch, performClientSearch],
	);

	const debouncedSearch = useMemo(
		() => debounce(performSearch, debounceMs),
		[performSearch, debounceMs],
	);

	useEffect(() => {
		debouncedSearch(query);
	}, [query, debouncedSearch]);

	useEffect(() => () => abortRef.current?.abort(), []);

	const handleClear = useCallback(() => {
		setQuery("");
		setItems([]);
		onValueChange?.("");
	}, [onValueChange]);

	const handleInputValueChange = useCallback(
		({ inputValue }: { inputValue?: string }) => {
			const newValue = inputValue ?? "";
			setQuery(newValue);
			onValueChange?.(newValue);
		},
		[onValueChange],
	);

	const handleSelection = useCallback(
		({ selectedItem }: { selectedItem?: Suggestion | null }) => {
			if (selectedItem) {
				onSuggestionSelect?.(selectedItem);
			}
		},
		[onSuggestionSelect],
	);

	const {
		isOpen,
		getMenuProps,
		getInputProps,
		getItemProps,
		highlightedIndex,
	} = useCombobox({
		items,
		itemToString: (item) => item?.label ?? "",
		onInputValueChange: handleInputValueChange,
		onSelectedItemChange: handleSelection,
	});

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && highlightedIndex === -1) {
				onSearch?.(query);
			}
		},
		[onSearch, query, highlightedIndex],
	);

	const handleSearchClick = useCallback(() => {
		onSearch?.(query);
	}, [onSearch, query]);

	return {
		inputProps: {
			...getInputProps({
				placeholder,
				disabled,
				className:
					"flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground",
				onKeyDown: handleKeyDown,
				...rest,
			}),
		},
		menuProps: getMenuProps(),
		getItemProps: ({ item, index }: { item: Suggestion; index: number }) =>
			getItemProps({ item, index }),
		items,
		highlightedIndex,
		ui: {
			showLoader: isLoading || loading,
			showClearButton: showClear && query,
			showSearchButton,
			showSuggestions: shouldShowSuggestions(isOpen, items),
			disabled,
		},
		actions: {
			handleClear,
			handleSearchClick,
		},
		size,
	} as const;
}
