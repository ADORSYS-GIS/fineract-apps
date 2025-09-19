import type { HTMLAttributes, Ref } from "react";
import { cn } from "../../lib/utils";
import { suggestionItemVariants } from "./SearchBar.styles";
import type { Suggestion } from "./SearchBar.types";

interface SuggestionsListProps {
	menuProps: HTMLAttributes<HTMLUListElement> & { ref?: Ref<HTMLUListElement> };
	items: ReadonlyArray<Suggestion>;
	getItemProps: (options: {
		item: Suggestion;
		index: number;
	}) => HTMLAttributes<HTMLLIElement>;
	highlightedIndex: number;
	show: boolean;
}

export function SuggestionsList({
	menuProps,
	items,
	getItemProps,
	highlightedIndex,
	show,
}: Readonly<SuggestionsListProps>) {
	return (
		<ul
			{...menuProps}
			className={cn(
				"absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-popover border rounded-md shadow-lg",
				!show && "hidden",
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
	);
}
