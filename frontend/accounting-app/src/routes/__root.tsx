import { AppLayout, menuAccounting, Navbar, Sidebar } from "@fineract-apps/ui";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bell, UserCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import { useState } from "react";

export interface MyRouterContext {
	queryClient: QueryClient;
}

function onLogout() {
	const base = import.meta.env.BASE_URL ?? "/accounting/";
	const appBase = base.endsWith("/") ? base : `${base}/`;
	const redirectTo = `${globalThis.location.origin}${appBase}`;
	globalThis.location.href = `${appBase}callback?logout=${encodeURIComponent(
		redirectTo,
	)}`;
}

function RootComponent() {
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	const { isLoading, isAuthenticated } = useAuth();
	const { canAccessApp, canCreateJournalEntry, canViewApprovalQueue } =
		usePermissions();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading session...
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="flex items-center justify-center h-screen">
				Authentication failed. Please check your credentials or login.
			</div>
		);
	}

	if (!canAccessApp) {
		return (
			<div className="flex items-center justify-center h-screen">
				You do not have the required permissions to access this application.
			</div>
		);
	}

	return (
		<AppLayout
			isMenuOpen={isMenuOpen}
			sidebar={
				<Sidebar
					logo={<h1 className="text-lg font-bold">Accounting App</h1>}
					menuItems={menuAccounting.filter((item) => {
						if (item.name === "Create Entry") return canCreateJournalEntry;
						if (item.name === "Approval Queue") return canViewApprovalQueue;
						return true;
					})}
					activePath={currentPath}
					onNavigate={(to) => navigate({ to })}
					onLogout={onLogout}
				/>
			}
			navbar={
				<Navbar
					logo={<h1 className="text-lg font-bold">Accounting App</h1>}
					links={null}
					notifications={<Bell />}
					userSection={
						<div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
							<UserCircle className="w-5 h-5 text-gray-600" />
						</div>
					}
					variant="primary"
					size="md"
					isMenuOpen={isMenuOpen}
					onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
				/>
			}
		>
			<Outlet />
			<Toaster />
			<TanStackRouterDevtools />
			<ReactQueryDevtools />
		</AppLayout>
	);
}

function AppWrapper() {
	return (
		<AuthProvider>
			<RootComponent />
		</AuthProvider>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: AppWrapper,
});
