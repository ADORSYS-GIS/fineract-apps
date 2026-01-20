/**
 * Formatting utilities for currency, dates, and numbers
 */

const DEFAULT_LOCALE = "fr-CM";
const DEFAULT_CURRENCY = "XAF";

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  // XAF doesn't have decimal places
  const decimalPlaces = currency === "XAF" ? 0 : 2;

  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(amount);
}

/**
 * Format currency with symbol
 */
export function formatCurrencyWithSymbol(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  return `${formatCurrency(amount, currency, locale)} ${currency}`;
}

/**
 * Format a date string
 */
export function formatDate(
  date: string | Date | number[],
  locale: string = DEFAULT_LOCALE,
  options?: Intl.DateTimeFormatOptions
): string {
  let dateObj: Date;

  if (Array.isArray(date)) {
    // Fineract date format: [year, month, day]
    dateObj = new Date(date[0], date[1] - 1, date[2]);
  } else if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Format a date with time
 */
export function formatDateTime(
  date: string | Date | number[],
  locale: string = DEFAULT_LOCALE
): string {
  return formatDate(date, locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = DEFAULT_LOCALE
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
  }
}

/**
 * Format a phone number for Cameroon
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Handle Cameroon numbers
  if (digits.startsWith("237")) {
    const local = digits.slice(3);
    return `+237 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }

  if (digits.length === 9) {
    return `+237 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return phone;
}

/**
 * Format account number with masking
 */
export function formatAccountNumber(accountNo: string, showFull: boolean = false): string {
  if (showFull || accountNo.length <= 8) {
    return accountNo;
  }

  const start = accountNo.slice(0, 4);
  const end = accountNo.slice(-4);
  return `${start}****${end}`;
}

/**
 * Parse a currency string back to number
 */
export function parseCurrency(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.-]/g, "");
  return parseFloat(cleaned) || 0;
}

/**
 * Format a percentage
 */
export function formatPercentage(
  value: number,
  decimalPlaces: number = 1,
  locale: string = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value / 100);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Get initials from a name
 */
export function getInitials(name: string, maxChars: number = 2): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, maxChars)
    .join("")
    .toUpperCase();
}
