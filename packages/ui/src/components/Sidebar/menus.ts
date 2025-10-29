import { FileText, Home, Send, Settings, Users } from "lucide-react";

export const menuAccountManager = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "settings", link: "/settings", icon: Settings },
];

export const menuBranchManager = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "branches", link: "/branches", icon: Users },
	{ name: "reports", link: "/reports", icon: FileText },
	{ name: "settings", link: "/settings", icon: Settings },
];

export const menuCashier = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "payments", link: "/payments", icon: Send },
	{ name: "receipts", link: "/receipts", icon: FileText },
	{ name: "settings", link: "/settings", icon: Settings },
];
