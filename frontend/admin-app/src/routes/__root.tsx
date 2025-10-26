import {
	AppLayout,
	Button,
	menuAdmin,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bell, UserCircle } from "lucide-react";
import { ToastProvider, ToastContainer } from "@/components/Toast";

function RootLayout() {
	const handleLogout = () => alert("Logout clicked!");
	return (
		<ToastProvider>
			<AppLayout
				sidebar={
					<Sidebar menuItems={menuAdmin} onLogout={handleLogout} />
				}
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
