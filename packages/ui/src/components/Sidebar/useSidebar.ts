// useSidebar.ts
import { useState } from "react";
import { MenuItem } from "./Sidebar.types";

export const useSidebar = (menuItems: MenuItem[] = []) => {
	const [activeLink, setActiveLink] = useState<string | null>(
		menuItems.length > 0 ? menuItems[0].link : null,
	);

	const handleClick = (link: string) => setActiveLink(link);

	return { activeLink, handleClick };
};
