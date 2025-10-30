import React from "react";
import { SidebarProps } from "./Sidebar.types";
import { SidebarView } from "./Sidebar.view";
import { useSidebar } from "./useSidebar";

export const Sidebar: React.FC<SidebarProps> = ({
	logo,
	menuItems = [],
	onNavigate,
	...rest
}) => {
	const { activeLink, handleClick } = useSidebar();

	return (
		<SidebarView
			logo={logo}
			menuItems={menuItems}
			activeLink={activeLink}
			handleClick={handleClick}
			onNavigate={onNavigate}
			{...rest}
		/>
	);
};

Sidebar.displayName = "Sidebar";
