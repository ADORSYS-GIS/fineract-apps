import React from "react";
import { SidebarProps } from "./Sidebar.types";
import { SidebarView } from "./Sidebar.view";
import { useSidebar } from "./useSidebar";

export const Sidebar: React.FC<SidebarProps> = (props) => {
	// ensure we always pass an array to the hook (avoid undefined)
	const menuItems = props.menuItems ?? [];
	const hookProps = useSidebar(menuItems);

	return <SidebarView {...props} {...hookProps} />;
};

Sidebar.displayName = "Sidebar";
