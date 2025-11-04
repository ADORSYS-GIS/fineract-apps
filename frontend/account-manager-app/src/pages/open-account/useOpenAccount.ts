import {
	AccountRequest,
	FixedDepositProductService,
	LoanProductsService,
	PostSavingsAccountsRequest,
	ProductsService,
	RecurringDepositProductService,
	SavingsAccountService,
	SavingsProductService,
	ShareAccountService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
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

	const { data: shareProducts } = useQuery({
		queryKey: ["shareProducts"],
		queryFn: () => ProductsService.getV1ProductsByType({ type: "share" }),
		enabled: accountType === "shares",
	});

	const { data: recurringDepositProducts } = useQuery({
		queryKey: ["recurringDepositProducts"],
		queryFn: () =>
			RecurringDepositProductService.getV1Recurringdepositproducts(),
		enabled: accountType === "recurring",
	});

	const { data: fixedDepositProducts } = useQuery({
		queryKey: ["fixedDepositProducts"],
		queryFn: () => FixedDepositProductService.getV1Fixeddepositproducts(),
		enabled: accountType === "fixed",
	});

	const { mutate: createSavingsAccount } = useMutation<
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

	const { mutate: createShareAccount } = useMutation<
		unknown,
		Error,
		{ requestBody: AccountRequest }
	>({
		mutationFn: (payload) =>
			ShareAccountService.postV1AccountsByType({
				type: "share",
				...payload,
			}),
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
			createSavingsAccount({
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
			console.log("Creating loan account with data:", data);
		} else if (accountType === "shares") {
			createShareAccount({
				requestBody: {
					clientId,
					productId: Number(data.productName),
					// requestedShares: Number(data.requestedShares),
					locale: "en",
					dateFormat: "dd MMMM yyyy",
					submittedDate: new Date().toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "long",
						year: "numeric",
					}),
					applicationDate: new Date().toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "long",
						year: "numeric",
					}),
				},
			});
		} else if (accountType === "recurring") {
			console.log("Creating recurring deposit account with data:", data);
		} else if (accountType === "fixed") {
			console.log("Creating fixed deposit account with data:", data);
		}
	};

	const products = useMemo(() => {
		switch (accountType) {
			case "loan":
				return loanProducts;
			case "shares":
				return shareProducts?.pageItems;
			case "recurring":
				return recurringDepositProducts;
			case "fixed":
				return fixedDepositProducts;
			default:
				return savingsProducts;
		}
	}, [
		accountType,
		loanProducts,
		shareProducts,
		recurringDepositProducts,
		fixedDepositProducts,
		savingsProducts,
	]);

	return {
		initialValues,
		validationSchema: openAccountSchema as z.ZodSchema<OpenAccountForm>,
		onSubmit,
		products,
	};
};
