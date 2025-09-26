import {
	AppLayout,
	Button,
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

function RootLayout() {
	const handleLogout = () => {
		try {
			localStorage.removeItem("bm_auth");
		} catch {
			/* noop */
		}
		navigate({ to: "/login" });
	};
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	// Render login route without the app frame
	if (currentPath === "/login") {
		return <Outlet />;
	}
	return (
		<AppLayout
			sidebar={
				<Sidebar
					logo={<h1 className="text-lg font-bold">Branch Manager</h1>}
					menuItems={menuBranchManager}
					onLogout={handleLogout}
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
			<TanStackRouterDevtools />
		</AppLayout>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
