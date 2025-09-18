import React from "react";
import { SidebarProps } from "./Sidebar.types";
import { SidebarView } from "./Sidebar.view";

export const Sidebar: React.FC<SidebarProps> = (props) => {
	return <SidebarView {...props} />;
};

Sidebar.displayName = "Sidebar";
