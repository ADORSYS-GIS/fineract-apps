import { AppLayout, menuReporting, Navbar, Sidebar } from "@fineract-apps/ui";
import {
	createRootRoute,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bell, UserCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";

function onLogout() {
	const base = import.meta.env.BASE_URL ?? "/reporting/";
	const appBase = base.endsWith("/") ? base : `${base}/`;
	const redirectTo = `${globalThis.location.origin}${appBase}`;
	globalThis.location.href = `${appBase}callback?logout=${encodeURIComponent(
		redirectTo,
	)}`;
}

function RootLayout() {
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
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
					logo={<h1 className="text-lg font-bold">Reporting</h1>}
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
