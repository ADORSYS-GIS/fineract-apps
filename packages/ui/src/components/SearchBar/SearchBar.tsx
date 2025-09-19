import { Loader2, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import {
	expandableContainerVariants,
	SearchBarVariants,
} from "./SearchBar.styles";
import type { SearchBarProps } from "./SearchBar.types";

/**
 * SearchBar - A simple and reusable search component
 *
 * Features:
 * - Multiple variants (default, withButton, expandable)
 * - Loading states and clear functionality
 * - Responsive design
 * - Simple implementation without complex logic
 */
export function SearchBar(props: Readonly<SearchBarProps>) {
	const {
		value = "",
		onValueChange,
		onSearch,
		placeholder = "Search...",
		className,
		disabled = false,
		isLoading = false,
		showClear = true,
		variant = "default",
		size = "md",
	} = props;

	// State management
	const [expanded, setExpanded] = useState(false);

	// Event handlers
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		onValueChange?.(newValue);
	};

	const handleClear = () => {
		onValueChange?.("");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			onSearch?.(value);
			if (variant === "expandable") {
				setExpanded(false);
			}
		}
		if (e.key === "Escape" && variant === "expandable") {
			setExpanded(false);
		}
	};

	const handleSearchClick = () => {
		onSearch?.(value);
		if (variant === "expandable") {
			setExpanded(false);
		}
	};

	const handleExpandableClick = () => {
		if (variant === "expandable" && !expanded) {
			setExpanded(true);
		}
	};

	// UI state calculations
	const showClearButton = showClear && value;
	const showSearchButton = variant === "withButton";

	// Render expandable variant
	if (variant === "expandable") {
		return (
			<div className={cn("relative", className)}>
				<div className={expandableContainerVariants({ expanded })}>
					{!expanded ? (
						<button
							type="button"
							onClick={handleExpandableClick}
							disabled={disabled}
							className={cn(
								SearchBarVariants({ variant, size }),
								"cursor-pointer justify-center",
							)}
							aria-label="Open search"
						>
							<Search className="h-4 w-4 text-muted-foreground" />
						</button>
					) : (
						<div className={SearchBarVariants({ variant, size })}>
							<Search className="h-4 w-4 text-muted-foreground" />
							<input
								type="text"
								value={value}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								placeholder={placeholder}
								disabled={disabled}
								className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
								autoFocus
							/>
							{isLoading && (
								<Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
							)}
							{showClearButton && (
								<button
									type="button"
									onClick={handleClear}
									className="p-1 hover:bg-accent rounded transition-colors"
									aria-label="Clear input"
								>
									<X className="h-3 w-3" />
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}

	// Render default and withButton variants
	return (
		<div className={cn("relative w-full", className)}>
			<div className={SearchBarVariants({ variant, size })}>
				<Search className="h-4 w-4 text-muted-foreground" />
				<input
					type="text"
					value={value}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
				/>
				{isLoading && (
					<Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
				)}
				{showClearButton && (
					<button
						type="button"
						onClick={handleClear}
						className="p-1 hover:bg-accent rounded transition-colors"
						aria-label="Clear input"
					>
						<X className="h-3 w-3" />
					</button>
				)}
				{showSearchButton && (
					<button
						type="button"
						onClick={handleSearchClick}
						disabled={disabled}
						className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						Search
					</button>
				)}
			</div>
		</div>
	);
}
