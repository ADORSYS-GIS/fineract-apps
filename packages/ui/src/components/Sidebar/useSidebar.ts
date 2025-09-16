// useSidebar.ts
import { useState } from "react";
import { MenuItem } from "./Sidebar.types";

export const useSidebar = (menuItems: MenuItem[]) => {
	const [activeLink, setActiveLink] = useState<string | null>(null);

	const handleClick = (link: string) => {
		setActiveLink(link);
	};

	return { menuItems, activeLink, handleClick };
};
