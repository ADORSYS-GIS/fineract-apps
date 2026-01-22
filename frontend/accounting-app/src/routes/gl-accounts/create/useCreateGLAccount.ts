import { GeneralLedgerAccountService } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../../lib/api";

export interface GLAccountFormData {
	name: string;
	glCode: string;
	type: string;
	usage: string;
	manualEntriesAllowed: boolean;
	description: string;
	parentId?: string;
}

export interface FormErrors {
	name?: string;
	glCode?: string;
	type?: string;
	usage?: string;
}

export function useCreateGLAccount() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState<GLAccountFormData>({
		name: "",
		glCode: "",
		type: "",
		usage: "DETAIL",
		manualEntriesAllowed: true,
		description: "",
		parentId: "",
	});

	const [errors, setErrors] = useState<FormErrors>({});

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Account name is required";
		}

		if (!formData.glCode.trim()) {
			newErrors.glCode = "GL code is required";
		}

		if (!formData.type) {
			newErrors.type = "Account type is required";
		}

		if (!formData.usage) {
			newErrors.usage = "Account usage is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const createMutation = useMutation({
		mutationFn: async (data: GLAccountFormData) => {
			const requestBody = {
				name: data.name,
				glCode: data.glCode,
				type: Number(data.type),
				usage: Number(data.usage),
				manualEntriesAllowed: data.manualEntriesAllowed,
				description: data.description,
				...(data.parentId && { parentId: Number(data.parentId) }),
			};

			const response = await GeneralLedgerAccountService.postV1Glaccounts({
				requestBody,
			});

			return response;
		},
		onSuccess: () => {
			toast.success("GL Account created successfully!");
			queryClient.invalidateQueries({ queryKey: ["gl-accounts"] });
			queryClient.invalidateQueries({ queryKey: ["accounting-stats"] });
			navigate({ to: "/gl-accounts" });
		},
		onError: (error: Error) => {
			toast.error(`Failed to create GL account: ${error.message}`);
		},
	});

	const handleFormChange = (
		field: keyof GLAccountFormData,
		value: string | boolean,
	) => {
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
		navigate({ to: "/gl-accounts" });
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
