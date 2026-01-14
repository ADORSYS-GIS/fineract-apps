import { AuthenticationHttpBasicService } from "@fineract-apps/fineract-api";
import {
	AppLayout,
	Footer,
	menuBranchManager,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import {
	createRootRoute,
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

function onLogout() {
	const base = import.meta.env.BASE_URL ?? "/branch/";
	const appBase = base.endsWith("/") ? base : `${base}/`;
	const redirectTo = `${globalThis.location.origin}${appBase}`;
	if (import.meta.env.VITE_AUTH_MODE === "basic") {
		// For basic auth, just redirect to the base, as there's no real logout endpoint
		window.location.href = appBase;
	} else {
		// The existing logic is for OAuth
		globalThis.location.href = `${appBase}callback?logout=${encodeURIComponent(
			redirectTo,
		)}`;
	}
}

function RootLayout() {
	configureApi();
	const { t } = useTranslation();
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
	});
	useEffect(() => {
		if (authData) {
			sessionStorage.setItem("auth", JSON.stringify(authData));
		}
	}, [authData]);
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	return (
		<>
			<AppLayout
				sidebar={
					<Sidebar
						logo={
							<h1 className="text-lg font-bold">{t("branchManager.logo")}</h1>
						}
						menuItems={menuBranchManager}
						activePath={currentPath}
						onNavigate={(to) => navigate({ to })}
						onLogout={onLogout}
					/>
				}
				navbar={
					<Navbar
						logo={
							<h1 className="text-lg font-bold">
								{t("welcome")}, {authData?.staffDisplayName}
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
			</AppLayout>
			<Footer />
		</>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
