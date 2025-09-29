import {
	PostSavingsAccountsRequest,
	SavingsAccountService,
} from "@fineract-apps/fineract-api";
import { useMutation } from "@tanstack/react-query";
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
