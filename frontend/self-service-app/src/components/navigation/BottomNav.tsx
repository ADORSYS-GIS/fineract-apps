import { Link, useRouterState } from "@tanstack/react-router";
import {
	ArrowDownCircle,
	ArrowUpCircle,
	History,
	Home,
	User,
} from "lucide-react";
import type { ElementType } from "react";
import { useTranslation } from "react-i18next";

interface NavItem {
	path: string;
	icon: ElementType;
	label: string;
}

export function BottomNav() {
	const { t } = useTranslation();
	const { location } = useRouterState();

	const navItems: NavItem[] = [
		{
			path: "/dashboard",
			icon: Home,
			label: t("nav.home", "Home"),
		},
		{
			path: "/deposit",
			icon: ArrowDownCircle,
			label: t("nav.deposit", "Deposit"),
		},
		{
			path: "/withdraw",
			icon: ArrowUpCircle,
			label: t("nav.withdraw", "Withdraw"),
		},
		{
			path: "/transactions",
			icon: History,
			label: t("nav.history", "History"),
		},
		{
			path: "/kyc",
			icon: User,
			label: t("nav.profile", "Profile"),
		},
	];

	const isActive = (path: string) => {
		return (
			location.pathname === path || location.pathname.startsWith(`${path}/`)
		);
	};

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb md:hidden z-40">
			<div className="flex items-center justify-around h-16">
				{navItems.map((item) => {
					const active = isActive(item.path);
					const Icon = item.icon;

					return (
						<Link
							key={item.path}
							to={item.path}
							className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
								active
									? "text-blue-600"
									: "text-gray-500 hover:text-gray-700 active:text-gray-900"
							}`}
						>
							<Icon className={`w-6 h-6 ${active ? "stroke-2" : ""}`} />
							<span className="text-xs mt-1 font-medium">{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
