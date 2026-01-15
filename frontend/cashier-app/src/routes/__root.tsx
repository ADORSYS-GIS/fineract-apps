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
	function onLogout() {
		const base = import.meta.env.BASE_URL || "/cashier/";
		const appBase = base.endsWith("/") ? base : `${base}/`;
		const redirectTo = `${window.location.origin}${appBase}`;
		if (import.meta.env.VITE_AUTH_MODE === "basic") {
			// For basic auth, just redirect to the base, as there's no real logout endpoint
			window.location.href = appBase;
		} else {
			// The existing logic is for OAuth
			window.location.href = `${appBase}callback?logout=${encodeURIComponent(
				redirectTo,
			)}`;
		}
	}
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
							Welcome, {authData?.staffDisplayName}
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
