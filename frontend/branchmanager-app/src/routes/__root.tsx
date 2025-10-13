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
	return (
		<AppLayout
			sidebar={
				<Sidebar
					logo={<h1 className="text-lg font-bold">Branch Manager</h1>}
					menuItems={menuBranchManager}
					activePath={currentPath}
					onNavigate={(to) => navigate({ to })}
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
