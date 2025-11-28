import { GetV1CashiersResponse } from "@fineract-apps/fineract-api";
import {
	AppLayout,
	Button,
	Card,
	menuCashier,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AlertTriangle, UserCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { NotificationBell } from "@/components/NotificationBell";
import { configureApi } from "@/services/api";
import { validateAndGetCashierData } from "@/services/cashier";

export interface MyRouterContext {
	queryClient: QueryClient;
	cashierInfo?: GetV1CashiersResponse[0];
	currencyCode?: string;
}

function RootLayout() {
	configureApi();
	const navigate = useNavigate();
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	function onLogout() {
		const base = import.meta.env.BASE_URL || "/cashier/";
		const appBase = base.endsWith("/") ? base : `${base}/`;
		const redirectTo = `${window.location.origin}${appBase}`;
		window.location.href = `${appBase}callback?logout=${encodeURIComponent(
			redirectTo,
		)}`;
	}

	const transformedMenu = menuCashier.map((item) =>
		item.name === "Loan Repayment" ? { ...item, name: "loanRepayment" } : item,
	);

	return (
		<AppLayout
			sidebar={
				<Sidebar
					logo={<h1 className="text-lg font-bold">Cashier App</h1>}
					menuItems={transformedMenu}
					activePath={currentPath}
					onNavigate={(to) => navigate({ to })}
					onLogout={onLogout}
				/>
			}
			navbar={
				<Navbar
					logo={null}
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
			<ReactQueryDevtools />
		</AppLayout>
	);
}

function CustomErrorComponent({ error }: { error: Error }) {
	function onLogout() {
		const base = import.meta.env.BASE_URL || "/cashier/";
		const appBase = base.endsWith("/") ? base : `${base}/`;
		const redirectTo = `${window.location.origin}${appBase}`;
		window.location.href = `${appBase}callback?logout=${encodeURIComponent(
			redirectTo,
		)}`;
	}

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<Card className="p-6 bg-red-50 border-red-200 w-full max-w-md">
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="flex items-center gap-4">
						<AlertTriangle className="w-10 h-10 text-red-500" />
						<div className="space-y-1">
							<h2 className="text-xl font-bold text-red-800">Access Denied</h2>
							<p className="text-base text-red-700">
								{error instanceof Error
									? error.message
									: "An unknown error occurred."}
							</p>
						</div>
					</div>
					<Button onClick={onLogout} variant="destructive" className="w-full">
						Logout
					</Button>
				</div>
			</Card>
		</div>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootLayout,
	errorComponent: CustomErrorComponent,
	beforeLoad: async ({ context }) => {
		const { queryClient } = context;
		const { cashierInfo, currencyCode } = await queryClient.fetchQuery({
			queryKey: ["cashierValidation"],
			queryFn: validateAndGetCashierData,
		});

		return {
			...context,
			cashierInfo,
			currencyCode,
		};
	},
});
