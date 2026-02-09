import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { fineractApi } from "@/services/api";
import { assetApi, type CreateAssetRequest } from "@/services/assetApi";

export interface AssetFormData {
	// Step 1: Select Company
	treasuryClientId: number | null;
	treasuryClientName: string;
	treasuryCashAccountId: number | null;
	// Step 2: Asset Details
	name: string;
	symbol: string;
	currencyCode: string;
	category: string;
	description: string;
	imageUrl: string;
	// Step 3: Pricing
	initialPrice: number;
	annualYield: number;
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
	treasuryCashAccountId: null,
	name: "",
	symbol: "",
	currencyCode: "",
	category: "REAL_ESTATE",
	description: "",
	imageUrl: "",
	initialPrice: 0,
	annualYield: 0,
	tradingFeePercent: 0.5,
	spreadPercent: 1.0,
	totalSupply: 0,
	decimalPlaces: 0,
	expectedLaunchDate: "",
};

export const useCreateAsset = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<AssetFormData>(initialFormData);

	const steps = [
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
				(c: { legalForm?: { id?: number } }) => c.legalForm?.id === 2, // ENTITY (company)
			),
	});

	// Fetch savings accounts for selected client
	const { data: clientAccounts, isLoading: isLoadingAccounts } = useQuery({
		queryKey: ["client-accounts", formData.treasuryClientId],
		queryFn: () =>
			fineractApi.savingsAccounts.getV1Savingsaccounts({
				// @ts-expect-error - query param supported but not typed
				clientId: formData.treasuryClientId,
			}),
		enabled: !!formData.treasuryClientId,
		select: (res) => (res as { pageItems?: unknown[] }).pageItems ?? [],
	});

	const createMutation = useMutation({
		mutationFn: (data: CreateAssetRequest) => assetApi.createAsset(data),
		onSuccess: () => {
			toast.success("Asset created successfully!");
			navigate({ to: "/dashboard" });
		},
		onError: (error: Error) => {
			toast.error(`Failed to create asset: ${error.message}`);
		},
	});

	const updateFormData = (updates: Partial<AssetFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const nextStep = () => {
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
		if (!formData.treasuryClientId || !formData.treasuryCashAccountId) {
			toast.error("Please select a company and cash account");
			return;
		}

		const request: CreateAssetRequest = {
			name: formData.name,
			symbol: formData.symbol,
			currencyCode: formData.currencyCode,
			description: formData.description || undefined,
			imageUrl: formData.imageUrl || undefined,
			category: formData.category,
			initialPrice: formData.initialPrice,
			annualYield: formData.annualYield || undefined,
			tradingFeePercent: formData.tradingFeePercent,
			spreadPercent: formData.spreadPercent,
			totalSupply: formData.totalSupply,
			decimalPlaces: formData.decimalPlaces,
			treasuryClientId: formData.treasuryClientId,
			treasuryCashAccountId: formData.treasuryCashAccountId,
			expectedLaunchDate: formData.expectedLaunchDate || undefined,
		};

		createMutation.mutate(request);
	};

	return {
		currentStep,
		steps,
		formData,
		updateFormData,
		nextStep,
		prevStep,
		handleSubmit,
		isSubmitting: createMutation.isPending,
		clients: clients ?? [],
		isLoadingClients,
		clientAccounts: clientAccounts ?? [],
		isLoadingAccounts,
	};
};
