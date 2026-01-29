import {
	Eye as EyeIcon,
	EyeOff as EyeOffIcon,
	Loader2 as Loader2Icon,
	TrendingDown as TrendingDownIcon,
	TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { type ElementType, useState } from "react";
import { useTranslation } from "react-i18next";

const TrendingUp = TrendingUpIcon as ElementType;
const TrendingDown = TrendingDownIcon as ElementType;
const Eye = EyeIcon as ElementType;
const EyeOff = EyeOffIcon as ElementType;
const Loader2 = Loader2Icon as ElementType;

import { formatCurrency } from "../../lib/formatters";

interface BalanceDisplayProps {
	balance: number;
	availableBalance?: number;
	currency?: string;
	isLoading?: boolean;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	size?: "sm" | "md" | "lg";
}

export function BalanceDisplay({
	balance,
	availableBalance,
	currency = "XAF",
	isLoading = false,
	trend,
	size = "md",
}: BalanceDisplayProps) {
	const { t } = useTranslation();
	const [showBalance, setShowBalance] = useState(true);

	const sizeStyles = {
		sm: {
			balance: "text-xl",
			available: "text-base",
			label: "text-xs",
		},
		md: {
			balance: "text-3xl",
			available: "text-lg",
			label: "text-sm",
		},
		lg: {
			balance: "text-4xl",
			available: "text-xl",
			label: "text-base",
		},
	};

	const styles = sizeStyles[size];

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<p className={`${styles.label} text-gray-500`}>
					{t("dashboard.accountBalance")}
				</p>
				<button
					onClick={() => setShowBalance(!showBalance)}
					className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
					aria-label={showBalance ? "Hide balance" : "Show balance"}
				>
					{showBalance ? (
						<Eye className="w-4 h-4 text-gray-400" />
					) : (
						<EyeOff className="w-4 h-4 text-gray-400" />
					)}
				</button>
			</div>

			<div className="flex items-baseline gap-2">
				<p className={`${styles.balance} font-bold text-gray-900`}>
					{showBalance ? formatCurrency(balance, currency) : "••••••"}
				</p>
				<span className="text-gray-500 font-medium">{currency}</span>
			</div>

			{trend && showBalance && (
				<div className="flex items-center gap-1">
					{trend.isPositive ? (
						<TrendingUp className="w-4 h-4 text-green-600" />
					) : (
						<TrendingDown className="w-4 h-4 text-red-600" />
					)}
					<span
						className={`text-sm font-medium ${
							trend.isPositive ? "text-green-600" : "text-red-600"
						}`}
					>
						{trend.isPositive ? "+" : "-"}
						{formatCurrency(Math.abs(trend.value), currency)} {currency}
					</span>
					<span className="text-sm text-gray-400">this month</span>
				</div>
			)}

			{availableBalance !== undefined && availableBalance !== balance && (
				<div className="pt-2 border-t border-gray-100">
					<p className={`${styles.label} text-gray-500`}>
						{t("dashboard.availableBalance")}
					</p>
					<p className={`${styles.available} font-semibold text-green-600`}>
						{showBalance
							? `${formatCurrency(availableBalance, currency)} ${currency}`
							: "••••••"}
					</p>
				</div>
			)}
		</div>
	);
}
