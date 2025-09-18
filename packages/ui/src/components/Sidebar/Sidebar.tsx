import React from "react";
import { SidebarProps } from "./Sidebar.types";
import { SidebarView } from "./Sidebar.view";
import { useSidebar } from "./useSidebar";

export const Sidebar: React.FC<SidebarProps> = ({
	menuItems = [],
	...rest
}) => {
	const { activeLink, handleClick } = useSidebar(menuItems);

	return (
		<SidebarView
			menuItems={menuItems}
			activeLink={activeLink}
			handleClick={handleClick}
			{...rest}
		/>
	);
};

Sidebar.displayName = "Sidebar";
