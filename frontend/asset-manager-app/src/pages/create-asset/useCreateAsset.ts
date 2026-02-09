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
	currencyCode: string;
	category: string;
	description: string;
	imageUrl: string;
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
	currencyCode: "",
	category: "REAL_ESTATE",
	description: "",
	imageUrl: "",
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
		switch (step) {
			case 0:
				if (!formData.treasuryClientId) errors.push("Select a company");
				break;
			case 1:
				if (!formData.name.trim()) errors.push("Name is required");
				if (!formData.symbol.trim()) errors.push("Symbol is required");
				else if (!/^[A-Z0-9]{2,10}$/.test(formData.symbol))
					errors.push("Symbol must be 2-10 uppercase letters/digits");
				if (!formData.currencyCode.trim())
					errors.push("Currency code is required");
				else if (!/^[A-Z]{3}$/.test(formData.currencyCode))
					errors.push("Currency code must be 3 uppercase letters");
				break;
			case 2:
				if (formData.initialPrice <= 0)
					errors.push("Initial price must be greater than 0");
				if (formData.tradingFeePercent < 0 || formData.tradingFeePercent > 50)
					errors.push("Trading fee must be 0-50%");
				if (formData.spreadPercent < 0 || formData.spreadPercent > 50)
					errors.push("Spread must be 0-50%");
				break;
			case 3:
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
			currencyCode: formData.currencyCode,
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
		validationErrors,
	};
};
