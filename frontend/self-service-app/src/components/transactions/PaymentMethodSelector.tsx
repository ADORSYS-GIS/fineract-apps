import { Building2, Lock, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PaymentMethodId } from "@/types";

export interface PaymentMethodOption {
	id: PaymentMethodId;
	name: string;
	icon: "mobile" | "bank";
	color: string;
	bgColor: string;
	enabled: boolean;
	requiresKycTier: number;
}

interface PaymentMethodSelectorProps {
	selectedMethod: PaymentMethodId | null;
	onSelect: (method: PaymentMethodId) => void;
	currentKycTier: number;
	disabled?: boolean;
	methods?: PaymentMethodOption[];
}

const DEFAULT_METHODS: PaymentMethodOption[] = [
	{
		id: "mtn_transfer",
		name: "MTN Mobile Money",
		icon: "mobile",
		color: "text-yellow-600",
		bgColor: "bg-yellow-100",
		enabled: true,
		requiresKycTier: 1,
	},
	{
		id: "orange_transfer",
		name: "Orange Money",
		icon: "mobile",
		color: "text-orange-600",
		bgColor: "bg-orange-100",
		enabled: true,
		requiresKycTier: 1,
	},
	{
		id: "cinetpay",
		name: "CinetPay",
		icon: "mobile",
		color: "text-blue-600",
		bgColor: "bg-blue-100",
		enabled: true,
		requiresKycTier: 1,
	},
	{
		id: "uba_bank_transfer",
		name: "UBA Bank Transfer",
		icon: "bank",
		color: "text-red-600",
		bgColor: "bg-red-100",
		enabled: true,
		requiresKycTier: 2,
	},
	{
		id: "afriland_bank_transfer",
		name: "Afriland Bank Transfer",
		icon: "bank",
		color: "text-green-600",
		bgColor: "bg-green-100",
		enabled: true,
		requiresKycTier: 2,
	},
];

export function PaymentMethodSelector({
	selectedMethod,
	onSelect,
	currentKycTier,
	disabled = false,
	methods = DEFAULT_METHODS,
}: PaymentMethodSelectorProps) {
	const { t } = useTranslation();

	const getIcon = (iconType: "mobile" | "bank") => {
		return iconType === "mobile" ? (
			<Smartphone className="w-6 h-6" />
		) : (
			<Building2 className="w-6 h-6" />
		);
	};

	return (
		<div className="space-y-3">
			<h3 className="font-semibold text-gray-900">
				{t("transactions.paymentMethod")}
			</h3>
			<div className="grid grid-cols-2 gap-3">
				{methods.map((method) => {
					const isLocked = method.requiresKycTier > currentKycTier;
					const isDisabled = disabled || isLocked || !method.enabled;
					const isSelected = selectedMethod === method.id;

					return (
						<button
							key={method.id}
							onClick={() => !isDisabled && onSelect(method.id)}
							disabled={isDisabled}
							className={`p-4 rounded-lg border-2 transition-all text-left relative ${
								isDisabled
									? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
									: isSelected
										? "border-blue-500 bg-blue-50"
										: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
							}`}
						>
							<div
								className={`w-10 h-10 ${method.bgColor} rounded-full flex items-center justify-center mb-2`}
							>
								<span className={method.color}>{getIcon(method.icon)}</span>
							</div>
							<p className="font-medium text-gray-900 text-sm">
								{t(`paymentMethods.${method.id}`)}
							</p>

							{isLocked && (
								<div className="absolute top-2 right-2 flex items-center gap-1">
									<Lock className="w-3 h-3 text-gray-400" />
									<span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
										KYC {method.requiresKycTier}
									</span>
								</div>
							)}

							{isSelected && !isDisabled && (
								<div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
									<svg
										className="w-3 h-3 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={3}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
							)}
						</button>
					);
				})}
			</div>

			{currentKycTier < 2 && (
				<p className="text-sm text-blue-600">
					<a href="/self-service/kyc" className="hover:underline">
						Complete verification for bank transfers →
					</a>
				</p>
			)}
		</div>
	);
}
