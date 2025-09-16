import React from "react";
import { SidebarProps } from "./Sidebar.types";
import { SidebarView } from "./Sidebar.view";
import { useSidebar } from "./useSidebar";

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const hookProps = useSidebar();
  return <SidebarView {...props} {...hookProps} />;
};

Sidebar.displayName = "Sidebar";
