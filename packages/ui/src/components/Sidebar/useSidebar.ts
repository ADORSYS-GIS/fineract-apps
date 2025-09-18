import { useState } from "react";
import { MenuItem } from "./Sidebar.types";

export type UseSidebarReturn = {
	activeLink: string | null;
	handleClick: (link: string) => void;
};

export const useSidebar = (menuItems: MenuItem[] = []): UseSidebarReturn => {
	const [activeLink, setActiveLink] = useState<string | null>(
		menuItems.length > 0 ? menuItems[0].link : null,
	);

	const handleClick = (link: string) => setActiveLink(link);

	return { activeLink, handleClick };
};
