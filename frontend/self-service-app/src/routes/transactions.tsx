import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Filter, Search } from "lucide-react";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
});

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  method: string;
  date: string;
  status: "completed" | "pending" | "failed";
  reference: string;
}

function TransactionsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const currency = "XAF";

  // Mock transactions data - in real app, would come from API
  const transactions: Transaction[] = [
    {
      id: "TXN-001",
      type: "deposit",
      amount: 50000,
      method: "mtn_transfer",
      date: "2024-01-15T14:30:00",
      status: "completed",
      reference: "MTN-123456",
    },
    {
      id: "TXN-002",
      type: "withdrawal",
      amount: 25000,
      method: "orange_transfer",
      date: "2024-01-14T10:15:00",
      status: "completed",
      reference: "ORG-789012",
    },
    {
      id: "TXN-003",
      type: "deposit",
      amount: 100000,
      method: "uba_bank_transfer",
      date: "2024-01-10T09:00:00",
      status: "completed",
      reference: "UBA-345678",
    },
    {
      id: "TXN-004",
      type: "withdrawal",
      amount: 15000,
      method: "mtn_transfer",
      date: "2024-01-08T16:45:00",
      status: "pending",
      reference: "MTN-901234",
    },
    {
      id: "TXN-005",
      type: "deposit",
      amount: 75000,
      method: "afriland_bank_transfer",
      date: "2024-01-05T11:20:00",
      status: "completed",
      reference: "AFL-567890",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-CM", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter !== "all" && tx.type !== filter) return false;
    if (searchTerm && !tx.reference.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("nav.transactions")}</h1>
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
            {filteredTransactions.map((tx) => (
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
                      {t(`paymentMethods.${tx.method}`)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Ref: {tx.reference}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      tx.type === "deposit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "deposit" ? "+" : "-"}
                    {formatCurrency(tx.amount)} {currency}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded mt-1 ${getStatusColor(
                      tx.status
                    )}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
