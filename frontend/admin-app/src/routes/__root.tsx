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
import { useTranslation } from "react-i18next";
import { ToastContainer, ToastProvider } from "@/components/Toast";

function RootLayout() {
	const { t } = useTranslation();
	const handleLogout = () => logout();
	return (
		<ToastProvider>
			<AppLayout
				sidebar={<Sidebar menuItems={menuAdmin} onLogout={handleLogout} />}
				navbar={
					<Navbar
						logo={
							<h1 className="text-lg font-bold">{t("administration")}</h1>
						}
						links={null}
						notifications={<Bell />}
						userSection={
							<div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
								<UserCircle className="w-5 h-5 text-gray-600" />
							</div>
						}
						actions={
							<Button onClick={handleLogout}>{t("logout")}</Button>
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
				<ToastContainer />
				<TanStackRouterDevtools />
			</AppLayout>
		</ToastProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
