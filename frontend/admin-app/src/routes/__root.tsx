import {
	AppLayout,
	Button,
	logout,
	menuAdmin,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bell, UserCircle } from "lucide-react";
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
	return (
		<ToastProvider>
			<AppLayout
				sidebar={<Sidebar menuItems={menuAdmin} onLogout={handleLogout} />}
				navbar={
					<Navbar
						logo={<h1 className="text-lg font-bold">Administration</h1>}
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
