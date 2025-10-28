import {
	CreditCard,
	FileText,
	Home,
	Send,
	Settings,
	Users,
} from "lucide-react";
import { MenuItem } from "./Sidebar.types";

export const menuAccountManager = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "accounts", link: "/accounts", icon: CreditCard },
	{ name: "transactions", link: "/transactions", icon: Send },
	{ name: "settings", link: "/settings", icon: Settings },
];

export const menuBranchManager: MenuItem[] = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Staff", link: "/staff", icon: Users },
	{ name: "Tellers/Cashiers", link: "/tellers", icon: Users },
	{ name: "Pending", link: "/approve/account", icon: Users },
];

export const menuCashier = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "payments", link: "/payments", icon: Send },
	{ name: "receipts", link: "/receipts", icon: FileText },
	{ name: "settings", link: "/settings", icon: Settings },
];
