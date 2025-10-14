import React, { useEffect, useState } from "react";
import { Button } from "../Button";
import { NavbarProps } from "../Navbar/Navbar.types";
import { SidebarProvider } from "../Sidebar/Sidebar.context";
import { SidebarProps } from "../Sidebar/Sidebar.types";
import { AppLayoutProps } from "./AppLayout.types";

export const AppLayoutView = React.forwardRef<HTMLDivElement, AppLayoutProps>(
	({ children, navbar, sidebar }, ref) => {
		const [isSidebarOpen, setIsSidebarOpen] = useState(true);
		const [isDesktop, setIsDesktop] = useState<boolean>(() =>
			typeof window !== "undefined"
				? window.matchMedia("(min-width: 768px)").matches
				: true,
		);

		useEffect(() => {
			if (typeof window === "undefined") return;
			const mq = window.matchMedia("(min-width: 768px)");
			const onChange = (e: MediaQueryListEvent) => {
				setIsDesktop(e.matches);
				setIsSidebarOpen(e.matches); // auto-open on desktop, hide on mobile
			};
			// Initialize once in case
			setIsDesktop(mq.matches);
			setIsSidebarOpen(mq.matches);
			mq.addEventListener("change", onChange);
			return () => mq.removeEventListener("change", onChange);
		}, []);

		const toggleSidebar = () => {
			setIsSidebarOpen((v) => !v);
		};

		const isSidebarVisible = isSidebarOpen || isDesktop;
		const menuItems =
			React.isValidElement(sidebar) &&
			typeof sidebar.props === "object" &&
			sidebar.props !== null &&
			"menuItems" in sidebar.props
				? (sidebar.props as SidebarProps).menuItems
				: [];

		return (
			<SidebarProvider menuItems={menuItems}>
				<div ref={ref} className="flex h-screen bg-gray-100">
					{isSidebarOpen && !isDesktop && (
						<Button
							variant="ghost"
							className="fixed inset-0 z-10 h-full w-full bg-black opacity-50 md:hidden"
							onClick={toggleSidebar}
							aria-label="Close sidebar"
						/>
					)}
					<div
						className={`fixed inset-y-0 left-0 z-20 w-64 md:relative md:flex ${
							isSidebarVisible ? "flex" : "hidden"
						}`}
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
			</SidebarProvider>
		);
	},
);

AppLayoutView.displayName = "AppLayoutView";
