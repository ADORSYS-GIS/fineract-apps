import {
	type SavingsAccountData,
	SavingsAccountService,
	useSavingsAccountServicePostV1SavingsaccountsByAccountId,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import type {
	ApproveFormValues,
	ApproveSavingsAccountListItem,
	DetailData,
} from "./ApproveSavingsAccount.types";

export function useApproveSavingsAccountList() {
	const { page = 1, limit = 10 } = useSearch({
		from: "/approve/savings/account",
	});
	const { data, isLoading, isError } = useQuery({
		queryKey: ["SavingsAccountServiceGetV1Savingsaccounts", page, limit],
		queryFn: async () =>
			(await SavingsAccountService.getV1Savingsaccounts({
				offset: (page - 1) * limit,
				limit,
			})) ?? [],
	});

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

	return {
		title: "Approve Savings Accounts",
		items,
		isLoading,
		isError,
		page,
		limit,
		total: data?.totalFilteredRecords ?? 0,
	};
}

export function useApproveSavingsAccountDetail(
	accountId: number,
	opts?: { enabled?: boolean },
) {
	const navigate = useNavigate({ from: "/approve/savings/account" });
	const { data, isLoading } = useQuery({
		queryKey: [
			"SavingsAccountServiceGetV1SavingsaccountsByAccountId",
			accountId,
		],
		queryFn: async () =>
			(await SavingsAccountService.getV1SavingsaccountsByAccountId({
				accountId,
				associations: "all",
			})) ?? null,
		enabled: opts?.enabled ?? true,
	});

	const { mutateAsync, isPending } =
		useSavingsAccountServicePostV1SavingsaccountsByAccountId();

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

		const promise = mutateAsync({
			accountId,
			command: "approve",
			requestBody: {
				...values,
				approvedOnDate: formattedDate,
				dateFormat: "dd MMMM yyyy",
				locale: "en",
			},
		});

		toast.promise(promise, {
			loading: "Approving account...",
			success: () => {
				navigate({ to: "/approve/savings/account", search: {} });
				return "Account approved successfully";
			},
			error: "Failed to approve account",
		});
	};

	const onBack = () => navigate({ to: "/approve/savings/account" });

	return { detail, isLoading, submitting: isPending, onSubmit, onBack };
}
