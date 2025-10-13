// useSidebar.ts
import { useCallback, useEffect, useState } from "react";
import { MenuItem } from "./Sidebar.types";

export const useSidebar = (
	menuItems: MenuItem[] = [],
	_activePath?: string | null,
) => {
	const storageKey = "bm_active_link";
	const getStored = () => {
		if (typeof window === "undefined") return null;
		try {
			return localStorage.getItem(storageKey);
		} catch {
			return null;
		}
	};
	const setStored = useCallback((val: string) => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(storageKey, val);
		} catch {
			/* ignore */
		}
	}, []);

	const initial =
		getStored() ?? (menuItems.length > 0 ? menuItems[0].link : null);
	const [activeLink, setActiveLink] = useState<string | null>(initial);

	// If menu structure changes and stored link is no longer valid, reset to first
	useEffect(() => {
		if (!activeLink || !menuItems.find((m) => m.link === activeLink)) {
			const fallback = menuItems[0]?.link ?? null;
			setActiveLink(fallback);
			if (fallback) setStored(fallback);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [menuItems, activeLink, setStored]);

	const handleClick = (link: string) => {
		setActiveLink(link);
		setStored(link);
	};

	return { activeLink, handleClick };
};
