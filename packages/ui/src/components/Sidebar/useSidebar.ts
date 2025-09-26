// useSidebar.ts
import { useEffect, useState } from "react";
import { MenuItem } from "./Sidebar.types";

export const useSidebar = (
	menuItems: MenuItem[] = [],
	activePath?: string | null,
) => {
	const [activeLink, setActiveLink] = useState<string | null>(
		activePath ?? (menuItems.length > 0 ? menuItems[0].link : null),
	);

	useEffect(() => {
		if (activePath) setActiveLink(activePath);
	}, [activePath]);

	const handleClick = (link: string) => setActiveLink(link);

	return { activeLink, handleClick };
};
