import {
	AppLayout,
	Button,
	menuCashier,
	Navbar,
	Sidebar,
} from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { Bell, UserCircle } from "lucide-react";
import { ClientSearch } from "../ClientSearch";
import { DashboardViewProps } from "./Dashboard.types";

export function DashboardView({
	onToggleMenu,
	isMenuOpen,
	query,
	onQueryChange,
	isDropdownOpen,
	toggleDropdown,
	dropdownRef,
	onLogout,
}: Readonly<DashboardViewProps>) {
	return (
		<AppLayout
			navbar={
				<Navbar
					logo={<h1 className="text-lg font-bold">Cashier App</h1>}
					links={null}
					notifications={<Bell />}
					userSection={
						<div className="relative" ref={dropdownRef}>
							<button
								type="button"
								onClick={toggleDropdown}
								className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
							>
								<UserCircle className="w-5 h-5 text-gray-600" />
							</button>
							{isDropdownOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
									<div
										className="py-1"
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="options-menu"
									>
										<Link
											to="/settings"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											role="menuitem"
										>
											Settings
										</Link>
										<Button
											onClick={onLogout}
											variant="ghost"
											className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											role="menuitem"
										>
											Logout
										</Button>
									</div>
								</div>
							)}
						</div>
					}
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
