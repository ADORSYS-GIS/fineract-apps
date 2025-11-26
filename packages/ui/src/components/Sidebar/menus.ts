import { Home, Send, Settings, Users } from "lucide-react";
import { MenuItem } from "./Sidebar.types";

export const menuAccountManager = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "settings", link: "/settings", icon: Settings },
];

export const menuBranchManager: MenuItem[] = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "Staff", link: "/staff", icon: Users },
	{ name: "tellers", title: "Tellers/Cashiers", link: "/tellers", icon: Users },
	{ name: "Pending", link: "/approve/account", icon: Users },
];

export const menuCashier = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "Loan Repayment", link: "/repayment", icon: Send },
];

export const menuAdmin = [{ name: "Dashboard", link: "/", icon: Home }];
