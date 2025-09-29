import { Button, Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import type {
	ApproveFormValues,
	ApproveSavingsAccountListItem,
	DetailData,
} from "./ApproveSavingsAccount.types";

export const ApproveSavingsAccountListView = ({
	title,
	items,
	isLoading,
	isError,
}: {
	title: string;
	items: ApproveSavingsAccountListItem[];
	isLoading: boolean;
	isError: boolean;
}) => (
	<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
		<h1 className="text-2xl font-bold mb-6">{title}</h1>
		{isLoading && <div>Loading...</div>}
		{isError && <div>Error fetching accounts</div>}
		{!isLoading && !isError && (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{items.map((account) => (
					<Link
						key={account.id}
						to="/approve/savings/account"
						search={{ accountId: account.id }}
					>
						<Card className="p-4 cursor-pointer hover:shadow-lg">
							<h2 className="font-bold">{account.savingsProductName}</h2>
							<p>Client: {account.clientName}</p>
							<p>Account No: {account.accountNo}</p>
							<p>Status: {account.status}</p>
						</Card>
					</Link>
				))}
			</div>
		)}
	</div>
);

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
}) => (
	<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
		<div className="flex justify-center">
			<Card className="p-4 mt-4 w-full max-w-md">
				<h2 className="font-bold text-xl mb-4 text-center">
					{data.productName}
				</h2>
				<p>
					<strong>Client:</strong> {data.clientName}
				</p>
				<p>
					<strong>Account No:</strong> {data.accountNo}
				</p>
				<p>
					<strong>Status:</strong> {data.status}
				</p>
				<p>
					<strong>Balance:</strong> {data.balance}
				</p>
				<Form
					initialValues={{ approvedOnDate: data.defaultDate, note: "" }}
					onSubmit={onSubmit}
				>
					<Input name="approvedOnDate" label="Approval Date" type="date" />
					<Input name="note" label="Note (Optional)" type="textarea" />
					<SubmitButton label="Approve" disabled={submitting} />
				</Form>
			</Card>
		</div>
		<div className="flex justify-center mt-4">
			<Button onClick={onBack}>Back to List</Button>
		</div>
	</div>
);
