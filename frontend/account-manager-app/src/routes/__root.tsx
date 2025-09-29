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

export const Route = createRootRouteWithContext()({
	component: RootLayout,
});

function RootLayout() {
	const handleLogout = () => alert("Logout clicked!");
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
		<AppLayout
			sidebar={
				<Sidebar menuItems={menuAccountManager} onLogout={handleLogout} />
			}
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
