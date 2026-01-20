import { useTranslation } from "react-i18next";
import { Check, Lock, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../lib/formatters";
import type { TransactionLimits } from "../../types";

interface TierLimitsCardProps {
  tier: number;
  limits: TransactionLimits;
  isCurrentTier?: boolean;
  currency?: string;
  onUpgrade?: () => void;
}

export function TierLimitsCard({
  tier,
  limits,
  isCurrentTier = false,
  currency = "XAF",
  onUpgrade,
}: TierLimitsCardProps) {
  const { t } = useTranslation();

  const tierNames = {
    1: t("kyc.tier1"),
    2: t("kyc.tier2"),
  };

  const tierRequirements = {
    1: ["Phone verification", "Email verification"],
    2: [
      t("kyc.documents.id_front"),
      t("kyc.documents.id_back"),
      t("kyc.documents.selfie_with_id"),
    ],
  };

  return (
    <div
      className={`card relative ${
        isCurrentTier
          ? "border-blue-200 bg-blue-50/50"
          : "border-gray-200 opacity-75"
      }`}
    >
      {isCurrentTier && (
        <div className="absolute -top-3 left-4">
          <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            Current Tier
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t("dashboard.tier", { tier })} - {tierNames[tier as keyof typeof tierNames]}
          </h3>
        </div>
        {isCurrentTier && (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600" />
          </div>
        )}
        {!isCurrentTier && tier > 1 && (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{t("transactions.limits.daily")}</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(limits.daily, currency)} {currency}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{t("transactions.limits.perTransaction")}</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(limits.perTransaction, currency)} {currency}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Monthly</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(limits.monthly, currency)} {currency}
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
        <ul className="space-y-1">
          {tierRequirements[tier as keyof typeof tierRequirements]?.map((req, idx) => (
            <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {!isCurrentTier && onUpgrade && tier > 1 && (
        <button
          onClick={onUpgrade}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <span>Upgrade to Tier {tier}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface LimitsProgressProps {
  limits: TransactionLimits;
  currency?: string;
}

export function LimitsProgress({ limits, currency = "XAF" }: LimitsProgressProps) {
  const { t } = useTranslation();

  const dailyUsed = limits.daily - limits.remaining.daily;
  const dailyPercent = (dailyUsed / limits.daily) * 100;

  const monthlyUsed = limits.monthly - limits.remaining.monthly;
  const monthlyPercent = (monthlyUsed / limits.monthly) * 100;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">{t("transactions.limits.daily")}</span>
          <span className="text-sm text-gray-700">
            {formatCurrency(dailyUsed, currency)} / {formatCurrency(limits.daily, currency)} {currency}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              dailyPercent > 90 ? "bg-red-500" : dailyPercent > 70 ? "bg-yellow-500" : "bg-blue-600"
            }`}
            style={{ width: `${Math.min(dailyPercent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {t("transactions.limits.remaining")}: {formatCurrency(limits.remaining.daily, currency)} {currency}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">Monthly</span>
          <span className="text-sm text-gray-700">
            {formatCurrency(monthlyUsed, currency)} / {formatCurrency(limits.monthly, currency)} {currency}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              monthlyPercent > 90 ? "bg-red-500" : monthlyPercent > 70 ? "bg-yellow-500" : "bg-green-600"
            }`}
            style={{ width: `${Math.min(monthlyPercent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {t("transactions.limits.remaining")}: {formatCurrency(limits.remaining.monthly, currency)} {currency}
        </p>
      </div>
    </div>
  );
}
