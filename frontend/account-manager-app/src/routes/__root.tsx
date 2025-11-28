import {
	AppLayout,
	Button,
	menuAccountManager,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
import {
	createRootRouteWithContext,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bell, UserCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { configureApi } from "@/services/api";
import { useAuth } from "../hooks/useAuth";

export const Route = createRootRouteWithContext()({
	component: RootLayout,
});

function RootLayout() {
	configureApi();
	const { onLogout } = useAuth();
	const { location } = useRouterState();

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
				sidebar={<Sidebar menuItems={menuAccountManager} onLogout={onLogout} />}
				navbar={
					<Navbar
						logo={<h1 className="text-lg font-bold">Account Manager</h1>}
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
				<Outlet />
				<TanStackRouterDevtools />
			</AppLayout>
		</>
	);
}
