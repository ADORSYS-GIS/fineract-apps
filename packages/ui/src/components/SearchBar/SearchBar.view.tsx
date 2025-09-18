import { Loader2, Search, X } from "lucide-react";
import { cn } from "../../lib/utils";
import {
	buttonVariants,
	inputVariants,
	searchBarVariants,
} from "./SearchBar.styles";
import type { SearchBarProps, Suggestion } from "./SearchBar.types";

interface SearchBarViewProps extends SearchBarProps {
	inputValue: string;
	handleSearch: () => void;
	handleClear: () => void;
	isOpen: boolean;
	items: Suggestion[];
	getMenuProps: () => Record<string, unknown>;
	getInputProps: () => Record<string, unknown>;
	getItemProps: (options: {
		item: Suggestion;
		index: number;
	}) => Record<string, unknown>;
	highlightedIndex: number;
}

export function SearchBarView({
	variant = "default",
	size = "md",
	className,
	placeholder = "Search...",
	showClear = true,
	showSearchButton = false,
	isLoading = false,
	inputValue,
	handleSearch,
	handleClear,
	isOpen,
	items,
	getMenuProps,
	getInputProps,
	getItemProps,
	highlightedIndex,
}: Readonly<SearchBarViewProps>) {
	const showButton = variant === "withButton" || showSearchButton;

	return (
		<div className="relative w-full">
			{/* Input Container */}
			<div className={cn(searchBarVariants({ variant, size }), className)}>
				<Search className="ml-3 h-4 w-4 text-gray-400 flex-shrink-0" />

				<input
					{...getInputProps()}
					placeholder={placeholder}
					className={cn(inputVariants({ size }))}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleSearch();
						}
					}}
				/>

				{/* Loading/Clear/Search Button */}
				<div className="flex items-center">
					{isLoading && (
						<Loader2
							className="mr-2 h-4 w-4 animate-spin text-gray-400"
							data-testid="loading-spinner"
						/>
					)}

					{!isLoading && showClear && inputValue && (
						<button
							type="button"
							onClick={handleClear}
							className="mr-2 p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
							aria-label="Clear search"
						>
							<X className="h-3 w-3 text-gray-400" />
						</button>
					)}

					{showButton && (
						<button
							type="button"
							onClick={handleSearch}
							className={cn(buttonVariants({ size }))}
							aria-label="Search"
						>
							<Search className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>

			{/* Suggestions Dropdown */}
			<ul
				{...getMenuProps()}
				className={cn(
					"absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto",
					!(isOpen && items.length > 0) && "hidden",
				)}
			>
				{isOpen &&
					items.length > 0 &&
					items.map((item, index) => (
						<li
							key={item.id}
							{...getItemProps({ item, index })}
							className={cn(
								"px-4 py-3 cursor-pointer text-sm transition-colors border-b border-gray-100 last:border-b-0",
								highlightedIndex === index
									? "bg-blue-50 text-blue-900"
									: "hover:bg-gray-50",
							)}
						>
							{item.label}
						</li>
					))}
			</ul>
		</div>
	);
}
