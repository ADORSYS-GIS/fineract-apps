import type { VariantProps } from "class-variance-authority";
import { SearchBarVariants } from "./SearchBar.styles";

/**
 * Props for SearchBar component
 */
export interface SearchBarProps extends VariantProps<typeof SearchBarVariants> {
	/** Current search value (controlled) */
	value?: string;
	/** Callback when search value changes */
	onValueChange?: (value: string) => void;
	/** Callback when search is executed (Enter key or search button) */
	onSearch?: (value: string) => void;
	/** Input placeholder text */
	placeholder?: string;
	/** Additional CSS classes */
	className?: string;
	/** Whether the input is disabled */
	disabled?: boolean;
	/** Loading state (external) */
	isLoading?: boolean;
	/** Whether to show clear button */
	showClear?: boolean;
}
