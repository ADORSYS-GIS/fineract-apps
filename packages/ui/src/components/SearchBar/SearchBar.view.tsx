import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { SearchBarViewProps } from "./SearchBar.types";
import { searchBarVariants } from "./SearchBar.variants";

export const SearchBarView = forwardRef<HTMLInputElement, SearchBarViewProps>(
	(
		{
			className = "",
			placeholder = "Search",
			showClear = true,
			onClear,
			items,
			isLoading,
			inputValue,
			variant,
			size,
			showSearchButton,
			onSearch,
			comboboxProps,
		},
		ref,
	) => {
		const handleSearchClick = () => {
			if (onSearch) onSearch(inputValue);
		};

		return (
			<div className={cn("relative", className)}>
				<div
					className={cn(
						searchBarVariants({ variant, size }),
						"focus-within:ring-2 focus-within:ring-primary/20",
					)}
				>
					{/* Search Icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={cn(
							"text-gray-400",
							size === "sm" ? "h-4 w-4" : "h-5 w-5",
							size === "lg" ? "h-6 w-6" : "",
							variant === "expandable" ? "mr-0" : "mr-2",
						)}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-4.35-4.35"
						/>
						<circle
							cx="11"
							cy="11"
							r="6"
							stroke="currentColor"
							strokeWidth={2}
							fill="none"
						/>
					</svg>

					{/* Input */}
					<input
						{...comboboxProps.getInputProps({
							ref,
							placeholder,
							"aria-label": placeholder,
							className: cn(
								"flex-1 bg-transparent outline-none placeholder-gray-400",
								variant === "expandable" ? "w-0 focus:w-full pl-2" : "w-full",
								"transition-all duration-200",
							),
						})}
					/>

					{/* Loading Spinner */}
					{isLoading && (
						<div className="ml-2 animate-spin text-gray-400">
							<svg
								className={cn(
									size === "sm" ? "h-3 w-3" : "h-4 w-4",
									size === "lg" ? "h-5 w-5" : "",
								)}
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
						</div>
					)}

					{/* Clear Button */}
					{showClear && inputValue && (
						<button
							type="button"
							aria-label="clear search"
							className={cn(
								"ml-2 text-gray-500 hover:text-gray-700",
								size === "sm" ? "text-sm" : "text-base",
								size === "lg" ? "text-lg" : "",
							)}
							onClick={onClear}
						>
							✕
						</button>
					)}

					{/* Search Button */}
					{showSearchButton && variant === "withButton" && (
						<button
							type="button"
							aria-label="search"
							onClick={handleSearchClick}
							className={cn(
								"ml-2 px-4 py-2 bg-primary text-primary-foreground rounded-md",
								"hover:bg-primary/90 transition-colors duration-200",
								size === "sm" ? "text-sm" : "text-base",
								size === "lg" ? "text-lg" : "",
							)}
						>
							Search
						</button>
					)}
				</div>

				{/* Suggestions Dropdown */}
				<ul
					{...comboboxProps.getMenuProps()}
					className={cn(
						"absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg",
						"overflow-auto z-50 border border-border",
						size === "sm" ? "max-h-60" : "max-h-72",
						size === "lg" ? "max-h-80" : "",
						!comboboxProps.isOpen && "hidden",
					)}
				>
					{comboboxProps.isOpen &&
						items.map((item, index) => (
							<li
								key={item.id}
								{...comboboxProps.getItemProps({
									item,
									index,
									className: cn(
										"px-3 py-2 cursor-pointer transition-colors duration-150",
										comboboxProps.highlightedIndex === index
											? "bg-accent text-accent-foreground"
											: "hover:bg-accent/50",
									),
								})}
							>
								<div className="md:flex md:justify-between md:items-center">
									<div
										className={cn(
											"font-medium",
											size === "sm" ? "text-sm" : "text-base",
											size === "lg" ? "text-lg" : "",
										)}
									>
										{item.label}
									</div>
									{item.id && (
										<div
											className={cn(
												"text-muted-foreground",
												size === "sm" ? "text-xs" : "text-sm",
												size === "lg" ? "text-base" : "",
												"md:ml-4",
											)}
										>
											{item.id}
										</div>
									)}
								</div>
							</li>
						))}
				</ul>
			</div>
		);
	},
);

SearchBarView.displayName = "SearchBarView";
