import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { fineractApi } from "@/services/api";
import {
	assetApi,
	type CreateAssetRequest,
	extractErrorMessage,
} from "@/services/assetApi";

export interface AssetFormData {
	// Step 1: Select Liquidity Partner
	lpClientId: number | null;
	lpClientName: string;
	// Step 2: Asset Details
	name: string;
	symbol: string;
	category: string;
	description: string;
	imageUrl: string;
	// Step 2b: Bond Details (when category = BONDS)
	bondType: "COUPON" | "DISCOUNT";
	dayCountConvention: "ACT_360" | "ACT_365" | "THIRTY_360";
	issuerCountry: string;
	issuerName: string;
	isinCode: string;
	maturityDate: string;
	issueDate: string;
	interestRate: number;
	couponFrequencyMonths: number;
	nextCouponDate: string;
	// Step 3: Pricing
	faceValue: number;
	pricingMode: "spread" | "manual";
	spreadPercent: number;
	issuerPrice: number;
	lpBidPrice: number;
	lpAskPrice: number;
	tradingFeePercent: number;
	// Step 4: Supply & Limits
	maxPositionPercent: number;
	maxOrderSize: number;
	dailyTradeLimitXaf: number;
	minOrderSize: number;
	minOrderCashAmount: number;
	totalSupply: number;
	decimalPlaces: number;
	lockupDays: number;
	// Income distribution (non-bond)
	incomeType: string;
	incomeRate: number;
	distributionFrequencyMonths: number;
	nextDistributionDate: string;
	// Tax configuration (Cameroon/CEMAC)
	registrationDutyEnabled: boolean;
	registrationDutyRate: number;
	ircmEnabled: boolean;
	ircmRateOverride: number;
	ircmExempt: boolean;
	capitalGainsTaxEnabled: boolean;
	capitalGainsRate: number;
	tvaEnabled: boolean;
	tvaRate: number;
	// Bond classification (affects IRCM auto-rate)
	isBvmacListed: boolean;
	isGovernmentBond: boolean;
}

const toDateStr = (d: Date) => d.toISOString().split("T")[0];
const daysFromNow = (n: number) =>
	toDateStr(new Date(Date.now() + n * 86400000));

/** Default distribution frequency per income type. */
const INCOME_TYPE_DEFAULTS: Record<
	string,
	{ frequency: number; offsetDays: number }
> = {
	RENT: { frequency: 1, offsetDays: 30 },
	DIVIDEND: { frequency: 12, offsetDays: 365 },
	HARVEST_YIELD: { frequency: 6, offsetDays: 180 },
	PROFIT_SHARE: { frequency: 12, offsetDays: 365 },
};

const initialFormData: AssetFormData = {
	lpClientId: null,
	lpClientName: "",
	name: "",
	symbol: "",
	category: "REAL_ESTATE",
	description: "",
	imageUrl: "",
	bondType: "COUPON",
	dayCountConvention: "ACT_365",
	issuerCountry: "",
	issuerName: "",
	isinCode: "",
	maturityDate: "",
	issueDate: "",
	interestRate: 0,
	couponFrequencyMonths: 12,
	nextCouponDate: "",
	faceValue: 0,
	pricingMode: "spread",
	spreadPercent: 0.3,
	issuerPrice: 0,
	lpBidPrice: 0,
	lpAskPrice: 0,
	tradingFeePercent: 0.5,
	maxPositionPercent: 0,
	maxOrderSize: 0,
	dailyTradeLimitXaf: 0,
	minOrderSize: 0,
	minOrderCashAmount: 0,
	totalSupply: 0,
	decimalPlaces: 0,
	lockupDays: 0,
	incomeType: "",
	incomeRate: 0,
	distributionFrequencyMonths: 12,
	nextDistributionDate: "",
	registrationDutyEnabled: true,
	registrationDutyRate: 2,
	ircmEnabled: false,
	ircmRateOverride: 0,
	ircmExempt: false,
	capitalGainsTaxEnabled: false,
	capitalGainsRate: 0,
	tvaEnabled: false,
	tvaRate: 0,
	isBvmacListed: false,
	isGovernmentBond: false,
};

function validateLiquidityPartner(data: AssetFormData): string[] {
	const errors: string[] = [];
	if (!data.lpClientId) errors.push("Select a liquidity partner");
	return errors;
}

function validateAssetDetails(data: AssetFormData): string[] {
	const errors: string[] = [];
	if (!data.name.trim()) errors.push("Name is required");
	if (!data.symbol.trim()) errors.push("Symbol is required");
	else if (!/^[A-Z][A-Z0-9-]{0,9}$/.test(data.symbol))
		errors.push("Symbol must be 1–10 chars: uppercase letters, digits, or hyphens, starting with a letter");
	return errors;
}

function validateBondDetails(data: AssetFormData): string[] {
	const errors: string[] = [];
	if (!data.bondType) errors.push("Bond type is required");
	if (!data.issuerName.trim()) errors.push("Issuer is required");
	if (!data.maturityDate) errors.push("Maturity date is required");
	if (data.bondType === "COUPON") {
		if (data.interestRate <= 0)
			errors.push("Interest rate must be greater than 0");
		if (![1, 3, 6, 12].includes(data.couponFrequencyMonths))
			errors.push("Coupon frequency must be 1, 3, 6, or 12 months");
		if (!data.nextCouponDate) errors.push("First coupon date is required");
	}
	if (data.bondType === "DISCOUNT" && data.faceValue <= 0)
		errors.push("Face value is required for BTA (discount) bonds");
	return errors;
}

function validatePricingFees(data: AssetFormData): string[] {
	const errors: string[] = [];
	if (data.issuerPrice <= 0) errors.push("Issuer price must be greater than 0");
	if (data.tradingFeePercent < 0 || data.tradingFeePercent > 50)
		errors.push("Trading fee must be 0-50%");
	if (data.lpAskPrice <= 0) errors.push("LP ask price must be greater than 0");
	if (data.lpAskPrice < data.issuerPrice)
		errors.push("LP ask price must be >= issuer price");
	if (data.lpBidPrice < 0) errors.push("LP bid price must be >= 0");
	if (data.lpBidPrice > 0 && data.lpBidPrice > data.lpAskPrice)
		errors.push("LP bid price must be <= LP ask price");
	return errors;
}

function validateSupply(data: AssetFormData): string[] {
	const errors: string[] = [];
	if (data.totalSupply <= 0) errors.push("Total supply must be greater than 0");
	return errors;
}

export const useCreateAsset = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<AssetFormData>(initialFormData);

	const isBond = formData.category === "BONDS";
	const steps = isBond
		? [
				"Select Liquidity Partner",
				"Asset Details",
				"Bond Details",
				"Pricing & Fees",
				"Supply",
				"Tax Configuration",
				"Review & Create",
			]
		: [
				"Select Liquidity Partner",
				"Asset Details",
				"Pricing & Fees",
				"Supply",
				"Income Distribution",
				"Tax Configuration",
				"Review & Create",
			];

	// Fetch entity clients (companies) from Fineract
	const { data: clients, isLoading: isLoadingClients } = useQuery({
		queryKey: ["entity-clients"],
		queryFn: () =>
			fineractApi.clients.getV1Clients({
				limit: 100,
				orderBy: "displayName",
				sortOrder: "ASC",
			}),
		select: (res) =>
			(res.pageItems ?? []).filter((c) => {
				const client = c as unknown as {
					legalForm?: { id?: number };
					displayName?: string;
				};
				const name = client.displayName?.toLowerCase() ?? "";
				return (
					client.legalForm?.id === 2 &&
					!name.includes("platform fee collector") &&
					!name.includes("tax authority")
				);
			}),
	});

	const createMutation = useMutation({
		mutationFn: (data: CreateAssetRequest) => assetApi.createAsset(data),
		onSuccess: () => {
			toast.success("Asset created successfully!");
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			navigate({ to: "/dashboard" });
		},
		onError: (error: unknown) => {
			toast.error(`Failed to create asset: ${extractErrorMessage(error)}`);
		},
	});

	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	const validateStep = (step: number): string[] => {
		const stepName = steps[step];
		const validators: Record<string, (data: AssetFormData) => string[]> = {
			"Select Liquidity Partner": validateLiquidityPartner,
			"Asset Details": validateAssetDetails,
			"Bond Details": validateBondDetails,
			"Pricing & Fees": validatePricingFees,
			Supply: validateSupply,
			"Income Distribution": () => [],
			"Tax Configuration": () => [],
			"Review & Create": () => [],
		};
		const validator = validators[stepName];
		return validator ? validator(formData) : [];
	};

	const updateFormData = (updates: Partial<AssetFormData>) => {
		setFormData((prev) => {
			const next = { ...prev, ...updates };
			// Auto-set dayCountConvention and clear stale coupon fields when bondType changes
			if (
				updates.bondType !== undefined &&
				updates.bondType !== prev.bondType
			) {
				next.dayCountConvention =
					updates.bondType === "DISCOUNT" ? "ACT_360" : "ACT_365";
				if (updates.bondType === "DISCOUNT") {
					next.interestRate = 0;
					next.couponFrequencyMonths = 12;
					next.nextCouponDate = "";
				}
			}
			// Auto-derive ask/bid from spread when in spread mode
			const affectsSpread =
				updates.pricingMode !== undefined ||
				updates.spreadPercent !== undefined ||
				updates.issuerPrice !== undefined;
			if (affectsSpread && next.pricingMode === "spread" && next.issuerPrice > 0) {
				const s = next.spreadPercent / 100;
				next.lpAskPrice = Math.round(next.issuerPrice * (1 + s));
				next.lpBidPrice = Math.round(next.issuerPrice * (1 - s));
			}
			// Auto-set income defaults when income type changes
			if (
				updates.incomeType !== undefined &&
				updates.incomeType !== prev.incomeType
			) {
				const defaults = INCOME_TYPE_DEFAULTS[updates.incomeType];
				if (defaults) {
					next.distributionFrequencyMonths = defaults.frequency;
					next.nextDistributionDate = daysFromNow(defaults.offsetDays);
				} else {
					// Cleared to "None"
					next.distributionFrequencyMonths = 12;
					next.nextDistributionDate = "";
				}
			}
			return next;
		});
		setValidationErrors([]);
	};

	const nextStep = () => {
		const errors = validateStep(currentStep);
		if (errors.length > 0) {
			setValidationErrors(errors);
			return;
		}
		setValidationErrors([]);
		if (currentStep < steps.length - 1) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const handleSubmit = () => {
		if (!formData.lpClientId) {
			toast.error("Please select a liquidity partner");
			return;
		}

		const request: CreateAssetRequest = {
			name: formData.name,
			symbol: formData.symbol,
			currencyCode: formData.symbol,
			description: formData.description || undefined,
			imageUrl: formData.imageUrl || undefined,
			category: formData.category,
			issuerPrice: formData.issuerPrice,
			faceValue: formData.faceValue || undefined,
			lpBidPrice: formData.lpBidPrice,
			lpAskPrice: formData.lpAskPrice,
			tradingFeePercent: formData.tradingFeePercent / 100,
			totalSupply: formData.totalSupply,
			decimalPlaces: formData.decimalPlaces,
			lpClientId: formData.lpClientId,
			// Exposure limits (only if set)
			maxPositionPercent: formData.maxPositionPercent || undefined,
			maxOrderSize: formData.maxOrderSize || undefined,
			dailyTradeLimitXaf: formData.dailyTradeLimitXaf || undefined,
			// Min order size (only if set)
			minOrderSize: formData.minOrderSize || undefined,
			minOrderCashAmount: formData.minOrderCashAmount || undefined,
			// Lock-up
			lockupDays: formData.lockupDays || undefined,
			// Income distribution (non-bond)
			...(formData.category !== "BONDS" &&
				formData.incomeType && {
					incomeType: formData.incomeType,
					incomeRate: formData.incomeRate || undefined,
					distributionFrequencyMonths:
						formData.distributionFrequencyMonths || undefined,
					nextDistributionDate: formData.nextDistributionDate || undefined,
				}),
			// Bond fields (only included when category is BONDS)
			...(formData.category === "BONDS" && {
				bondType: formData.bondType,
				dayCountConvention: formData.dayCountConvention || undefined,
				issuerCountry: formData.issuerCountry || undefined,
				issuerName: formData.issuerName,
				isinCode: formData.isinCode || undefined,
				maturityDate: formData.maturityDate,
				issueDate: formData.issueDate || undefined,
				// Coupon fields only for COUPON (OTA) bonds
				...(formData.bondType === "COUPON" && {
					interestRate: formData.interestRate,
					couponFrequencyMonths: formData.couponFrequencyMonths,
					nextCouponDate: formData.nextCouponDate,
				}),
			}),
			// Tax configuration
			registrationDutyEnabled: formData.registrationDutyEnabled,
			registrationDutyRate: formData.registrationDutyRate
				? formData.registrationDutyRate / 100
				: undefined,
			ircmEnabled: formData.ircmEnabled,
			ircmRateOverride: formData.ircmRateOverride
				? formData.ircmRateOverride / 100
				: undefined,
			ircmExempt: formData.ircmExempt,
			capitalGainsTaxEnabled: formData.capitalGainsTaxEnabled,
			capitalGainsRate: formData.capitalGainsRate
				? formData.capitalGainsRate / 100
				: undefined,
			tvaEnabled: formData.tvaEnabled,
			tvaRate: formData.tvaRate ? formData.tvaRate / 100 : undefined,
			isBvmacListed: formData.isBvmacListed || undefined,
			isGovernmentBond: formData.isGovernmentBond || undefined,
		};

		createMutation.mutate(request);
	};

	return {
		currentStep,
		steps,
		formData,
		isBond,
		updateFormData,
		nextStep,
		prevStep,
		handleSubmit,
		isSubmitting: createMutation.isPending,
		clients: clients ?? [],
		isLoadingClients,
		validationErrors,
	};
};
