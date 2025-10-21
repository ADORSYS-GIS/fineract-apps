import {
	type SavingsAccountData,
	SavingsAccountService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import type {
	ApproveFormValues,
	ApproveSavingsAccountListItem,
	DetailData,
} from "./ApproveSavingsAccount.types";

export function useApproveSavingsAccountList(opts?: {
	q?: string;
	sortKey?: string;
	sortDir?: "asc" | "desc";
}) {
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
		let list = raw
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

		// Apply client-side filtering if query provided
		if (opts?.q) {
			const q = String(opts.q).toLowerCase().trim();
			if (q.length > 0) {
				list = list.filter((it) => {
					return (
						String(it.savingsProductName ?? "")
							.toLowerCase()
							.includes(q) ||
						String(it.clientName ?? "")
							.toLowerCase()
							.includes(q) ||
						String(it.accountNo ?? "")
							.toLowerCase()
							.includes(q)
					);
				});
			}
		}

		// Apply client-side sort
		if (opts?.sortKey) {
			const key = opts.sortKey as keyof ApproveSavingsAccountListItem;
			const dir = opts.sortDir === "desc" ? -1 : 1;
			list = list.slice().sort((a, b) => {
				const va = (a[key] ?? "").toString();
				const vb = (b[key] ?? "").toString();
				return va.localeCompare(vb) * dir;
			});
		}

		return list;
	}, [data, opts?.q, opts?.sortKey, opts?.sortDir]);

	return {
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

	const mutation = useMutation({
		mutationFn: async (params: {
			accountId: number;
			values: ApproveFormValues;
		}) => {
			const { accountId, values } = params;
			const date = new Date(values.approvedOnDate);
			const formattedDate = new Intl.DateTimeFormat("en-GB", {
				day: "2-digit",
				month: "long",
				year: "numeric",
			}).format(date);
			return SavingsAccountService.postV1SavingsaccountsByAccountId({
				accountId,
				command: "approve",
				requestBody: {
					...values,
					approvedOnDate: formattedDate,
					dateFormat: "dd MMMM yyyy",
					locale: "en",
				},
			});
		},
		onSuccess: () => {
			navigate({ to: "/approve/savings/account", search: {} });
			toast.success("Account approved successfully");
		},
		onError: () => {
			toast.error("Failed to approve account");
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
		mutation.mutate({ accountId, values });
	};

	const onBack = () => navigate({ to: "/approve/savings/account" });

	return {
		detail,
		isLoading,
		submitting: mutation.isPending,
		onSubmit,
		onBack,
	};
}
