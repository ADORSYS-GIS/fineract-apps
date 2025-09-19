import type {
	UseComboboxGetItemPropsOptions,
	UseComboboxGetMenuPropsOptions,
} from "downshift";
import type { Suggestion } from "./SearchBar.types";

export type GetItemProps = (
	options: UseComboboxGetItemPropsOptions<Suggestion>,
) => Record<string, unknown>;
export type GetMenuProps = (
	options?: UseComboboxGetMenuPropsOptions,
	otherOptions?: Record<string, unknown>,
) => Record<string, unknown>;
