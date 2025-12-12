import {
	BarChart3,
	BookOpen,
	CheckCircle,
	FileText,
	History,
	Home,
	Lock,
	PlusCircle,
	Send,
	Settings,
	Shield,
	Users,
} from "lucide-react";
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
	{ name: "payments", link: "/payments", icon: Send },
	{ name: "receipts", link: "/receipts", icon: FileText },
	{ name: "settings", link: "/settings", icon: Settings },
];

export const menuAdmin = [{ name: "Dashboard", link: "/", icon: Home }];

export const menuReporting: MenuItem[] = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "reports", link: "/reports", icon: BarChart3 },
	{ name: "transactions", link: "/transactions", icon: History },
	{ name: "audit", link: "/audit", icon: Shield },
];

export const menuAccounting: MenuItem[] = [
	{ name: "dashboard", title: "Dashboard", link: "/dashboard", icon: Home },
	{
		name: "gl_accounts",
		title: "GL Accounts",
		link: "/gl-accounts",
		icon: BookOpen,
	},
	{
		name: "journal_entries",
		title: "Journal Entries",
		link: "/journal-entries",
		icon: FileText,
	},
	{
		name: "create_entry",
		title: "Create Entry",
		link: "/create-entry",
		icon: PlusCircle,
	},
	{
		name: "approval_queue",
		title: "Approval Queue",
		link: "/approval-queue",
		icon: CheckCircle,
	},
	{ name: "closures", title: "Closures", link: "/closures", icon: Lock },
];
