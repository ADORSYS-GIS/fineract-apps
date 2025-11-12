import { Button, Card, formatCurrency } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Route } from "@/routes/dashboard/index.tsx";
import { extractClientNameFromTxnNote } from "@/utils/transaction";
import { CashierTransactionSummaryViewProps } from "./CashierTransactionSummary.types";

const LoadingSkeleton = () => (
	<div className="grid grid-cols-1 gap-4 p-4 animate-pulse">
		<Card className="p-4">
			<div className="space-y-2">
				<div className="flex justify-between">
					<div className="h-6 bg-gray-300 rounded w-1/3" />
					<div className="h-6 bg-gray-300 rounded w-1/3" />
				</div>
				<div className="flex justify-between">
					<div className="h-6 bg-gray-300 rounded w-1/3" />
					<div className="h-6 bg-gray-300 rounded w-1/3" />
				</div>
				<div className="flex justify-between">
					<div className="h-6 bg-gray-300 rounded w-1/3" />
					<div className="h-6 bg-gray-300 rounded w-1/3" />
				</div>
			</div>
		</Card>
		<Card className="p-4">
			<div className="h-6 bg-gray-300 rounded w-1/4 mb-4" />
			<div className="space-y-2">
				<div className="h-4 bg-gray-300 rounded w-full" />
				<div className="h-4 bg-gray-300 rounded w-full" />
				<div className="h-4 bg-gray-300 rounded w-full" />
			</div>
		</Card>
	</div>
);

export function CashierTransactionSummaryView({
	cashierData,
	currencyCode,
	isLoading,
	isError,
	error,
	onShowSummary,
	showSummary,
}: Readonly<CashierTransactionSummaryViewProps>) {
	const { t } = useTranslation();
	const { page = 1, limit = 10 } = Route.useSearch();
	const totalRecords =
		cashierData?.cashierTransactions?.totalFilteredRecords ?? 0;
	const totalPages = Math.ceil(totalRecords / limit);

	if (!showSummary) {
		return (
			<div className="p-4">
				<Button onClick={onShowSummary}>{t("viewTransactionSummary")}</Button>
			</div>
		);
	}

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	if (isError) {
		return (
			<div className="p-4">
				<Card className="p-4 bg-red-50 border-red-200">
					<div className="flex items-center gap-4">
						<AlertTriangle className="w-8 h-8 text-red-500" />
						<div>
							<h2 className="text-lg font-bold text-red-800">
								{t("errorFetchingCashierData")}
							</h2>
							<p className="text-red-700">
								{error instanceof Error
									? error.message
									: t("anUnknownErrorOccurred")}
							</p>
						</div>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 p-4">
			<Card className="p-4">
				<div className="space-y-2">
					<div className="flex justify-between">
						<div>
							<span className="text-sm text-gray-600">{t("branch")}: </span>
							<span className="font-semibold text-gray-900">
								{cashierData?.officeName}
							</span>
						</div>
						<div>
							<span className="text-sm text-gray-600">{t("teller")}: </span>
							<span className="font-semibold text-gray-900">
								{cashierData?.tellerName}
							</span>
						</div>
					</div>
					<div className="flex justify-between">
						<div>
							<span className="text-sm text-gray-600">{t("cashier")}: </span>
							<span className="font-semibold text-gray-900">
								{cashierData?.cashierName}
							</span>
						</div>
						<div>
							<span className="text-sm text-gray-600">{t("netCash")}: </span>
							<span className="font-semibold text-gray-900">
								{formatCurrency(cashierData?.netCash ?? 0, currencyCode)}
							</span>
						</div>
					</div>
					<div className="flex justify-between">
						<div>
							<span className="text-sm text-gray-600">
								{t("dailyAllocation")}:{" "}
							</span>
							<span className="font-semibold text-gray-900">
								{formatCurrency(
									cashierData?.sumCashAllocation ?? 0,
									currencyCode,
								)}
							</span>
						</div>
						<div>
							<span className="text-sm text-gray-600">
								{t("totalTransactions")}:{" "}
							</span>
							<span className="font-semibold text-gray-900">
								{cashierData?.cashierTransactions?.pageItems?.length ?? 0}
							</span>
						</div>
					</div>
				</div>
			</Card>
			<Card className="p-4">
				<h2 className="text-lg font-bold mb-4">{t("transactions")}</h2>
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3">
									{t("client")}
								</th>
								<th scope="col" className="px-6 py-3">
									{t("amount")}
								</th>
								<th scope="col" className="px-6 py-3">
									{t("type")}
								</th>
								<th scope="col" className="px-6 py-3">
									{t("note")}
								</th>
							</tr>
						</thead>
						<tbody>
							{cashierData?.cashierTransactions?.pageItems?.map((item) => (
								<tr
									key={item.id}
									className="bg-white border-b hover:bg-gray-50"
								>
									<td className="px-6 py-4">
										{extractClientNameFromTxnNote(item.txnNote)}
									</td>
									<td className="px-6 py-4">
										{formatCurrency(item.txnAmount ?? 0, currencyCode)}
									</td>
									<td className="px-6 py-4">{item.txnType?.value}</td>
									<td className="px-6 py-4">{item.txnNote}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="flex items-center justify-between pt-4">
					<span className="text-sm text-gray-700">
						{t("page")}{" "}
						<span className="font-semibold text-gray-900">{page}</span>{" "}
						{t("of")}{" "}
						<span className="font-semibold text-gray-900">{totalPages}</span>
					</span>
					<div className="flex items-center gap-2">
						<Link
							to="/dashboard"
							search={(prev) => ({ ...prev, page: Math.max(1, page - 1) })}
							disabled={page <= 1}
						>
							<Button variant="outline" size="sm" disabled={page <= 1}>
								{t("previous")}
							</Button>
						</Link>
						<Link
							to="/dashboard"
							search={(prev) => ({
								...prev,
								page: Math.min(totalPages, page + 1),
							})}
							disabled={page >= totalPages}
						>
							<Button variant="outline" size="sm" disabled={page >= totalPages}>
								{t("next")}
							</Button>
						</Link>
					</div>
				</div>
			</Card>
		</div>
	);
}
