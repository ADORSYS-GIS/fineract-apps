import {
	AppLayout,
	Button,
	menuAssetManager,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
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
import { AuthGuard } from "@/components/AuthGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { configureApi } from "@/services/api";

export const Route = createRootRouteWithContext()({
	component: RootLayout,
});

function RootLayout() {
	configureApi();
	const { onLogout, userData } = useAuth();
	const navigate = useNavigate();
	const { location } = useRouterState();

	const { t } = useTranslation();

	// Don't render the layout on the login page
	if (location.pathname === "/login") {
		return (
			<>
				<Outlet />
				<TanStackRouterDevtools />
			</>
		);
	}
	return (
		<>
			<Toaster position="top-right" />
			<AppLayout
				sidebar={
					<Sidebar
						logo={<h1 className="text-lg font-bold">Asset Manager</h1>}
						menuItems={menuAssetManager}
						onLogout={onLogout}
						onNavigate={(to: string) => navigate({ to })}
						activePath={location.pathname}
					/>
				}
				navbar={
					<Navbar
						logo={
							<h1 className="text-lg font-bold">
								{t("welcome")}, {userData?.displayName}
							</h1>
						}
						links={null}
						notifications={<Bell />}
						userSection={
							<div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
								<UserCircle className="w-5 h-5 text-gray-600" />
							</div>
						}
						actions={<Button onClick={onLogout}>Logout</Button>}
						onToggleMenu={() => {
							/* noop */
						}}
						isMenuOpen={false}
						variant="primary"
						size="md"
					/>
				}
			>
				<ErrorBoundary>
					<AuthGuard>
						<Outlet />
					</AuthGuard>
				</ErrorBoundary>
				<TanStackRouterDevtools />
			</AppLayout>
		</>
	);
}
