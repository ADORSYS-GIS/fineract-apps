import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowUpCircle,
	Building2,
	Check,
	Shield,
	Smartphone,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

export const Route = createFileRoute("/withdraw")({
	component: WithdrawPage,
});

type PaymentMethod =
	| "mtn_transfer"
	| "orange_transfer"
	| "uba_bank_transfer"
	| "afriland_bank_transfer";

interface PaymentMethodConfig {
	id: PaymentMethod;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
	requiresKyc2: boolean;
}

function WithdrawPage() {
	const auth = useAuth();
	const { t } = useTranslation();
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
		null,
	);
	const [amount, setAmount] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showStepUp, setShowStepUp] = useState(false);

	const kycTier = (auth.user?.profile?.kyc_tier as number) || 1;
	const currency = "XAF";

	// Mock available balance
	const availableBalance = 125000;

	const tierLimits = {
		1: { daily: 50000, perTransaction: 25000 },
		2: { daily: 500000, perTransaction: 200000 },
	};

	const limits =
		tierLimits[kycTier as keyof typeof tierLimits] || tierLimits[1];

	const paymentMethods: PaymentMethodConfig[] = [
		{
			id: "mtn_transfer",
			icon: <Smartphone className="w-6 h-6" />,
			color: "text-yellow-600",
			bgColor: "bg-yellow-100",
			requiresKyc2: false,
		},
		{
			id: "orange_transfer",
			icon: <Smartphone className="w-6 h-6" />,
			color: "text-orange-600",
			bgColor: "bg-orange-100",
			requiresKyc2: false,
		},
		{
			id: "uba_bank_transfer",
			icon: <Building2 className="w-6 h-6" />,
			color: "text-red-600",
			bgColor: "bg-red-100",
			requiresKyc2: true,
		},
		{
			id: "afriland_bank_transfer",
			icon: <Building2 className="w-6 h-6" />,
			color: "text-green-600",
			bgColor: "bg-green-100",
			requiresKyc2: true,
		},
	];

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("fr-CM", {
			style: "decimal",
			minimumFractionDigits: 0,
		}).format(value);
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, "");
		setAmount(value);
		setError(null);
	};

	const validateAmount = (): boolean => {
		const numAmount = parseInt(amount, 10);
		if (!numAmount || numAmount <= 0) {
			setError(t("register.errors.required"));
			return false;
		}
		if (numAmount > limits.perTransaction) {
			setError(t("errors.limitExceeded"));
			return false;
		}
		if (numAmount > availableBalance) {
			setError(t("errors.insufficientFunds"));
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!selectedMethod) {
			setError(t("transactions.selectMethod"));
			return;
		}

		if (!validateAmount()) {
			return;
		}

		// Show step-up authentication for withdrawals
		setShowStepUp(true);
	};

	const handleStepUpComplete = async () => {
		setShowStepUp(false);
		setIsSubmitting(true);
		setError(null);

		try {
			// In a real app, this would call the Fineract API
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setSuccess(true);
		} catch (_err) {
			setError(t("errors.generic"));
		} finally {
			setIsSubmitting(false);
		}
	};

	if (success) {
		return (
			<div className="max-w-md mx-auto">
				<div className="card text-center">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Check className="w-8 h-8 text-green-600" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						{t("transactions.success")}
					</h2>
					<p className="text-gray-500 mb-4">
						{t("transactions.withdrawal")}:{" "}
						{formatCurrency(parseInt(amount, 10))} {currency}
					</p>
					<p className="text-sm text-gray-400 mb-6">
						via {t(`paymentMethods.${selectedMethod}`)}
					</p>
					<a
						href="/self-service/dashboard"
						className="btn-primary inline-block"
					>
						{t("nav.dashboard")}
					</a>
				</div>
			</div>
		);
	}

	if (showStepUp) {
		return (
			<div className="max-w-md mx-auto">
				<div className="card text-center">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Shield className="w-8 h-8 text-blue-600" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Verify Your Identity
					</h2>
					<p className="text-gray-500 mb-6">
						For your security, please confirm this withdrawal using your
						authenticator.
					</p>
					<div className="space-y-3">
						<button
							onClick={handleStepUpComplete}
							className="btn-primary w-full py-3"
						>
							Use Face ID / Touch ID
						</button>
						<button
							onClick={() => setShowStepUp(false)}
							className="btn-secondary w-full py-3"
						>
							{t("common.cancel")}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto space-y-6">
			{/* Header */}
			<div className="text-center">
				<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<ArrowUpCircle className="w-8 h-8 text-red-600" />
				</div>
				<h1 className="text-2xl font-bold text-gray-900">
					{t("transactions.withdrawal")}
				</h1>
				<p className="text-gray-500 mt-2">
					Available: {formatCurrency(availableBalance)} {currency}
				</p>
			</div>

			{/* Payment Method Selection */}
			<div className="card">
				<h2 className="font-semibold text-gray-900 mb-4">
					{t("transactions.paymentMethod")}
				</h2>
				<div className="grid grid-cols-2 gap-3">
					{paymentMethods.map((method) => {
						const isDisabled = method.requiresKyc2 && kycTier < 2;
						return (
							<button
								key={method.id}
								onClick={() => {
									if (!isDisabled) {
										setSelectedMethod(method.id);
										setError(null);
									}
								}}
								disabled={isDisabled}
								className={`p-4 rounded-lg border-2 transition-all text-left relative ${
									isDisabled
										? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
										: selectedMethod === method.id
											? "border-blue-500 bg-blue-50"
											: "border-gray-200 hover:border-gray-300"
								}`}
							>
								<div
									className={`w-10 h-10 ${method.bgColor} rounded-full flex items-center justify-center mb-2`}
								>
									<span className={method.color}>{method.icon}</span>
								</div>
								<p className="font-medium text-gray-900 text-sm">
									{t(`paymentMethods.${method.id}`)}
								</p>
								{isDisabled && (
									<span className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
										KYC 2
									</span>
								)}
							</button>
						);
					})}
				</div>
				{kycTier < 2 && (
					<p className="text-sm text-blue-600 mt-4">
						<a href="/self-service/kyc" className="hover:underline">
							Complete verification for bank transfers →
						</a>
					</p>
				)}
			</div>

			{/* Amount Input */}
			<div className="card">
				<h2 className="font-semibold text-gray-900 mb-4">
					{t("transactions.amount")}
				</h2>
				<div className="relative">
					<input
						type="text"
						value={amount}
						onChange={handleAmountChange}
						placeholder={t("transactions.enterAmount")}
						className="input text-2xl font-bold text-center pr-16"
						disabled={isSubmitting}
					/>
					<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
						{currency}
					</span>
				</div>
				{amount && (
					<p className="text-sm text-gray-500 mt-2 text-center">
						{formatCurrency(parseInt(amount, 10) || 0)} {currency}
					</p>
				)}
				<p className="text-sm text-gray-400 mt-2 text-center">
					{t("transactions.limits.perTransaction")}:{" "}
					{formatCurrency(limits.perTransaction)} {currency}
				</p>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
					{error}
				</div>
			)}

			{/* Submit Button */}
			<button
				onClick={handleSubmit}
				className="btn-primary w-full py-3 text-lg"
				disabled={isSubmitting || !selectedMethod || !amount}
			>
				{isSubmitting ? t("common.loading") : t("transactions.confirm")}
			</button>
		</div>
	);
}
