import { VariantProps } from "class-variance-authority";
import { UseComboboxReturnValue } from "downshift";
import { searchBarVariants } from "./SearchBar.variants";

export interface Suggestion {
	id: string;
	label: string;
	// Extra metadata (accountNumber, clientId, etc.)
	[key: string]: unknown;
}

export interface SearchBarProps extends VariantProps<typeof searchBarVariants> {
	/** Called when the user confirms a search (presses Enter or clicks search) */
	onSearch?: (value: string) => void;
	/** Controls whether the clear button is shown when there's a value */
	showClear?: boolean;
	/** Placeholder text for the input */
	placeholder?: string;
	/** Optional clear callback */
	onClear?: () => void;
	/** Optional suggestion provider (async) */
	suggestionProvider?: (
		q: string,
		signal?: AbortSignal,
	) => Promise<Suggestion[]>;
	/** Optional client-side suggestions array */
	suggestions?: Suggestion[];
	/** Minimum characters before suggestions appear (default: 2) */
	minChars?: number;
	/** Debounce time for suggestions in ms (default: 250) */
	debounceMs?: number;
	/** Max number of suggestions to show (default: 8) */
	maxSuggestions?: number;
	/** Called when a suggestion is selected */
	onSuggestionSelect?: (s: Suggestion) => void;
	/** Optional class name for styling */
	className?: string;
	/** Whether the search is currently loading */
	isLoading?: boolean;
	/** Whether to show a search button (for withButton variant) */
	showSearchButton?: boolean;
}

export interface SearchBarViewProps extends SearchBarProps {
	/** The current input value */
	inputValue: string;
	/** The items to show in the dropdown */
	items: Suggestion[];
	/** Combobox utility props */
	comboboxProps: {
		isOpen: boolean;
		highlightedIndex: number;
		getInputProps: UseComboboxReturnValue<Suggestion>["getInputProps"];
		getItemProps: UseComboboxReturnValue<Suggestion>["getItemProps"];
		getMenuProps: UseComboboxReturnValue<Suggestion>["getMenuProps"];
	};
	/** Called when the search button is clicked (for withButton variant) */
	onSearch?: (value: string) => void;
}
