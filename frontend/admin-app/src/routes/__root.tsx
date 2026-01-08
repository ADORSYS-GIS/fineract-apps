import { AuthenticationHttpBasicService } from "@fineract-apps/fineract-api";
import {
	AppLayout,
	Button,
	logout,
	menuAdmin,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bell, UserCircle } from "lucide-react";
import { useEffect } from "react";

import { useTranslation } from "react-i18next";
import { ToastContainer, ToastProvider } from "@/components/Toast";
import { configureApi } from "@/services/api";

function RootLayout() {
	configureApi();
	const handleLogout = () => {
		if (import.meta.env.VITE_AUTH_MODE === "basic") {
			const base = import.meta.env.BASE_URL || "/";
			const appBase = base.endsWith("/") ? base : `${base}/`;
			window.location.href = appBase;
		} else {
			logout();
		}
	};
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

	const handleLogout = () => logout();
	const { t } = useTranslation();

	return (
		<ToastProvider>
			<AppLayout
				sidebar={<Sidebar menuItems={menuAdmin} onLogout={handleLogout} />}
				navbar={
					<Navbar
						logo={
							<h1 className="text-lg font-bold">
								{t("welcome")}, {authData?.staffDisplayName}
							</h1>
						}
						links={null}
						notifications={<Bell />}
						userSection={
							<div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
								<UserCircle className="w-5 h-5 text-gray-600" />
							</div>
						}
						actions={<Button onClick={handleLogout}>Logout</Button>}
						onToggleMenu={() => {
							/* noop */
						}}
						isMenuOpen={false}
						variant="primary"
						size="md"
					/>
				}
			>
				<Outlet />
				<ToastContainer />
				<TanStackRouterDevtools />
			</AppLayout>
		</ToastProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
