import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import { ArrowDownCircle, ArrowUpCircle, Shield, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const auth = useAuth();
  const { t } = useTranslation();

  // Extract user info from OIDC claims
  const userName = auth.user?.profile?.given_name || auth.user?.profile?.name || "User";
  const kycTier = (auth.user?.profile?.kyc_tier as number) || 1;
  const kycStatus = (auth.user?.profile?.kyc_status as string) || "pending";

  // Mock data - in real app, these would come from API hooks
  const accountBalance = 125000;
  const availableBalance = 125000;
  const currency = "XAF";

  const tierLimits = {
    1: { daily: 50000, perTransaction: 25000 },
    2: { daily: 500000, perTransaction: 200000 },
  };

  const limits = tierLimits[kycTier as keyof typeof tierLimits] || tierLimits[1];

  const recentTransactions = [
    { id: 1, type: "deposit", amount: 50000, method: "MTN Mobile Money", date: "2024-01-15", status: "completed" },
    { id: 2, type: "withdrawal", amount: 25000, method: "Orange Money", date: "2024-01-14", status: "completed" },
    { id: 3, type: "deposit", amount: 100000, method: "UBA Bank Transfer", date: "2024-01-10", status: "completed" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.welcome", { name: userName })}
        </h1>
        <p className="text-gray-500 mt-1">
          {t("dashboard.tier", { tier: kycTier })} • {t(`kyc.status.${kycStatus}`)}
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t("dashboard.accountBalance")}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatCurrency(accountBalance)} {currency}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t("dashboard.availableBalance")}</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {formatCurrency(availableBalance)} {currency}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a
          href="/self-service/deposit"
          className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <ArrowDownCircle className="w-8 h-8 text-green-600 mb-2" />
          <span className="font-medium text-gray-700">{t("nav.deposit")}</span>
        </a>
        <a
          href="/self-service/withdraw"
          className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <ArrowUpCircle className="w-8 h-8 text-red-600 mb-2" />
          <span className="font-medium text-gray-700">{t("nav.withdraw")}</span>
        </a>
        <a
          href="/self-service/transactions"
          className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
          <span className="font-medium text-gray-700">{t("nav.transactions")}</span>
        </a>
        <a
          href="/self-service/kyc"
          className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <Shield className="w-8 h-8 text-purple-600 mb-2" />
          <span className="font-medium text-gray-700">{t("nav.kyc")}</span>
        </a>
      </div>

      {/* Limits Card */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("dashboard.limits")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">{t("transactions.limits.daily")}</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(limits.daily)} {currency}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">{t("transactions.limits.perTransaction")}</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(limits.perTransaction)} {currency}
            </p>
          </div>
        </div>
        {kycTier < 2 && (
          <p className="text-sm text-blue-600 mt-4">
            <a href="/self-service/kyc" className="hover:underline">
              Complete verification to unlock higher limits →
            </a>
          </p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("dashboard.recentTransactions")}
          </h2>
          <a
            href="/self-service/transactions"
            className="text-sm text-blue-600 hover:underline"
          >
            {t("dashboard.viewAll")}
          </a>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t("dashboard.noTransactions")}</p>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "deposit" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {tx.type === "deposit" ? (
                      <ArrowDownCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {t(`transactions.${tx.type}`)}
                    </p>
                    <p className="text-sm text-gray-500">{tx.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      tx.type === "deposit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "deposit" ? "+" : "-"}
                    {formatCurrency(tx.amount)} {currency}
                  </p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
