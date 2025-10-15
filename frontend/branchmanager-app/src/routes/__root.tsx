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
import { Bell, UserCircle } from "lucide-react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function RootLayout() {
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	const [isMenuOpen, setIsMenuOpen] = useState(true);
	function onLogout() {
		const base = import.meta.env.BASE_URL || "/branchmanager/";
		const appBase = base.endsWith("/") ? base : `${base}/`;
		const redirectUri = `${window.location.origin}${appBase}`;
		const logoutUrl = new URL(`${appBase}logout`, window.location.origin);
		logoutUrl.searchParams.set("rd", redirectUri);
		window.location.href = logoutUrl.toString();
	}
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
					notifications={<Bell />}
					userSection={
						<div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
							<UserCircle className="w-5 h-5 text-gray-600" />
						</div>
					}
					onToggleMenu={() => setIsMenuOpen((v) => !v)}
					isMenuOpen={isMenuOpen}
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
