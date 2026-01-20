import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ArrowDownCircle, Loader2, Check } from "lucide-react";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { AmountInput } from "./AmountInput";
import { formatCurrency } from "../../lib/formatters";
import type { PaymentMethodId, TransactionLimits } from "../../types";

interface DepositFormProps {
  limits: TransactionLimits;
  kycTier: number;
  currency?: string;
  onSubmit: (data: { amount: number; paymentMethod: PaymentMethodId }) => Promise<void>;
  onSuccess?: () => void;
}

export function DepositForm({
  limits,
  kycTier,
  currency = "XAF",
  onSubmit,
  onSuccess,
}: DepositFormProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateAmount = (): string | null => {
    if (!amount || amount <= 0) {
      return t("register.errors.required");
    }
    if (amount > limits.perTransaction) {
      return t("errors.limitExceeded");
    }
    if (amount > limits.remaining.daily) {
      return "Exceeds daily remaining limit";
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!selectedMethod) {
      setError(t("transactions.selectMethod"));
      return;
    }

    const validationError = validateAmount();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ amount, paymentMethod: selectedMethod });
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t("transactions.success")}
        </h2>
        <p className="text-gray-500 mb-4">
          {t("transactions.deposit")}: {formatCurrency(amount, currency)} {currency}
        </p>
        {selectedMethod && (
          <p className="text-sm text-gray-400">
            via {t(`paymentMethods.${selectedMethod}`)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowDownCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{t("transactions.deposit")}</h1>
        <p className="text-gray-500 mt-2">
          {t("transactions.limits.perTransaction")}: {formatCurrency(limits.perTransaction, currency)} {currency}
        </p>
      </div>

      {/* Payment Method */}
      <div className="card">
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onSelect={(method) => {
            setSelectedMethod(method);
            setError(null);
          }}
          currentKycTier={kycTier}
          disabled={isSubmitting}
        />
      </div>

      {/* Amount */}
      <div className="card">
        <AmountInput
          value={amount}
          onChange={(value) => {
            setAmount(value);
            setError(null);
          }}
          currency={currency}
          max={limits.perTransaction}
          disabled={isSubmitting}
          label={t("transactions.amount")}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedMethod || !amount}
        className="btn-primary w-full py-3 text-lg"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {t("common.loading")}
          </span>
        ) : (
          t("transactions.confirm")
        )}
      </button>
    </div>
  );
}
