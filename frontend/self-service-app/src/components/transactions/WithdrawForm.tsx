import { ArrowUpCircle, Check, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PaymentMethodId, TransactionLimits } from "@/types";
import { formatCurrency } from "../../lib/formatters";
import {
	getAuthenticatorTypeLabel,
	hasPlatformAuthenticator,
	isWebAuthnSupported,
	requestStepUpAuth,
} from "../../lib/webauthn";
import { AmountInput } from "./AmountInput";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

interface WithdrawFormProps {
	limits: TransactionLimits;
	kycTier: number;
	availableBalance: number;
	currency?: string;
	accessToken: string;
	onSubmit: (data: {
		amount: number;
		paymentMethod: PaymentMethodId;
		stepUpToken?: string;
	}) => Promise<void>;
	onSuccess?: () => void;
}

export function WithdrawForm({
	limits,
	kycTier,
	availableBalance,
	currency = "XAF",
	accessToken,
	onSubmit,
	onSuccess,
}: WithdrawFormProps) {
	const { t } = useTranslation();
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(
		null,
	);
	const [amount, setAmount] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [showStepUp, setShowStepUp] = useState(false);
	const [authenticatorLabel, setAuthenticatorLabel] =
		useState("Biometric / PIN");

	// Check for platform authenticator on mount
	useState(() => {
		hasPlatformAuthenticator().then((hasPlatform) => {
			setAuthenticatorLabel(getAuthenticatorTypeLabel(hasPlatform));
		});
	});

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
		if (amount > availableBalance) {
			return t("errors.insufficientFunds");
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

		// Show step-up authentication for withdrawals
		setShowStepUp(true);
	};

	const handleStepUpAuth = async () => {
		setIsSubmitting(true);
		setError(null);

		try {
			let stepUpToken: string | undefined;

			// Try WebAuthn step-up if supported
			if (isWebAuthnSupported()) {
				const result = await requestStepUpAuth(accessToken);
				if (!result.verified) {
					setError("Authentication failed. Please try again.");
					setIsSubmitting(false);
					return;
				}
				stepUpToken = result.token;
			}

			// Proceed with withdrawal
			await onSubmit({ amount, paymentMethod: selectedMethod!, stepUpToken });
			setSuccess(true);
			setShowStepUp(false);
			onSuccess?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : t("errors.generic"));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSkipStepUp = async () => {
		// For demo/fallback - in production this would require alternative verification
		setIsSubmitting(true);
		setError(null);

		try {
			await onSubmit({ amount, paymentMethod: selectedMethod! });
			setSuccess(true);
			setShowStepUp(false);
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
					{t("transactions.withdrawal")}: {formatCurrency(amount, currency)}{" "}
					{currency}
				</p>
				{selectedMethod && (
					<p className="text-sm text-gray-400">
						via {t(`paymentMethods.${selectedMethod}`)}
					</p>
				)}
			</div>
		);
	}

	if (showStepUp) {
		return (
			<div className="text-center py-8">
				<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<Shield className="w-8 h-8 text-blue-600" />
				</div>
				<h2 className="text-xl font-semibold text-gray-900 mb-2">
					Verify Your Identity
				</h2>
				<p className="text-gray-500 mb-6">
					For your security, please confirm this withdrawal of{" "}
					<strong>
						{formatCurrency(amount, currency)} {currency}
					</strong>
				</p>

				{error && (
					<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
						{error}
					</div>
				)}

				<div className="space-y-3">
					<button
						onClick={handleStepUpAuth}
						disabled={isSubmitting}
						className="btn-primary w-full py-3"
					>
						{isSubmitting ? (
							<span className="flex items-center justify-center gap-2">
								<Loader2 className="w-5 h-5 animate-spin" />
								Verifying...
							</span>
						) : (
							`Use ${authenticatorLabel}`
						)}
					</button>
					<button
						onClick={() => setShowStepUp(false)}
						disabled={isSubmitting}
						className="btn-secondary w-full py-3"
					>
						{t("common.cancel")}
					</button>
					{/* Fallback for demo purposes */}
					<button
						onClick={handleSkipStepUp}
						disabled={isSubmitting}
						className="text-sm text-gray-500 hover:text-gray-700"
					>
						Skip verification (demo only)
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center">
				<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<ArrowUpCircle className="w-8 h-8 text-red-600" />
				</div>
				<h1 className="text-2xl font-bold text-gray-900">
					{t("transactions.withdrawal")}
				</h1>
				<p className="text-gray-500 mt-2">
					Available: {formatCurrency(availableBalance, currency)} {currency}
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
					max={Math.min(limits.perTransaction, availableBalance)}
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
