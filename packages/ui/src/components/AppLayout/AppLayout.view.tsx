import React, { useEffect, useState } from "react";
import { Button } from "../Button";
import { NavbarProps } from "../Navbar/Navbar.types";
import { SidebarProvider } from "../Sidebar/Sidebar.context";
import { SidebarProps } from "../Sidebar/Sidebar.types";
import { AppLayoutProps } from "./AppLayout.types";

// Clean, single AppLayout implementation
export const AppLayoutView = React.forwardRef<HTMLDivElement, AppLayoutProps>(
	({ children, navbar, sidebar }, ref) => {
		// Detect desktop vs mobile and keep sidebar open on desktop
		const [isDesktop, setIsDesktop] = useState<boolean>(() =>
			typeof window !== "undefined" && typeof window.matchMedia === "function"
				? window.matchMedia("(min-width: 768px)").matches
				: true,
		);

		const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
			() => isDesktop,
		);

		useEffect(() => {
			if (
				typeof window === "undefined" ||
				typeof window.matchMedia !== "function"
			) {
				// matchMedia not available (node/jest). Default to desktop behavior.
				setIsDesktop(true);
				setIsSidebarOpen(true);
				return;
			}
			const mq = window.matchMedia("(min-width: 768px)");

			const onChange = (e: MediaQueryListEvent) => {
				setIsDesktop(e.matches);
				setIsSidebarOpen(e.matches); // auto-open on desktop
			};

			// initialize
			setIsDesktop(mq.matches);
			setIsSidebarOpen(mq.matches);

			if (mq.addEventListener) {
				mq.addEventListener("change", onChange as EventListener);
				return () =>
					mq.removeEventListener("change", onChange as EventListener);
			}

			// legacy fallback for safari
			if (mq.addListener) {
				mq.addListener(onChange);
				return () => mq.removeListener(onChange);
			}
		}, []);

		const toggleSidebar = () => setIsSidebarOpen((v) => !v);

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
					{/* Overlay for mobile when sidebar is open */}
					{isSidebarOpen && !isDesktop && (
						<Button
							variant="ghost"
							className="fixed inset-0 z-20 h-full w-full bg-black/50 md:hidden"
							onClick={toggleSidebar}
							aria-label="Close sidebar"
						/>
					)}

					{/* Sidebar panel */}
					<div
						className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out ${
							isSidebarVisible ? "translate-x-0" : "-translate-x-full"
						} md:translate-x-0`}
					>
						{sidebar}
					</div>

					{/* Main content area */}
					<div className="flex flex-1 flex-col md:ml-64">
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
