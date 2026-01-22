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
import { useTranslation } from "react-i18next";
import { configureApi } from "@/services/api";

export interface MyRouterContext {
	queryClient: QueryClient;
}

import { type UserRole, useAuth } from "@/contexts/AuthContext";

function RootComponent() {
	configureApi();
	const { user, roles, isLoading, hasAnyRole } = useAuth();
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	// Use Keycloak roles (first role for display/filtering purposes)
	const userRole = roles[0];

	const { t } = useTranslation();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	// Check authorization using Keycloak roles
	const authorizedRoles: UserRole[] = [
		"accountant",
		"supervisor-accountant",
		"super-user",
	];

	if (!hasAnyRole(authorizedRoles)) {
		return (
			<div className="flex items-center justify-center h-screen">
				<h1 className="text-2xl font-bold">Unauthorized Access</h1>
				<p className="text-gray-600 mt-2">
					Your role ({roles.join(", ") || "none"}) does not have access to this
					application.
				</p>
			</div>
		);
	}

	const filteredMenu = menuAccounting.filter((item) => {
		if (userRole === "accountant") {
			return item.name !== "approval_queue";
		}
		if (userRole === "supervisor-accountant") {
			return item.name !== "create_entry";
		}
		return true;
	});

	function onLogout() {
		const base = import.meta.env.BASE_URL || "/accounting/";
		const appBase = base.endsWith("/") ? base : `${base}/`;
		const redirectTo = `${window.location.origin}${appBase}`;

		if (import.meta.env.VITE_AUTH_MODE === "basic") {
			window.location.href = appBase;
		} else {
			// OAuth mode: Use OAuth2 Proxy global logout
			// This terminates the Keycloak session across ALL devices
			localStorage.clear();
			sessionStorage.clear();
			window.location.href = `/oauth2/sign_out?rd=${encodeURIComponent(redirectTo)}`;
		}
	}

	return (
		<AppLayout
			sidebar={
				<Sidebar
					logo={<h1 className="text-lg font-bold">Accounting App</h1>}
					menuItems={filteredMenu}
					activePath={currentPath}
					onNavigate={(to: string) => navigate({ to })}
					onLogout={onLogout}
				/>
			}
			navbar={
				<Navbar
					logo={
						<h1 className="text-lg font-bold">
							{t("welcome")}, {user?.user || "User"}
						</h1>
					}
					links={null}
					notifications={<Bell />}
					userSection={
						<div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
							<UserCircle className="w-5 h-5 text-gray-600" />
						</div>
					}
					variant="primary"
					size="md"
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

import { AuthProvider } from "@/contexts/AuthContext";

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<AuthProvider>
			<RootComponent />
		</AuthProvider>
	),
});
