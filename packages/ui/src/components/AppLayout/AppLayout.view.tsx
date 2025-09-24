import React, { useState } from "react";
import { Button } from "../Button";
import { NavbarProps } from "../Navbar/Navbar.types";
import { AppLayoutProps } from "./AppLayout.types";

export const AppLayoutView = React.forwardRef<HTMLDivElement, AppLayoutProps>(
	({ children, navbar, sidebar }, ref) => {
		const [isSidebarOpen, setIsSidebarOpen] = useState(false);

		const toggleSidebar = () => {
			setIsSidebarOpen(!isSidebarOpen);
		};

		return (
			<div ref={ref} className="flex h-screen bg-gray-100">
				{isSidebarOpen && (
					<Button
						variant="ghost"
						className="fixed inset-0 z-10 h-full w-full bg-black opacity-50 md:hidden"
						onClick={toggleSidebar}
						aria-label="Close sidebar"
					/>
				)}
				<div
					className={`fixed inset-y-0 left-0 z-20 w-64 transform transition-transform md:relative md:translate-x-0 ${
						isSidebarOpen ? "translate-x-0" : "-translate-x-full"
					} md:flex`}
				>
					{sidebar}
				</div>
				<div className="flex-1 flex flex-col overflow-hidden">
					{React.isValidElement(navbar) &&
						React.cloneElement(navbar as React.ReactElement<NavbarProps>, {
							onToggleMenu: toggleSidebar,
							isMenuOpen: isSidebarOpen,
						})}
					<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
						{children}
					</main>
				</div>
			</div>
		);
	},
);

AppLayoutView.displayName = "AppLayoutView";
