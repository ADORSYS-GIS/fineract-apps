import { RegistrationService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

export interface TransactionLimits {
	tier: number;
	deposit: {
		daily: number;
		perTransaction: number;
		monthly: number;
		remaining: {
			daily: number;
			monthly: number;
		};
	};
	withdrawal: {
		daily: number;
		perTransaction: number;
		monthly: number;
		remaining: {
			daily: number;
			monthly: number;
		};
	};
	paymentMethods: {
		id: string;
		name: string;
		enabled: boolean;
		minAmount: number;
		maxAmount: number;
		requiresKycTier: number;
	}[];
}

// Default limits based on KYC tier
const defaultLimits: Record<
	number,
	Omit<TransactionLimits, "tier" | "paymentMethods">
> = {
	1: {
		deposit: {
			daily: 50000,
			perTransaction: 25000,
			monthly: 150000,
			remaining: { daily: 50000, monthly: 150000 },
		},
		withdrawal: {
			daily: 50000,
			perTransaction: 25000,
			monthly: 150000,
			remaining: { daily: 50000, monthly: 150000 },
		},
	},
	2: {
		deposit: {
			daily: 500000,
			perTransaction: 200000,
			monthly: 2000000,
			remaining: { daily: 500000, monthly: 2000000 },
		},
		withdrawal: {
			daily: 500000,
			perTransaction: 200000,
			monthly: 2000000,
			remaining: { daily: 500000, monthly: 2000000 },
		},
	},
};

const defaultPaymentMethods = [
	{
		id: "mtn_transfer",
		name: "MTN Mobile Money",
		enabled: true,
		minAmount: 100,
		maxAmount: 500000,
		requiresKycTier: 1,
	},
	{
		id: "orange_transfer",
		name: "Orange Money",
		enabled: true,
		minAmount: 100,
		maxAmount: 500000,
		requiresKycTier: 1,
	},
	{
		id: "cinetpay",
		name: "CinetPay",
		enabled: true,
		minAmount: 100,
		maxAmount: 500000,
		requiresKycTier: 1,
	},
	{
		id: "uba_bank_transfer",
		name: "UBA Bank Transfer",
		enabled: true,
		minAmount: 1000,
		maxAmount: 5000000,
		requiresKycTier: 2,
	},
	{
		id: "afriland_bank_transfer",
		name: "Afriland Bank Transfer",
		enabled: true,
		minAmount: 1000,
		maxAmount: 5000000,
		requiresKycTier: 2,
	},
];

export function useLimits() {
	const auth = useAuth();
	const externalId = auth.user?.profile?.fineract_external_id as
		| string
		| undefined;
	const kycTier = (auth.user?.profile?.kyc_tier as number) || 1;

	const query = useQuery({
		queryKey: ["limits", externalId],
		queryFn: () => {
			if (!externalId) {
				throw new Error("Not authenticated");
			}
			return RegistrationService.getApiRegistrationLimits({
				xExternalId: externalId,
			}) as unknown as TransactionLimits;
		},
		enabled: !!externalId && !!auth.user?.access_token,
		staleTime: 60 * 1000, // 1 minute
		placeholderData: {
			tier: kycTier,
			...(defaultLimits[kycTier] || defaultLimits[1]),
			paymentMethods: defaultPaymentMethods,
		},
	});

	// Filter payment methods by KYC tier
	const availablePaymentMethods = (
		query.data?.paymentMethods || defaultPaymentMethods
	).filter((method) => method.requiresKycTier <= kycTier);

	return {
		...query,
		availablePaymentMethods,
	};
}

export function useCanTransact(amount: number, type: "deposit" | "withdrawal") {
	const { data: limits } = useLimits();

	if (!limits) {
		return { canTransact: false, reason: "Loading..." };
	}

	const transactionLimits = limits[type];

	if (amount > transactionLimits.perTransaction) {
		return {
			canTransact: false,
			reason: `Exceeds per-transaction limit of ${transactionLimits.perTransaction} XAF`,
		};
	}

	if (amount > transactionLimits.remaining.daily) {
		return {
			canTransact: false,
			reason: `Exceeds daily remaining limit of ${transactionLimits.remaining.daily} XAF`,
		};
	}

	if (amount > transactionLimits.remaining.monthly) {
		return {
			canTransact: false,
			reason: `Exceeds monthly remaining limit of ${transactionLimits.remaining.monthly} XAF`,
		};
	}

	return { canTransact: true, reason: null };
}
