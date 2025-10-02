import { AppLayout, menuCashier, Navbar, Sidebar } from "@fineract-apps/ui";
import { Bell, UserCircle } from "lucide-react";
import { ClientSearch } from "../ClientSearch";
import { DashboardViewProps } from "./Dashboard.types";

export function DashboardView({
	query,
	onQueryChange,
}: Readonly<DashboardViewProps>) {
	return (
		<AppLayout
			navbar={
				<Navbar
					logo={<h1 className="text-lg font-bold">Cashier App</h1>}
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
			sidebar={<Sidebar menuItems={menuCashier} />}
		>
			<ClientSearch query={query} onQueryChange={onQueryChange} />
		</AppLayout>
	);
}
