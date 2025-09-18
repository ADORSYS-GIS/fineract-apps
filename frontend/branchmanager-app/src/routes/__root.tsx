import { AppLayout, Navbar } from "@fineract-apps/ui";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bell, UserCircle } from "lucide-react";

function RootLayout() {
	return (
		<AppLayout
			navbar={
				<Navbar
					logo={<h1 className="text-lg font-bold">Branch Manager</h1>}
					links={
						<div className="flex items-center gap-4">
							<Link to="/" className="text-sm font-medium">
								Dashboard
							</Link>
						</div>
					}
					notifications={<Bell />}
					userSection={
						<div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
							<UserCircle className="w-5 h-5 text-gray-600" />
						</div>
					}
					actions={
						<button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md">
							Logout
						</button>
					}
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
