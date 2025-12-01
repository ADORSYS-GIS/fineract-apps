import {
	AppLayout,
	menuBranchManager,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
import {
	createRootRoute,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { UserCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { NotificationBell } from "@/components/NotificationBell";
import { configureApi } from "@/services/api";

function onLogout() {
	const base = import.meta.env.BASE_URL ?? "/branchmanager/";
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
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	return (
		<AppLayout
			sidebar={
				<Sidebar
					logo={<h1 className="text-lg font-bold">Branch Manager</h1>}
					menuItems={menuBranchManager}
					activePath={currentPath}
					onNavigate={(to) => navigate({ to })}
					onLogout={onLogout}
				/>
			}
			navbar={
				<Navbar
					logo={<h1 className="text-lg font-bold">Branch Manager</h1>}
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
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
