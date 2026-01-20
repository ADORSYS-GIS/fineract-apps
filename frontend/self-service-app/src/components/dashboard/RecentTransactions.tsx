import { useTranslation } from "react-i18next";
import { ArrowDownCircle, ArrowUpCircle, Loader2, ChevronRight } from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/formatters";
import type { Transaction } from "../../types";

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
  maxItems?: number;
  currency?: string;
  onViewAll?: () => void;
  onTransactionClick?: (transaction: Transaction) => void;
}

export function RecentTransactions({
  transactions,
  isLoading = false,
  maxItems = 5,
  currency = "XAF",
  onViewAll,
  onTransactionClick,
}: RecentTransactionsProps) {
  const { t } = useTranslation();

  const displayedTransactions = transactions.slice(0, maxItems);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowDownCircle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">{t("dashboard.noTransactions")}</p>
        <p className="text-sm text-gray-400 mt-1">
          Make a deposit to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("dashboard.recentTransactions")}
        </h3>
        {onViewAll && transactions.length > maxItems && (
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            {t("dashboard.viewAll")}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayedTransactions.map((tx) => {
          const isDeposit = tx.transactionType.deposit;
          return (
            <div
              key={tx.id}
              onClick={() => onTransactionClick?.(tx)}
              className={`flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${
                onTransactionClick ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDeposit ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {isDeposit ? (
                    <ArrowDownCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {isDeposit ? t("transactions.deposit") : t("transactions.withdrawal")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tx.paymentDetail?.paymentType?.name || "Transfer"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold ${
                    isDeposit ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isDeposit ? "+" : "-"}
                  {formatCurrency(tx.amount, currency)} {currency}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(tx.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {onViewAll && transactions.length > maxItems && (
        <button
          onClick={onViewAll}
          className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          View all {transactions.length} transactions
        </button>
      )}
    </div>
  );
}
