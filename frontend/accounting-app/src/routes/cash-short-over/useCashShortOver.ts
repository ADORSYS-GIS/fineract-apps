import { JournalEntriesService } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../lib/api";

export interface CashShortOverFormData {
	transactionDate: string;
	expectedCash: string;
	actualCash: string;
	cashAccountId: string;
	shortOverAccountId: string;
	comments: string;
}

export interface FormErrors {
	transactionDate?: string;
	expectedCash?: string;
	actualCash?: string;
	cashAccountId?: string;
	shortOverAccountId?: string;
}

export function useCashShortOver() {
	const queryClient = useQueryClient();
	const today = new Date().toISOString().split("T")[0];

	const [formData, setFormData] = useState<CashShortOverFormData>({
		transactionDate: today,
		expectedCash: "",
		actualCash: "",
		cashAccountId: "",
		shortOverAccountId: "",
		comments: "",
	});

	const [errors, setErrors] = useState<FormErrors>({});

	// Calculate variance
	const expectedAmount = Number.parseFloat(formData.expectedCash) || 0;
	const actualAmount = Number.parseFloat(formData.actualCash) || 0;
	const variance = actualAmount - expectedAmount;
	const varianceType =
		variance > 0 ? "over" : variance < 0 ? "short" : "balanced";

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.transactionDate) {
			newErrors.transactionDate = "Transaction date is required";
		}

		if (
			!formData.expectedCash ||
			Number.parseFloat(formData.expectedCash) <= 0
		) {
			newErrors.expectedCash = "Expected cash must be greater than 0";
		}

		if (!formData.actualCash || Number.parseFloat(formData.actualCash) < 0) {
			newErrors.actualCash = "Actual cash must be 0 or greater";
		}

		if (!formData.cashAccountId) {
			newErrors.cashAccountId = "Cash account is required";
		}

		if (variance !== 0 && !formData.shortOverAccountId) {
			newErrors.shortOverAccountId =
				"Cash Short/Over account is required when there's a variance";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const createJournalEntryMutation = useMutation({
		mutationFn: async (data: CashShortOverFormData) => {
			const varianceAmount = Math.abs(variance);

			// Convert date to Fineract format array [year, month, day]
			const dateParts = data.transactionDate.split("-");
			const transactionDate = [
				Number.parseInt(dateParts[0]),
				Number.parseInt(dateParts[1]),
				Number.parseInt(dateParts[2]),
			];

			// Determine debits and credits based on variance type
			let debits: Array<{ glAccountId: number; amount: number }> = [];
			let credits: Array<{ glAccountId: number; amount: number }> = [];

			if (variance < 0) {
				// Cash Short: Debit Cash Short/Over, Credit Cash
				debits = [
					{
						glAccountId: Number(data.shortOverAccountId),
						amount: varianceAmount,
					},
				];
				credits = [
					{
						glAccountId: Number(data.cashAccountId),
						amount: varianceAmount,
					},
				];
			} else if (variance > 0) {
				// Cash Over: Debit Cash, Credit Cash Short/Over
				debits = [
					{
						glAccountId: Number(data.cashAccountId),
						amount: varianceAmount,
					},
				];
				credits = [
					{
						glAccountId: Number(data.shortOverAccountId),
						amount: varianceAmount,
					},
				];
			} else {
				throw new Error("No variance to record");
			}

			const requestBody = {
				officeId: 1, // Default to Head Office
				transactionDate,
				comments: `Cash ${varianceType === "short" ? "Short" : "Over"}: ${data.comments || `Expected: $${expectedAmount.toFixed(2)}, Actual: $${actualAmount.toFixed(2)}`}`,
				credits,
				debits,
				referenceNumber: `CASH-${varianceType.toUpperCase()}-${Date.now()}`,
				locale: "en",
			};

			const response = await JournalEntriesService.postV1Journalentries1({
				requestBody,
			});

			return response;
		},
		onSuccess: () => {
			const varianceTypeText =
				varianceType === "short" ? "shortage" : "overage";
			toast.success(
				`Cash ${varianceTypeText} journal entry submitted successfully! Pending approval from admin.`,
				{ duration: 6000 },
			);

			// Invalidate relevant queries
			queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
			queryClient.invalidateQueries({ queryKey: ["accounting-stats"] });
			queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });

			// Reset form
			setFormData({
				transactionDate: today,
				expectedCash: "",
				actualCash: "",
				cashAccountId: formData.cashAccountId, // Keep account selections
				shortOverAccountId: formData.shortOverAccountId,
				comments: "",
			});
		},
		onError: (error: Error) => {
			toast.error(`Failed to create journal entry: ${error.message}`);
		},
	});

	const handleFormChange = (
		field: keyof CashShortOverFormData,
		value: string,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error for this field when user starts typing
		if (errors[field as keyof FormErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (variance === 0) {
			toast.success("Cash is balanced! No journal entry needed.");
			return;
		}

		if (validateForm()) {
			const confirmed = window.confirm(
				`Create correcting journal entry for cash ${varianceType}?\n\nVariance: $${Math.abs(variance).toFixed(2)} ${varianceType}\nExpected: $${expectedAmount.toFixed(2)}\nActual: $${actualAmount.toFixed(2)}`,
			);

			if (confirmed) {
				createJournalEntryMutation.mutate(formData);
			}
		}
	};

	const handleReset = () => {
		setFormData({
			transactionDate: today,
			expectedCash: "",
			actualCash: "",
			cashAccountId: formData.cashAccountId, // Keep account selections
			shortOverAccountId: formData.shortOverAccountId,
			comments: "",
		});
		setErrors({});
	};

	return {
		formData,
		errors,
		variance,
		varianceType,
		isSubmitting: createJournalEntryMutation.isPending,
		onFormChange: handleFormChange,
		onSubmit: handleSubmit,
		onReset: handleReset,
	};
}
