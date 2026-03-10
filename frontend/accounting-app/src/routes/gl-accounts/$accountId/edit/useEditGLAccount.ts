import { GeneralLedgerAccountService } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../../../../lib/api";

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

export function useEditGLAccount() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { accountId } = useParams({ from: "/gl-accounts/$accountId/edit" });

	const [formData, setFormData] = useState<GLAccountFormData>({
		name: "",
		glCode: "",
		type: "",
		usage: "",
		manualEntriesAllowed: true,
		description: "",
		parentId: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});

	// Fetch existing account data
	const { data: account, isLoading } = useQuery({
		queryKey: ["gl-account", accountId],
		queryFn: async () => {
			const response =
				await GeneralLedgerAccountService.getV1GlaccountsByGlAccountId({
					glAccountId: Number(accountId),
				});

			return response as unknown as {
				id: number;
				name: string;
				glCode: string;
				type?: { id: number; value: string };
				usage?: { id: number; value: string };
				manualEntriesAllowed?: boolean;
				description?: string;
				parentId?: number;
			};
		},
	});

	// Populate form when account data loads
	useEffect(() => {
		if (account) {
			setFormData({
				name: account.name || "",
				glCode: account.glCode || "",
				type: account.type?.id?.toString() || "",
				usage: account.usage?.id?.toString() || "",
				manualEntriesAllowed: account.manualEntriesAllowed ?? true,
				description: account.description || "",
				parentId: account.parentId?.toString() || "",
			});
		}
	}, [account]);

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

	const updateMutation = useMutation({
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

			const response =
				await GeneralLedgerAccountService.putV1GlaccountsByGlAccountId({
					glAccountId: Number(accountId),
					requestBody,
				});

			return response;
		},
		onSuccess: () => {
			toast.success("GL Account updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["gl-accounts"] });
			queryClient.invalidateQueries({ queryKey: ["gl-account", accountId] });
			queryClient.invalidateQueries({ queryKey: ["accounting-stats"] });
			navigate({ to: "/gl-accounts" });
		},
		onError: (error: Error) => {
			toast.error(`Failed to update GL account: ${error.message}`);
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
			updateMutation.mutate(formData);
		}
	};

	const handleCancel = () => {
		navigate({ to: "/gl-accounts" });
	};

	return {
		formData,
		errors,
		isLoading,
		isSubmitting: updateMutation.isPending,
		onFormChange: handleFormChange,
		onSubmit: handleSubmit,
		onCancel: handleCancel,
	};
}
