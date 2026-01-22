import { AuthenticationHttpBasicService } from "@fineract-apps/fineract-api";
import { AppLayout, menuReporting, Navbar, Sidebar } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import {
	createRootRoute,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bell, UserCircle } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

function onLogout() {
	const base = import.meta.env.BASE_URL ?? "/reporting/";
	const appBase = base.endsWith("/") ? base : `${base}/`;
	const redirectTo = `${globalThis.location.origin}${appBase}`;
	if (import.meta.env.VITE_AUTH_MODE === "basic") {
		// For basic auth, just redirect to the base, as there's no real logout endpoint
		window.location.href = appBase;
	} else {
		// OAuth mode: Use OAuth2 Proxy global logout
		// This terminates the Keycloak session across ALL devices
		localStorage.clear();
		sessionStorage.clear();
		globalThis.location.href = `/oauth2/sign_out?rd=${encodeURIComponent(redirectTo)}`;
	}
}

function RootLayout() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	const authMode = import.meta.env.VITE_AUTH_MODE || "basic";

	// Fineract authentication (basic auth mode)
	const { data: authData } = useQuery({
		queryKey: ["authentication"],
		queryFn: () =>
			AuthenticationHttpBasicService.postV1Authentication({
				requestBody: {
					username: import.meta.env.VITE_FINERACT_USERNAME,
					password: import.meta.env.VITE_FINERACT_PASSWORD,
				},
			}),
		staleTime: Infinity,
		enabled: authMode === "basic",
	});

	// Keycloak userinfo (OAuth mode)
	const { data: keycloakUser } = useQuery<{
		user: string;
		email: string;
		roles: string;
	}>({
		queryKey: ["keycloak-userinfo"],
		queryFn: async () => {
			const baseUrl = import.meta.env.BASE_URL || "/";
			const apiPath = `${baseUrl}api/userinfo`.replace("//", "/");
			const response = await fetch(apiPath);
			if (!response.ok) {
				throw new Error("Failed to fetch user info");
			}
			return response.json();
		},
		staleTime: Infinity,
		retry: 1,
		enabled: authMode === "oauth",
	});

	// Determine display name based on auth mode
	const displayName =
		authMode === "oauth" ? keycloakUser?.user : authData?.username;

	useEffect(() => {
		if (authData) {
			sessionStorage.setItem("auth", JSON.stringify(authData));
		} else if (keycloakUser) {
			sessionStorage.setItem("auth", JSON.stringify(keycloakUser));
		}
	}, [authData, keycloakUser]);
	return (
		<AppLayout
			sidebar={
				<Sidebar
					logo={<h1 className="text-lg font-bold">Reporting</h1>}
					menuItems={menuReporting}
					activePath={currentPath}
					onNavigate={(to) => navigate({ to })}
					onLogout={onLogout}
				/>
			}
			navbar={
				<Navbar
					logo={
						<h1 className="text-lg font-bold">
							{t("welcome")}, {displayName || "User"}
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
		</AppLayout>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
