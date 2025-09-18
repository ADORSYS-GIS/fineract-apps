import {
	CreditCard,
	FileText,
	Home,
	Send,
	Settings,
	Users,
} from "lucide-react";

export const menuAccountManager = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Accounts", link: "/accounts", icon: CreditCard },
	{ name: "Transactions", link: "/transactions", icon: Send },
	{ name: "Settings", link: "/settings", icon: Settings },
];

export const menuBranchManager = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Branches", link: "/branches", icon: Users },
	{ name: "Reports", link: "/reports", icon: FileText },
	{ name: "Settings", link: "/settings", icon: Settings },
];

export const menuCashier = [
	{ name: "Dashboard", link: "/dashboard", icon: Home },
	{ name: "Payments", link: "/payments", icon: Send },
	{ name: "Receipts", link: "/receipts", icon: FileText },
	{ name: "Settings", link: "/settings", icon: Settings },
];
