import {
	type SavingsAccountData,
	useSavingsAccountServiceGetV1Savingsaccounts,
	useSavingsAccountServiceGetV1SavingsaccountsByAccountId,
	useSavingsAccountServicePostV1SavingsaccountsByAccountId,
} from "@fineract-apps/fineract-api";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import type {
	ApproveFormValues,
	ApproveSavingsAccountListItem,
	DetailData,
} from "./ApproveSavingsAccount.types";

export function useApproveSavingsAccountList() {
	const { data, isLoading, isError } =
		useSavingsAccountServiceGetV1Savingsaccounts();

	const items: ApproveSavingsAccountListItem[] = useMemo(() => {
		const raw = (data?.pageItems ?? []) as SavingsAccountData[];
		return raw
			.filter(
				(a) => a.status?.submittedAndPendingApproval && !a.status?.approved,
			)
			.map((a) => ({
				id: a.id!,
				savingsProductName: a.savingsProductName,
				clientName: a.clientName,
				accountNo: a.accountNo,
				status: a.status?.value,
			}));
	}, [data]);

	return { title: "Approve Savings Accounts", items, isLoading, isError };
}

export function useApproveSavingsAccountDetail(
	accountId: number,
	opts?: { enabled?: boolean },
) {
	const navigate = useNavigate({ from: "/approve/savings/account" });
	const { data, isLoading } =
		useSavingsAccountServiceGetV1SavingsaccountsByAccountId(
			{
				accountId,
				associations: "all",
			},
			undefined,
			{ enabled: opts?.enabled ?? true },
		);

	const { mutate, isPending } =
		useSavingsAccountServicePostV1SavingsaccountsByAccountId({
			onSuccess: () => {
				alert("Account Approved");
				navigate({ to: "/approve/savings/account", search: {} });
			},
			onError: (error) => {
				if (error instanceof Error) alert(`Error: ${error.message}`);
				else alert("An unknown error occurred");
			},
		});

	const detail: DetailData | null = useMemo(() => {
		if (!data) return null;
		return {
			productName: data.savingsProductName,
			clientName: data.clientName,
			accountNo: data.accountNo,
			status: data.status?.value,
			balance: data.summary?.accountBalance,
			defaultDate: new Date().toISOString().split("T")[0],
		};
	}, [data]);

	const onSubmit = (values: ApproveFormValues) => {
		const date = new Date(values.approvedOnDate);
		const formattedDate = new Intl.DateTimeFormat("en-GB", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		}).format(date);

		mutate({
			accountId,
			command: "approve",
			requestBody: {
				...values,
				approvedOnDate: formattedDate,
				dateFormat: "dd MMMM yyyy",
				locale: "en",
			},
		});
	};

	const onBack = () => navigate({ to: "/approve/savings/account" });

	return { detail, isLoading, submitting: isPending, onSubmit, onBack };
}
