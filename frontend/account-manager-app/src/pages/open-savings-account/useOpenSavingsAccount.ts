import {
	PostSavingsAccountsRequest,
	SavingsAccountService,
} from "@fineract-apps/fineract-api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { z } from "zod";
import {
	initialValues,
	openSavingsAccountValidationSchema,
} from "./OpenSavingsAccount.types";

export const useOpenSavingsAccount = (clientId: number) => {
	const { mutate } = useMutation<
		unknown,
		Error,
		{ requestBody: PostSavingsAccountsRequest }
	>({
		mutationFn: (payload) =>
			SavingsAccountService.postV1Savingsaccounts(payload),
		onSuccess: () => {
			toast.success("Savings account created successfully!");
		},
		onError: (error) => {
			toast.error(
				error.message ||
					"An error occurred while creating the savings account.",
			);
		},
	});

	const onSubmit = (
		values: z.infer<typeof openSavingsAccountValidationSchema>,
	) => {
		mutate({
			requestBody: {
				...values,
				productId: Number(values.productId),
				clientId,
				locale: "en",
				dateFormat: "dd MMMM yyyy",
			},
		});
	};

	return {
		initialValues,
		validationSchema: openSavingsAccountValidationSchema,
		onSubmit,
	};
};
