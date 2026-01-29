import { AlertCircle, Check, Clock, Shield, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { KycStatus } from "@/types";

interface KycStatusBadgeProps {
	status: KycStatus;
	tier?: number;
	size?: "sm" | "md" | "lg";
	showIcon?: boolean;
	showTier?: boolean;
}

export function KycStatusBadge({
	status,
	tier = 1,
	size = "md",
	showIcon = true,
	showTier = false,
}: KycStatusBadgeProps) {
	const { t } = useTranslation();

	const statusConfig = {
		pending: {
			icon: Clock,
			bgColor: "bg-gray-100",
			textColor: "text-gray-700",
			iconColor: "text-gray-500",
		},
		uploaded: {
			icon: AlertCircle,
			bgColor: "bg-yellow-100",
			textColor: "text-yellow-700",
			iconColor: "text-yellow-600",
		},
		verified: {
			icon: Check,
			bgColor: "bg-green-100",
			textColor: "text-green-700",
			iconColor: "text-green-600",
		},
		approved: {
			icon: Check,
			bgColor: "bg-green-100",
			textColor: "text-green-700",
			iconColor: "text-green-600",
		},
		rejected: {
			icon: X,
			bgColor: "bg-red-100",
			textColor: "text-red-700",
			iconColor: "text-red-600",
		},
	};

	const sizeStyles = {
		sm: {
			container: "px-2 py-0.5 text-xs",
			icon: "w-3 h-3",
		},
		md: {
			container: "px-3 py-1 text-sm",
			icon: "w-4 h-4",
		},
		lg: {
			container: "px-4 py-2 text-base",
			icon: "w-5 h-5",
		},
	};

	const config = statusConfig[status];
	const styles = sizeStyles[size];
	const Icon = config.icon;

	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.textColor} ${styles.container}`}
		>
			{showIcon && <Icon className={`${styles.icon} ${config.iconColor}`} />}
			{showTier && <span>Tier {tier} •</span>}
			<span>{t(`kyc.status.${status}`)}</span>
		</span>
	);
}

interface KycTierBadgeProps {
	tier: number;
	size?: "sm" | "md" | "lg";
}

export function KycTierBadge({ tier, size = "md" }: KycTierBadgeProps) {
	const { t } = useTranslation();

	const tierConfig = {
		1: {
			bgColor: "bg-gray-100",
			textColor: "text-gray-700",
			iconColor: "text-gray-500",
		},
		2: {
			bgColor: "bg-blue-100",
			textColor: "text-blue-700",
			iconColor: "text-blue-600",
		},
	};

	const sizeStyles = {
		sm: {
			container: "px-2 py-0.5 text-xs",
			icon: "w-3 h-3",
		},
		md: {
			container: "px-3 py-1 text-sm",
			icon: "w-4 h-4",
		},
		lg: {
			container: "px-4 py-2 text-base",
			icon: "w-5 h-5",
		},
	};

	const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig[1];
	const styles = sizeStyles[size];

	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.textColor} ${styles.container}`}
		>
			<Shield className={`${styles.icon} ${config.iconColor}`} />
			<span>{t("dashboard.tier", { tier })}</span>
		</span>
	);
}
