import { useCombobox } from "downshift";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	cn,
	debounce,
	filterByQuery,
	limitResults,
	shouldIgnoreError,
} from "../../lib/utils";
import { searchBarVariants, suggestionItemVariants } from "./SearchBar.styles";
import type { SearchBarProps, Suggestion } from "./SearchBar.types";

/**
 * Simple, reusable SearchBar component
 * - Supports controlled/uncontrolled usage
 * - Client-side or async suggestions
 * - Accessible with Downshift
 * - Customizable styling
 */
export function SearchBar({
	value = "",
	onValueChange,
	onSearch,
	placeholder = "Search...",
	disabled = false,
	className,
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
	...props
}: Readonly<SearchBarProps>) {
	const [query, setQuery] = useState(value);
	const [items, setItems] = useState<Suggestion[]>([]);
	const [loading, setLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	// Sync with value prop
	useEffect(() => {
		setQuery(value);
	}, [value]);

	// Search logic
	const performSearch = async (searchQuery: string) => {
		abortRef.current?.abort();

		if (!searchQuery.trim() || searchQuery.length < minChars) {
			setItems([]);
			setLoading(false);
			return;
		}

		if (suggestionProvider) {
			setLoading(true);
			const controller = new AbortController();
			abortRef.current = controller;

			try {
				const results = await suggestionProvider(
					searchQuery,
					controller.signal,
				);
				if (!controller.signal.aborted) {
					setItems(limitResults(results, maxSuggestions));
					setLoading(false);
				}
			} catch (error) {
				if (!shouldIgnoreError(error)) {
					console.error("SearchBar error:", error);
				}
				if (!controller.signal.aborted) {
					setItems([]);
					setLoading(false);
				}
			}
		} else {
			const filtered = filterByQuery(
				suggestions,
				searchQuery,
				(item) => item.label,
			);
			setItems(limitResults(filtered, maxSuggestions));
		}
	};

	// Debounced search
	const debouncedSearch = debounce(performSearch, debounceMs);

	useEffect(() => {
		debouncedSearch(query);
	}, [query, debouncedSearch]);

	// Cleanup
	useEffect(() => () => abortRef.current?.abort(), []);

	// Downshift for accessibility
	const {
		isOpen,
		getMenuProps,
		getInputProps,
		getItemProps,
		highlightedIndex,
	} = useCombobox({
		items,
		itemToString: (item) => item?.label ?? "",
		onInputValueChange: ({ inputValue }) => {
			const newValue = inputValue ?? "";
			setQuery(newValue);
			onValueChange?.(newValue);
		},
		onSelectedItemChange: ({ selectedItem }) => {
			if (selectedItem) {
				onSuggestionSelect?.(selectedItem);
			}
		},
	});

	return (
		<div className={cn("relative w-full", className)}>
			{/* Input Container */}
			<div className={searchBarVariants({ size })}>
				<Search className="h-4 w-4 text-muted-foreground" />

				<input
					{...getInputProps({
						placeholder,
						disabled,
						className:
							"flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground",
						onKeyDown: (e) => {
							if (e.key === "Enter" && highlightedIndex === -1) {
								onSearch?.(query);
							}
						},
						...props,
					})}
				/>

				{(isLoading || loading) && (
					<Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
				)}

				{showClear && query && (
					<button
						type="button"
						onClick={() => {
							setQuery("");
							setItems([]);
							onValueChange?.("");
						}}
						className="p-1 hover:bg-accent rounded transition-colors"
					>
						<X className="h-3 w-3" />
					</button>
				)}

				{showSearchButton && (
					<button
						type="button"
						onClick={() => onSearch?.(query)}
						disabled={disabled}
						className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						Search
					</button>
				)}
			</div>

			{/* Suggestions */}
			<ul
				{...getMenuProps()}
				className={cn(
					"absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-popover border rounded-md shadow-lg",
					(!isOpen || items.length === 0) && "hidden",
				)}
			>
				{items.map((item, index) => (
					<li
						key={item.id}
						{...getItemProps({ item, index })}
						className={suggestionItemVariants({
							highlighted: index === highlightedIndex,
						})}
					>
						{item.label}
					</li>
				))}
			</ul>
		</div>
	);
}
