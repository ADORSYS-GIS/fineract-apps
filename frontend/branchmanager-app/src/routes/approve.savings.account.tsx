import {
	type SavingsAccountData,
	useSavingsAccountServiceGetV1Savingsaccounts,
	useSavingsAccountServiceGetV1SavingsaccountsByAccountId,
	useSavingsAccountServicePostV1SavingsaccountsByAccountId,
} from "@fineract-apps/fineract-api";
import { Button, Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const savingsAccountSearchSchema = z.object({
	accountId: z.number().optional(),
});

export const Route = createFileRoute("/approve/savings/account")({
	validateSearch: (search) => savingsAccountSearchSchema.parse(search),
	component: SavingsAccountApproval,
});

function SavingsAccountDetail({ accountId }: Readonly<{ accountId: number }>) {
	const navigate = useNavigate({ from: Route.fullPath });
	const { data: accountData, isLoading } =
		useSavingsAccountServiceGetV1SavingsaccountsByAccountId({
			accountId,
			associations: "all",
		});

	const { mutate: approveAccount, isPending } =
		useSavingsAccountServicePostV1SavingsaccountsByAccountId({
			onSuccess: () => {
				alert("Account Approved");
				navigate({ to: "/approve/savings/account", search: {} });
			},
			onError: (error) => {
				if (error instanceof Error) {
					alert(`Error: ${error.message}`);
				} else {
					alert("An unknown error occurred");
				}
			},
		});

	const handleApprove = (values: { approvedOnDate: string; note?: string }) => {
		const date = new Date(values.approvedOnDate);
		const formattedDate = new Intl.DateTimeFormat("en-GB", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		}).format(date);

		approveAccount({
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

	if (isLoading) return <div>Loading account details...</div>;

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<div className="flex justify-center">
				<Card className="p-4 mt-4 w-full max-w-md">
					<h2 className="font-bold text-xl mb-4 text-center">
						{accountData?.savingsProductName}
					</h2>
					<p>
						<strong>Client:</strong> {accountData?.clientName}
					</p>
					<p>
						<strong>Account No:</strong> {accountData?.accountNo}
					</p>
					<p>
						<strong>Status:</strong> {accountData?.status?.value}
					</p>
					<p>
						<strong>Balance:</strong> {accountData?.summary?.accountBalance}
					</p>
					<Form
						initialValues={{
							approvedOnDate: new Date().toISOString().split("T")[0],
							note: "",
						}}
						onSubmit={handleApprove}
					>
						<Input name="approvedOnDate" label="Approval Date" type="date" />
						<Input name="note" label="Note (Optional)" type="textarea" />
						<SubmitButton label="Approve" disabled={isPending} />
					</Form>
				</Card>
			</div>
			<div className="flex justify-center mt-4">
				<Button onClick={() => navigate({ to: "/approve/savings/account" })}>
					Back to List
				</Button>
			</div>
		</div>
	);
}

function SavingsAccountApproval() {
	const { accountId } = Route.useSearch();
	const {
		data: savingsAccountsData,
		isLoading,
		isError,
	} = useSavingsAccountServiceGetV1Savingsaccounts();

	if (accountId) {
		return <SavingsAccountDetail accountId={accountId} />;
	}

	const pendingApprovalAccounts = savingsAccountsData?.pageItems?.filter(
		(account: SavingsAccountData) =>
			account.status?.submittedAndPendingApproval && !account.status?.approved,
	);

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<h1 className="text-2xl font-bold mb-6">Approve Savings Accounts</h1>
			{isLoading && <div>Loading...</div>}
			{isError && <div>Error fetching accounts</div>}
			{pendingApprovalAccounts && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{pendingApprovalAccounts.map((account: SavingsAccountData) => (
						<Link
							key={account.id}
							to="/approve/savings/account"
							search={{ accountId: account.id }}
						>
							<Card className="p-4 cursor-pointer hover:shadow-lg">
								<h2 className="font-bold">{account.savingsProductName}</h2>
								<p>Client: {account.clientName}</p>
								<p>Account No: {account.accountNo}</p>
								<p>Status: {account.status?.value}</p>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
