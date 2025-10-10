import { Button, Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
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
}) => (
	<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
		{isLoading && <div>Loading...</div>}
		{isError && <div>Error fetching accounts</div>}
		{!isLoading && !isError && items.length > 0 && (
			<>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{items.map((account) => (
						<Link
							key={account.id}
							to="/approve/savings/account"
							search={{ accountId: account.id }}
						>
							<Card className="p-4 cursor-pointer hover:shadow-lg h-full">
								<h2 className="font-bold text-lg">
									{account.savingsProductName}
								</h2>
								<p className="text-sm">Client: {account.clientName}</p>
								<p className="text-sm">Account No: {account.accountNo}</p>
								<p className="text-sm">Status: {account.status}</p>
							</Card>
						</Link>
					))}
				</div>
				<div className="flex flex-wrap justify-center items-center mt-6 space-x-2">
					<Link
						to="/approve/savings/account"
						search={{ page: page - 1, limit }}
						disabled={page === 1}
					>
						<Button disabled={page === 1}>Previous</Button>
					</Link>
					<span className="mx-2 text-sm">
						Page {page} of {Math.ceil(total / limit)}
					</span>
					<Link
						to="/approve/savings/account"
						search={{ page: page + 1, limit }}
						disabled={page * limit >= total}
					>
						<Button disabled={page * limit >= total}>Next</Button>
					</Link>
				</div>
			</>
		)}
		{!isLoading && !isError && items.length === 0 && (
			<div className="text-center py-10">
				<p>No pending savings accounts to approve.</p>
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
	<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
		<div className="flex justify-center">
			<Card className="p-4 sm:p-6 mt-4 w-full max-w-lg">
				<h2 className="font-bold text-xl sm:text-2xl mb-4 text-center">
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
