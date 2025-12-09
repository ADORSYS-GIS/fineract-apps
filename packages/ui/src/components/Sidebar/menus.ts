import {
	BarChart3,
	BookOpen,
	Calculator,
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

export const menuAccountManager: MenuItem[] = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "settings", link: "/settings", icon: Settings },
];

export const menuBranchManager: MenuItem[] = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "Staff", link: "/staff", icon: Users },
	{ name: "tellers", title: "Tellers/Cashiers", link: "/tellers", icon: Users },
	{ name: "Pending", link: "/approve/account", icon: Users },
];

export const menuCashier: MenuItem[] = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "Loan Repayment", link: "/repayment", icon: Send },
];

export const menuAdmin: MenuItem[] = [
	{ name: "Dashboard", link: "/", icon: Home },
];

export const menuReporting: MenuItem[] = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "reports", link: "/reports", icon: BarChart3 },
	{ name: "transactions", link: "/transactions", icon: History },
	{ name: "audit", link: "/audit", icon: Shield },
];

export const menuAccounting: MenuItem[] = [
	{ name: "dashboard", link: "/dashboard", icon: Home },
	{ name: "gl_accounts", link: "/gl-accounts", icon: BookOpen },
	{ name: "journal_entries", link: "/journal-entries", icon: FileText },
	{ name: "create_entry", link: "/create-entry", icon: PlusCircle },
	{ name: "approval_queue", link: "/approval-queue", icon: CheckCircle },
	{ name: "closures", link: "/closures", icon: Lock },
	{ name: "cash_short_over", link: "/cash-short-over", icon: Calculator },
];
