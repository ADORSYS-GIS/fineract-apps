import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { formatCurrency, parseCurrency } from "../../lib/formatters";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  error?: string;
  label?: string;
  placeholder?: string;
  quickAmounts?: number[];
}

export function AmountInput({
  value,
  onChange,
  currency = "XAF",
  min = 100,
  max,
  disabled = false,
  error,
  label,
  placeholder,
  quickAmounts = [5000, 10000, 25000, 50000],
}: AmountInputProps) {
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = useState(value > 0 ? value.toString() : "");

  useEffect(() => {
    if (value > 0 && parseCurrency(displayValue) !== value) {
      setDisplayValue(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setDisplayValue(rawValue);

    const numValue = parseInt(rawValue, 10) || 0;
    onChange(numValue);
  };

  const handleQuickAmount = (amount: number) => {
    setDisplayValue(amount.toString());
    onChange(amount);
  };

  const formattedValue = value > 0 ? formatCurrency(value, currency) : "";

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder || t("transactions.enterAmount")}
          disabled={disabled}
          className={`input text-2xl font-bold text-center pr-16 ${
            error ? "border-red-500 focus:ring-red-500" : ""
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
          {currency}
        </span>
      </div>

      {value > 0 && (
        <p className="text-sm text-gray-500 text-center">
          {formattedValue} {currency}
        </p>
      )}

      {quickAmounts && quickAmounts.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleQuickAmount(amount)}
              disabled={disabled || (max !== undefined && amount > max)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                value === amount
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              } ${
                disabled || (max !== undefined && amount > max)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {formatCurrency(amount, currency)}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      {max && (
        <p className="text-xs text-gray-400 text-center">
          {t("transactions.limits.perTransaction")}: {formatCurrency(max, currency)} {currency}
        </p>
      )}
    </div>
  );
}
