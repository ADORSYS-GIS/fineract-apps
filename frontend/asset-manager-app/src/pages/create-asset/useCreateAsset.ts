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
	// Step 1: Select Company
	treasuryClientId: number | null;
	treasuryClientName: string;
	// Step 2: Asset Details
	name: string;
	symbol: string;
	category: string;
	description: string;
	imageUrl: string;
	// Step 2b: Bond Details (when category = BONDS)
	issuer: string;
	isinCode: string;
	maturityDate: string;
	interestRate: number;
	couponFrequencyMonths: number;
	nextCouponDate: string;
	validityDate: string;
	// Step 3: Pricing
	initialPrice: number;
	tradingFeePercent: number;
	spreadPercent: number;
	// Step 4: Supply
	totalSupply: number;
	decimalPlaces: number;
	expectedLaunchDate: string;
}

const initialFormData: AssetFormData = {
	treasuryClientId: null,
	treasuryClientName: "",
	name: "",
	symbol: "",
	category: "REAL_ESTATE",
	description: "",
	imageUrl: "",
	issuer: "",
	isinCode: "",
	maturityDate: "",
	interestRate: 0,
	couponFrequencyMonths: 12,
	nextCouponDate: "",
	validityDate: "",
	initialPrice: 0,
	tradingFeePercent: 0.5,
	spreadPercent: 1.0,
	totalSupply: 0,
	decimalPlaces: 0,
	expectedLaunchDate: "",
};

export const useCreateAsset = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<AssetFormData>(initialFormData);

	const isBond = formData.category === "BONDS";
	const steps = isBond
		? [
				"Select Company",
				"Asset Details",
				"Bond Details",
				"Pricing & Fees",
				"Supply",
				"Review & Create",
			]
		: [
				"Select Company",
				"Asset Details",
				"Pricing & Fees",
				"Supply",
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
			(res.pageItems ?? []).filter(
				(c) => (c as { legalForm?: { id?: number } }).legalForm?.id === 2, // ENTITY (company)
			),
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
		const errors: string[] = [];
		// Map logical step to validation based on whether bond step is present
		const stepName = steps[step];
		switch (stepName) {
			case "Select Company":
				if (!formData.treasuryClientId) errors.push("Select a company");
				break;
			case "Asset Details":
				if (!formData.name.trim()) errors.push("Name is required");
				if (!formData.symbol.trim()) errors.push("Symbol is required");
				else if (!/^[A-Z]{3}$/.test(formData.symbol))
					errors.push("Symbol must be exactly 3 uppercase letters");
				break;
			case "Bond Details":
				if (!formData.issuer.trim()) errors.push("Issuer is required");
				if (!formData.maturityDate) errors.push("Maturity date is required");
				if (formData.interestRate <= 0)
					errors.push("Interest rate must be greater than 0");
				if (![1, 3, 6, 12].includes(formData.couponFrequencyMonths))
					errors.push("Coupon frequency must be 1, 3, 6, or 12 months");
				if (!formData.nextCouponDate)
					errors.push("First coupon date is required");
				if (formData.validityDate) {
					if (formData.validityDate <= new Date().toISOString().split("T")[0])
						errors.push("Validity date must be in the future");
					else if (
						formData.maturityDate &&
						formData.validityDate > formData.maturityDate
					)
						errors.push("Validity date must be on or before the maturity date");
				}
				break;
			case "Pricing & Fees":
				if (formData.initialPrice <= 0)
					errors.push("Initial price must be greater than 0");
				if (formData.tradingFeePercent < 0 || formData.tradingFeePercent > 50)
					errors.push("Trading fee must be 0-50%");
				if (formData.spreadPercent < 0 || formData.spreadPercent > 50)
					errors.push("Spread must be 0-50%");
				break;
			case "Supply":
				if (formData.totalSupply <= 0)
					errors.push("Total supply must be greater than 0");
				break;
		}
		return errors;
	};

	const updateFormData = (updates: Partial<AssetFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
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
		if (!formData.treasuryClientId) {
			toast.error("Please select a company");
			return;
		}

		const request: CreateAssetRequest = {
			name: formData.name,
			symbol: formData.symbol,
			currencyCode: formData.symbol,
			description: formData.description || undefined,
			imageUrl: formData.imageUrl || undefined,
			category: formData.category,
			initialPrice: formData.initialPrice,
			tradingFeePercent: formData.tradingFeePercent,
			spreadPercent: formData.spreadPercent,
			totalSupply: formData.totalSupply,
			decimalPlaces: formData.decimalPlaces,
			treasuryClientId: formData.treasuryClientId,
			expectedLaunchDate: formData.expectedLaunchDate || undefined,
			// Bond fields (only included when category is BONDS)
			...(formData.category === "BONDS" && {
				issuer: formData.issuer,
				isinCode: formData.isinCode || undefined,
				maturityDate: formData.maturityDate,
				interestRate: formData.interestRate,
				couponFrequencyMonths: formData.couponFrequencyMonths,
				nextCouponDate: formData.nextCouponDate,
				validityDate: formData.validityDate || undefined,
			}),
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
