import {
	CreditCard,
	FileText,
	Home,
	Send,
	Settings,
	Users,
} from "lucide-react";
import { MenuItem } from "./Sidebar.types";

export const menuAccountManager: MenuItem[] = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Accounts", link: "/accounts", icon: CreditCard },
	{ name: "Transactions", link: "/transactions", icon: Send },
	{ name: "Settings", link: "/settings", icon: Settings },
];

export const menuBranchManager: MenuItem[] = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Staff", link: "/staff", icon: Users },
	{ name: "Tellers/Cashiers", link: "/tellers_cashiers", icon: Users },
	{ name: "Pending", link: "/approve/account", icon: Users },
	{ name: "Settings", link: "/settings", icon: Settings },
];

export const menuCashier: MenuItem[] = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Payments", link: "/payments", icon: Send },
	{ name: "Receipts", link: "/receipts", icon: FileText },
	{ name: "Settings", link: "/settings", icon: Settings },
];
