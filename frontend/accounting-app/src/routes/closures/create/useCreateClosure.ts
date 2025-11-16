import { AccountingClosureService } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../../lib/api";

export interface ClosureFormData {
	closingDate: string;
	officeId: string;
	comments: string;
}

export interface FormErrors {
	closingDate?: string;
	officeId?: string;
}

export function useCreateClosure() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const today = new Date().toISOString().split("T")[0];

	const [formData, setFormData] = useState<ClosureFormData>({
		closingDate: today,
		officeId: "1", // Default to Head Office
		comments: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.closingDate) {
			newErrors.closingDate = "Closing date is required";
		} else {
			const selectedDate = new Date(formData.closingDate);
			const currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0);

			if (selectedDate > currentDate) {
				newErrors.closingDate = "Cannot close future dates";
			}
		}

		if (!formData.officeId) {
			newErrors.officeId = "Office is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const createMutation = useMutation({
		mutationFn: async (data: ClosureFormData) => {
			// Convert date to Fineract format "dd MM yyyy"
			const dateParts = data.closingDate.split("-");
			const formattedDate = `${dateParts[2]} ${dateParts[1]} ${dateParts[0]}`;

			const requestBody = {
				closingDate: formattedDate,
				officeId: Number(data.officeId),
				comments: data.comments || undefined,
				locale: "en",
				dateFormat: "dd MM yyyy",
			};

			const response = await AccountingClosureService.postV1Glclosures({
				requestBody,
			});

			return response;
		},
		onSuccess: () => {
			toast.success(
				"Accounting closure created successfully! Period is now locked.",
				{ duration: 6000 },
			);
			queryClient.invalidateQueries({ queryKey: ["accounting-closures"] });
			queryClient.invalidateQueries({ queryKey: ["accounting-stats"] });
			navigate({ to: "/closures" });
		},
		onError: (error: Error) => {
			toast.error(`Failed to create closure: ${error.message}`);
		},
	});

	const handleFormChange = (field: keyof ClosureFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error for this field when user starts typing
		if (errors[field as keyof FormErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			createMutation.mutate(formData);
		}
	};

	const handleCancel = () => {
		navigate({ to: "/closures" });
	};

	return {
		formData,
		errors,
		isSubmitting: createMutation.isPending,
		onFormChange: handleFormChange,
		onSubmit: handleSubmit,
		onCancel: handleCancel,
	};
}
