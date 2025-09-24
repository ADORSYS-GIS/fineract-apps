import React from "react";

export interface DashboardViewProps {
	readonly onToggleMenu?: () => void;
	readonly isMenuOpen?: boolean;
	readonly onLogout: () => void;
	readonly query: string;
	readonly onQueryChange: (query: string) => void;
	readonly isDropdownOpen: boolean;
	readonly toggleDropdown: () => void;
	readonly dropdownRef: React.Ref<HTMLDivElement>;
}
