import { createFileRoute } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowDownCircle,
	ArrowUpCircle,
	Filter,
	Loader2,
	Search,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useCustomer,
	usePrimarySavingsAccount,
	useTransactions,
} from "../hooks";

export const Route = createFileRoute("/transactions")({
	component: TransactionsPage,
});

function TransactionsPage() {
	const { t } = useTranslation();
	const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch real data using hooks
	const { data: customer, isLoading: isLoadingCustomer } = useCustomer();
	const { data: account, isLoading: isLoadingAccount } =
		usePrimarySavingsAccount();
	const {
		data: transactions = [],
		isLoading: isLoadingTransactions,
		error,
	} = useTransactions(account?.id);

	const currency = account?.currency?.code || "XAF";
	const isLoading =
		isLoadingCustomer || isLoadingAccount || isLoadingTransactions;

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("fr-CM", {
			style: "decimal",
			minimumFractionDigits: 0,
		}).format(value);
	};

	const formatDate = (dateString: string) => {
		// Handle date arrays like [2024, 1, 15] or ISO strings
		let date: Date;
		if (dateString.includes("-") && dateString.length <= 10) {
			// Format: "2024-1-15"
			const parts = dateString.split("-").map(Number);
			date = new Date(parts[0], parts[1] - 1, parts[2]);
		} else {
			date = new Date(dateString);
		}
		return new Intl.DateTimeFormat("fr-CM", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	};

	const getStatusColor = (reversed: boolean) => {
		if (reversed) {
			return "bg-red-100 text-red-700";
		}
		return "bg-green-100 text-green-700";
	};

	const getPaymentMethod = (tx: (typeof transactions)[0]) => {
		// Map payment type name to our translation keys
		const paymentType =
			tx.paymentDetail?.paymentType?.name?.toLowerCase() || "";
		if (paymentType.includes("mtn")) return "mtn_transfer";
		if (paymentType.includes("orange")) return "orange_transfer";
		if (paymentType.includes("uba")) return "uba_bank_transfer";
		if (paymentType.includes("afriland")) return "afriland_bank_transfer";
		return tx.paymentDetail?.paymentType?.name || "transfer";
	};

	const getReference = (tx: (typeof transactions)[0]) => {
		return tx.paymentDetail?.receiptNumber || `TXN-${tx.id}`;
	};

	const filteredTransactions = transactions.filter((tx) => {
		// Filter out reversed transactions unless explicitly showing them
		if (tx.reversed) return false;
		if (filter !== "all" && tx.type !== filter) return false;
		const reference = getReference(tx);
		if (
			searchTerm &&
			!reference.toLowerCase().includes(searchTerm.toLowerCase())
		) {
			return false;
		}
		return true;
	});

	// Loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
					<p className="mt-4 text-gray-600">{t("common.loading")}</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
					<p className="mt-4 text-gray-600">Failed to load transactions</p>
					<p className="text-sm text-gray-400 mt-1">Please try again later</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">
					{t("nav.transactions")}
				</h1>
				<p className="text-gray-500 mt-1">View your transaction history</p>
			</div>

			{/* Filters */}
			<div className="card">
				<div className="flex flex-col sm:flex-row gap-4">
					{/* Search */}
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Search by reference..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="input pl-10"
						/>
					</div>

					{/* Type Filter */}
					<div className="flex items-center gap-2">
						<Filter className="w-5 h-5 text-gray-400" />
						<div className="flex gap-2">
							<button
								onClick={() => setFilter("all")}
								className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									filter === "all"
										? "bg-blue-100 text-blue-700"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								All
							</button>
							<button
								onClick={() => setFilter("deposit")}
								className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									filter === "deposit"
										? "bg-green-100 text-green-700"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								{t("transactions.deposit")}
							</button>
							<button
								onClick={() => setFilter("withdrawal")}
								className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									filter === "withdrawal"
										? "bg-red-100 text-red-700"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								{t("transactions.withdrawal")}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Transactions List */}
			<div className="card">
				{filteredTransactions.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-500">{t("dashboard.noTransactions")}</p>
					</div>
				) : (
					<div className="space-y-4">
						{filteredTransactions.map((tx) => {
							const paymentMethod = getPaymentMethod(tx);
							const reference = getReference(tx);

							return (
								<div
									key={tx.id}
									className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
								>
									<div className="flex items-center gap-4">
										<div
											className={`w-12 h-12 rounded-full flex items-center justify-center ${
												tx.type === "deposit" ? "bg-green-100" : "bg-red-100"
											}`}
										>
											{tx.type === "deposit" ? (
												<ArrowDownCircle className="w-6 h-6 text-green-600" />
											) : (
												<ArrowUpCircle className="w-6 h-6 text-red-600" />
											)}
										</div>
										<div>
											<p className="font-medium text-gray-900">
												{t(`transactions.${tx.type}`)}
											</p>
											<p className="text-sm text-gray-500">
												{paymentMethod.includes("_")
													? t(`paymentMethods.${paymentMethod}`, {
															defaultValue: paymentMethod,
														})
													: paymentMethod}
											</p>
											<p className="text-xs text-gray-400 mt-1">
												Ref: {reference}
											</p>
										</div>
									</div>

									<div className="text-right">
										<p
											className={`text-lg font-semibold ${
												tx.type === "deposit"
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											{tx.type === "deposit" ? "+" : "-"}
											{formatCurrency(tx.amount)} {currency}
										</p>
										<p className="text-sm text-gray-500">
											{formatDate(tx.date)}
										</p>
										<p className="text-xs text-gray-400">
											Balance: {formatCurrency(tx.runningBalance)} {currency}
										</p>
										<span
											className={`inline-block text-xs px-2 py-0.5 rounded mt-1 ${getStatusColor(tx.reversed)}`}
										>
											{tx.reversed ? "reversed" : "completed"}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
