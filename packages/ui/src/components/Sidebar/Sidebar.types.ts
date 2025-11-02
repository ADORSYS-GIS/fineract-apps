import { LucideIcon } from "lucide-react";
import React from "react";

export interface MenuItem {
	name: string;
	title?: string;
	link: string;
	icon?: LucideIcon;
}

export interface SidebarProps {
	logo?: React.ReactNode;
	menuItems: MenuItem[];
	onLogout?: () => void;
	className?: string;
	/** Optional current path to control active highlighting */
	activePath?: string;
	/** Optional navigation handler to use SPA navigation */
	onNavigate?: (to: string) => void;
}
