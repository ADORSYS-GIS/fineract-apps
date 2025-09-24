import { AppLayout, menuCashier, Navbar, Sidebar } from "@fineract-apps/ui";
import { ClientSearch } from "../ClientSearch";
import { DashboardViewProps } from "./Dashboard.types";

export function DashboardView({
	onToggleMenu,
	isMenuOpen,
	query,
	onQueryChange,
}: Readonly<DashboardViewProps>) {
	return (
		<AppLayout
			navbar={
				<Navbar
					logo={<h1 className="text-lg font-bold">Cashier App</h1>}
					actions={null}
					onToggleMenu={onToggleMenu}
					isMenuOpen={isMenuOpen}
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
