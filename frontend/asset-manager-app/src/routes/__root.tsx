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
	useLocation,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bell, Moon, Sun, UserCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { AuthGuard } from "@/components/AuthGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { useDarkMode } from "@/hooks/useDarkMode";
import { configureApi } from "@/services/api";

export const Route = createRootRouteWithContext()({
	component: RootLayout,
});

function RootLayout() {
	configureApi();
	const { onLogout, userData } = useAuth();
	const { isDark, toggle: toggleDarkMode } = useDarkMode();
	const navigate = useNavigate();
	const { location } = useRouterState();

	const { t } = useTranslation();
	const currentLocation = useLocation();

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
						notifications={
							<div className="flex items-center gap-2">
								<button
									onClick={toggleDarkMode}
									className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
									aria-label="Toggle dark mode"
								>
									{isDark ? (
										<Sun className="w-5 h-5" />
									) : (
										<Moon className="w-5 h-5" />
									)}
								</button>
								<Bell aria-label="Notifications" />
							</div>
						}
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
				<ErrorBoundary key={currentLocation.pathname}>
					<AuthGuard>
						<Outlet />
					</AuthGuard>
				</ErrorBoundary>
				<TanStackRouterDevtools />
			</AppLayout>
		</>
	);
}
