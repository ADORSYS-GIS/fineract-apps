import React from "react";
import { SidebarProps } from "./Sidebar.types";
import { SidebarView } from "./Sidebar.view";
import { useSidebar } from "./useSidebar";

export const Sidebar: React.FC<SidebarProps> = ({
	logo,
	menuItems = [],
	...rest
}) => {
	const { activeLink, handleClick } = useSidebar(menuItems);

	return (
		<SidebarView
			logo={logo}
			menuItems={menuItems}
			activeLink={activeLink}
			handleClick={handleClick}
			{...rest}
		/>
	);
};

Sidebar.displayName = "Sidebar";
