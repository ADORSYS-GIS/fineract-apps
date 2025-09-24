import {
	CreditCard,
	FileText,
	Home,
	Send,
	Settings,
	Users,
} from "lucide-react";
import type { ElementType } from "react";

interface MenuItem {
	name: string;
	link: string;
	icon: ElementType;
}

export const menuAccountManager: MenuItem[] = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Accounts", link: "/accounts", icon: CreditCard },
	{ name: "Transactions", link: "/transactions", icon: Send },
	{ name: "Settings", link: "/settings", icon: Settings },
];

export const menuBranchManager: MenuItem[] = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Branches", link: "/branches", icon: Users },
	{ name: "Staff", link: "/staff/assign", icon: Users },
	{ name: "Fund", link: "/fund", icon: Users },
	{ name: "Create Account", link: "/create/account", icon: Users },
	{ name: "Reports", link: "/reports", icon: FileText },
	{ name: "Settings", link: "/settings", icon: Settings },
];

export const menuCashier: MenuItem[] = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Payments", link: "/payments", icon: Send },
	{ name: "Receipts", link: "/receipts", icon: FileText },
	{ name: "Settings", link: "/settings", icon: Settings },
];
