import { LucideIcon } from "lucide-react";
import React from "react";

export interface MenuItem {
	name: string;
	link: string;
	icon?: LucideIcon;
}

export interface SidebarProps {
	menuItems: MenuItem[];
	onLogout?: () => void;
	className?: string;
}
