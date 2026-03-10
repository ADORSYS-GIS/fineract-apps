import {
	Button,
	Card,
	Form,
	formatCurrency,
	Input,
	SearchBar,
	SubmitButton,
	Table,
} from "@fineract-apps/ui";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/BackButton";

function SearchBarWrapper() {
	const { t } = useTranslation();
	const search = useSearch({ from: "/approve/savings/account" });
	const initial = String(search?.q ?? "");
	const [value, setValue] = useState(initial);
	const navigate = useNavigate({ from: "/approve/savings/account" });

	const handleValueChange = (val: string) => {
		setValue(val);
	};
	const handleSearch = (val: string) => {
		// cast through unknown to satisfy strict typing of navigate search param
		navigate({
			to: "/approve/savings/account",
			search: { q: val } as unknown as Record<
				string,
				string | number | undefined
			>,
		});
	};
	return (
		<div className="mb-4">
			<SearchBar
				value={value}
				onValueChange={handleValueChange}
				onSearch={handleSearch}
				placeholder={t("approveSavingsAccountList.searchPlaceholder")}
			/>
		</div>
	);
}

import type {
	ApproveFormValues,
	ApproveSavingsAccountListItem,
	DetailData,
} from "./ApproveSavingsAccount.types";

export const ApproveSavingsAccountListView = ({
	items,
	isLoading,
	isError,
	page,
	limit,
	total,
}: {
	items: ApproveSavingsAccountListItem[];
	isLoading: boolean;
	isError: boolean;
	page: number;
	limit: number;
	total: number;
}) => {
	const { t } = useTranslation();
	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					{t("approveSavingsAccountList.approveSavingsAccount")}
				</h1>
				<BackButton />
			</div>
			{/* Filter and sort controls - wired to URL search params */}
			<SearchBarWrapper />
			{isLoading && <div>{t("approveSavingsAccountList.loading")}</div>}
			{isError && (
				<div>{t("approveSavingsAccountList.errorFetchingAccounts")}</div>
			)}
			{!isLoading && !isError && items.length > 0 && (
				<>
					<div className="overflow-x-auto">
						<Table
							columns={[
								{
									key: "savingsProductName",
									title: t("approveSavingsAccountList.product"),
									sortable: true,
									className:
										"text-xs text-white uppercase bg-primary rounded-l-lg",
									cellClassName: "whitespace-normal px-2 sm:px-6",
								},
								{
									key: "clientName",
									title: t("approveSavingsAccountList.client"),
									sortable: true,
									className: "text-xs text-white uppercase bg-primary",
									cellClassName: "whitespace-normal px-2 sm:px-6",
								},
								{
									key: "accountNo",
									title: t("approveSavingsAccountList.accountNo"),
									sortable: true,
									className:
										"hidden md:table-cell text-xs text-white uppercase bg-primary",
									cellClassName: "hidden md:table-cell",
								},
								{
									key: "status",
									title: t("approveSavingsAccountList.status"),
									sortable: true,
									className:
										"hidden md:table-cell text-xs text-white uppercase bg-primary",
									cellClassName: "hidden md:table-cell",
								},
								{
									key: "actions",
									title: t("approveSavingsAccountList.actions"),
									className:
										"text-xs text-white uppercase bg-primary rounded-r-lg",
									cellClassName: "px-2 sm:px-6",
									render: (row: ApproveSavingsAccountListItem) => (
										<Link
											to="/approve/savings/account"
											search={{ accountId: row.id }}
										>
											<Button>{t("approveSavingsAccountList.view")}</Button>
										</Link>
									),
								},
							]}
							data={items}
						/>
					</div>
					<div className="flex flex-wrap justify-center items-center mt-6 space-x-2">
						<Link
							to="/approve/savings/account"
							search={(prev) => ({ ...prev, page: page - 1, limit })}
							disabled={page === 1}
						>
							<Button disabled={page === 1}>
								{t("approveSavingsAccountList.previous")}
							</Button>
						</Link>
						<span className="mx-2 text-sm">
							{t("approveSavingsAccountList.pageOf", {
								page,
								total: Math.ceil(total / (limit > 0 ? limit : 1)),
							})}
						</span>
						<Link
							to="/approve/savings/account"
							search={(prev) => ({ ...prev, page: page + 1, limit })}
							disabled={page * limit >= total}
						>
							<Button disabled={page * limit >= total}>
								{t("approveSavingsAccountList.next")}
							</Button>
						</Link>
					</div>
				</>
			)}
			{!isLoading && !isError && items.length === 0 && (
				<div className="text-center py-10">
					<p>{t("approveSavingsAccountList.noPendingAccounts")}</p>
				</div>
			)}
		</div>
	);
};

import { useCurrency } from "@/hooks/useCurrency";

export const ApproveSavingsAccountDetailView = ({
	data,
	onSubmit,
	submitting,
	onBack,
}: {
	data: DetailData;
	onSubmit: (values: ApproveFormValues) => void;
	submitting: boolean;
	onBack: () => void;
}) => {
	const { t } = useTranslation();
	const { currencyCode } = useCurrency();
	return (
		<div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
			<div className="flex justify-center">
				<Card className="p-4 sm:p-6 mt-4 w-full">
					<h2 className="font-bold text-xl sm:text-2xl mb-4 text-center">
						{data.clientName} ({data.accountNo})
					</h2>
					<p>
						<strong>{t("approveSavingsAccountDetail.client")}</strong>{" "}
						{data.clientName}
					</p>
					<p>
						<strong>{t("approveSavingsAccountDetail.accountNo")}</strong>{" "}
						{data.accountNo}
					</p>
					<p>
						<strong>{t("approveSavingsAccountDetail.status")}</strong>{" "}
						{data.status}
					</p>
					<p>
						<strong>{t("approveSavingsAccountDetail.balance")}</strong>{" "}
						{formatCurrency(Number(data.balance), currencyCode)}
					</p>
					<Form
						initialValues={{ approvedOnDate: data.defaultDate, note: "" }}
						onSubmit={onSubmit}
					>
						<Input
							name="approvedOnDate"
							label={t("approveSavingsAccountDetail.approvalDate")}
							type="date"
						/>
						<Input
							name="note"
							label={t("approveSavingsAccountDetail.noteOptional")}
							type="textarea"
						/>
						<SubmitButton
							label={t("approveSavingsAccountDetail.approve")}
							disabled={submitting}
						/>
					</Form>
				</Card>
			</div>
			<div className="flex justify-center mt-4">
				<Button onClick={onBack}>
					{t("approveSavingsAccountDetail.backToList")}
				</Button>
			</div>
		</div>
	);
};
