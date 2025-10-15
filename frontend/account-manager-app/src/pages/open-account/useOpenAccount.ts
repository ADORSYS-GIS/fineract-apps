import {
	LoanProductsService,
	PostSavingsAccountsRequest,
	SavingsAccountService,
	SavingsProductService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import toast from "react-hot-toast";
import * as z from "zod";
import { OpenAccountForm, openAccountSchema } from "./OpenAccount.types";

export const useOpenAccount = (clientId: number) => {
	const navigate = useNavigate();
	const { accountType } = useSearch({ from: "/open-account/$clientId" });

	const { data: savingsProducts } = useQuery({
		queryKey: ["savingsProducts"],
		queryFn: () => SavingsProductService.getV1Savingsproducts(),
		enabled: accountType === "savings" || accountType === "current",
	});

	const { data: loanProducts } = useQuery({
		queryKey: ["loanProducts"],
		queryFn: () => LoanProductsService.getV1Loanproducts(),
		enabled: accountType === "loan",
	});

	const { mutate } = useMutation<
		unknown,
		Error,
		{ requestBody: PostSavingsAccountsRequest }
	>({
		mutationFn: (payload) =>
			SavingsAccountService.postV1Savingsaccounts(payload),
		onSuccess: () => {
			toast.success("Account created successfully!");
			navigate({
				to: "/client-details/$clientId",
				params: { clientId: String(clientId) },
			});
		},
		onError: (error) => {
			toast.error(
				error.message || "An error occurred while creating the account.",
			);
		},
	});

	const initialValues = {
		accountType: accountType
			? accountType.charAt(0).toUpperCase() + accountType.slice(1) + " Account"
			: "",
		productName: "",
	};

	const onSubmit = (data: OpenAccountForm) => {
		if (accountType === "savings" || accountType === "current") {
			mutate({
				requestBody: {
					clientId,
					productId: Number(data.productName),
					locale: "en",
					dateFormat: "dd MMMM yyyy",
					submittedOnDate: new Date().toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "long",
						year: "numeric",
					}),
				},
			});
		} else if (accountType === "loan") {
			// TODO: Implement loan account creation
			console.log("Creating loan account with data:", data);
		}
	};

	return {
		initialValues,
		validationSchema: openAccountSchema as z.ZodSchema<OpenAccountForm>,
		onSubmit,
		products: accountType === "loan" ? loanProducts : savingsProducts,
	};
};
