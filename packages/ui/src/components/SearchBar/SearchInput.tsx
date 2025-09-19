import type { VariantProps } from "class-variance-authority";
import { Loader2, Search, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { searchBarVariants } from "./SearchBar.styles";

interface SearchInputProps extends VariantProps<typeof searchBarVariants> {
	inputProps: InputHTMLAttributes<HTMLInputElement>;
	showLoader: boolean;
	showClearButton: boolean;
	showSearchButton: boolean;
	disabled?: boolean;
	onClear: () => void;
	onSearchClick: () => void;
}

export function SearchInput({
	size = "md",
	inputProps,
	showLoader,
	showClearButton,
	showSearchButton,
	disabled,
	onClear,
	onSearchClick,
}: Readonly<SearchInputProps>) {
	return (
		<div className={searchBarVariants({ size })}>
			<Search className="h-4 w-4 text-muted-foreground" />
			<input
				{...inputProps}
				className={`flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground ${inputProps.className ?? ""}`}
			/>
			{showLoader && (
				<Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
			)}
			{showClearButton && (
				<button
					type="button"
					onClick={onClear}
					className="p-1 hover:bg-accent rounded transition-colors"
					aria-label="Clear input"
				>
					<X className="h-3 w-3" />
				</button>
			)}
			{showSearchButton && (
				<button
					type="button"
					onClick={onSearchClick}
					disabled={disabled}
					className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
				>
					Search
				</button>
			)}
		</div>
	);
}
