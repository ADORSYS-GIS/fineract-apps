import type { VariantProps } from "class-variance-authority";
import { searchBarVariants } from "./SearchBar.styles";

export interface Suggestion {
	id: string;
	label: string;
}

export interface SearchBarProps extends VariantProps<typeof searchBarVariants> {
	// Core functionality
	onSearch?: (value: string) => void;
	placeholder?: string;
	className?: string;

	// Suggestions
	suggestions?: Suggestion[];
	suggestionProvider?: (
		query: string,
		signal?: AbortSignal,
	) => Promise<Suggestion[]>;
	onSuggestionSelect?: (suggestion: Suggestion) => void;

	// UI states
	isLoading?: boolean;
	showClear?: boolean;
	showSearchButton?: boolean;

	// Configuration
	minChars?: number;
	debounceMs?: number;
	maxSuggestions?: number;
}
