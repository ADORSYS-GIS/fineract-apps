import { FileText, Home, Send, Settings, Users } from "lucide-react";
import { MenuItem } from "./Sidebar.types";

export const menuAccountManager = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "settings", link: "/settings", icon: Settings },
];

export const menuBranchManager: MenuItem[] = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "staff", link: "/staff", icon: Users },
	{ name: "tellers", title: "tellers/cashiers", link: "/tellers", icon: Users },
	{ name: "pending", link: "/approve/account", icon: Users },
];

export const menuCashier = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "repayment", link: "/repayment", icon: Send },
	{ name: "receipts", link: "/receipts", icon: FileText },
	{ name: "settings", link: "/settings", icon: Settings },
];
