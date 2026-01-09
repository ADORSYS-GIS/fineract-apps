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

export const menuAccountManager: MenuItem[] = [
	{
		name: "dashboard",
		title: "sidebar.dashboard",
		link: "/dashboard",
		icon: Home,
	},
	{
		name: "settings",
		title: "sidebar.settings",
		link: "/settings",
		icon: Settings,
	},
];

export const menuBranchManager: MenuItem[] = [
	{
		name: "dashboard",
		title: "sidebar.dashboard",
		link: "/dashboard",
		icon: Home,
	},
	{ name: "staff", title: "sidebar.staff", link: "/staff", icon: Users },
	{
		name: "tellers/cashiers",
		title: "sidebar.tellersCashiers",
		link: "/tellers",
		icon: Users,
	},
	{
		name: "pending",
		title: "sidebar.pending",
		link: "/approve/account",
		icon: Users,
	},
];

export const menuCashier: MenuItem[] = [
	{
		name: "dashboard",
		title: "sidebar.dashboard",
		link: "/dashboard",
		icon: Home,
	},
	{
		name: "Loan Repayment",
		title: "sidebar.loanRepayment",
		link: "/repayment",
		icon: Send,
	},
];

export const menuAdmin: MenuItem[] = [
	{ name: "Dashboard", title: "sidebar.dashboard", link: "/", icon: Home },
];

export const menuReporting: MenuItem[] = [
	{
		name: "dashboard",
		title: "sidebar.dashboard",
		link: "/dashboard",
		icon: Home,
	},
	{
		name: "reports",
		title: "sidebar.reports",
		link: "/reports",
		icon: BarChart3,
	},
	{
		name: "transactions",
		title: "sidebar.transactions",
		link: "/transactions",
		icon: History,
	},
	{ name: "audit", title: "sidebar.audit", link: "/audit", icon: Shield },
];

export const menuAccounting: MenuItem[] = [
	{
		name: "dashboard",
		title: "sidebar.dashboard",
		link: "/dashboard",
		icon: Home,
	},
	{
		name: "gl_accounts",
		title: "sidebar.glAccounts",
		link: "/gl-accounts",
		icon: BookOpen,
	},
	{
		name: "journal_entries",
		title: "sidebar.journalEntries",
		link: "/journal-entries",
		icon: FileText,
	},
	{
		name: "create_entry",
		title: "sidebar.createEntry",
		link: "/create-entry",
		icon: PlusCircle,
	},
	{
		name: "approval_queue",
		title: "sidebar.approvalQueue",
		link: "/approval-queue",
		icon: CheckCircle,
	},
	{
		name: "closures",
		title: "sidebar.closures",
		link: "/closures",
		icon: Lock,
	},
];
