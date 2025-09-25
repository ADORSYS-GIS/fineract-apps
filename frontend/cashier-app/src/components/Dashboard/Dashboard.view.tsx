import {
	AppLayout,
	Button,
	menuCashier,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
import { Bell, UserCircle } from "lucide-react";
import { ClientSearch } from "../ClientSearch";
import { DashboardViewProps } from "./Dashboard.types";

export function DashboardView({
	query,
	onQueryChange,
	onLogout,
}: Readonly<DashboardViewProps>) {
	return (
		<AppLayout
			navbar={
				<Navbar
					notifications={<Bell />}
					userSection={
						<div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
							<UserCircle className="w-5 h-5 text-gray-600" />
						</div>
					}
					actions={<Button onClick={onLogout}>Logout</Button>}
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
