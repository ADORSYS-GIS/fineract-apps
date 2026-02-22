import { AuthenticationHttpBasicService } from "@fineract-apps/fineract-api";
import { AppLayout, menuCashier, Navbar, Sidebar } from "@fineract-apps/ui";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { UserCircle } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { NotificationBell } from "@/components/NotificationBell";
import { configureApi } from "@/services/api";

export interface MyRouterContext {
	queryClient: QueryClient;
}

function RootLayout() {
	configureApi();
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	const authMode = import.meta.env.VITE_AUTH_MODE || "basic";

	function onLogout() {
		if (import.meta.env.VITE_AUTH_MODE === "basic") {
			window.location.href = "/home/";
		} else {
			localStorage.clear();
			sessionStorage.clear();
			window.location.href = "/oauth2/sign_out?rd=/logout";
		}
	}

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

	const { t } = useTranslation();

	const transformedMenu = menuCashier.map((item) =>
		item.name === "Loan Repayment" ? { ...item, name: "loanRepayment" } : item,
	);

	return (
		<AppLayout
			sidebar={
				<Sidebar
					logo={<h1 className="text-lg font-bold">Cashier</h1>}
					menuItems={transformedMenu}
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
					notifications={<NotificationBell />}
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

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootLayout,
});
