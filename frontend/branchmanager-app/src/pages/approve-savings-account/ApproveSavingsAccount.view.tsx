import {
	Button,
	Card,
	Form,
	Input,
	SearchBar,
	SubmitButton,
	Table,
} from "@fineract-apps/ui";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";

function SearchBarWrapper() {
	const search = useSearch({ from: "/approve/savings/account" }) as Record<
		string,
		string | undefined
	>;
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
				placeholder="product, client, account no"
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
}) => (
	<div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
		<h1 className="text-2xl font-bold mb-6">Approve Savings Account</h1>
		{/* Filter and sort controls - wired to URL search params */}
		<SearchBarWrapper />
		{isLoading && <div>Loading...</div>}
		{isError && <div>Error fetching accounts</div>}
		{!isLoading && !isError && items.length > 0 && (
			<>
				<div className="overflow-x-auto">
					<Table
						columns={[
							{ key: "savingsProductName", title: "Product", sortable: true },
							{ key: "clientName", title: "Client", sortable: true },
							{ key: "accountNo", title: "Account No", sortable: true },
							{ key: "status", title: "Status", sortable: true },
							{
								key: "actions",
								title: "Actions",
								render: (row: ApproveSavingsAccountListItem) => (
									<Link
										to="/approve/savings/account"
										search={{ accountId: row.id }}
									>
										<Button>View</Button>
									</Link>
								),
								className: "text-right",
							},
						]}
						data={items}
					/>
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
	<div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
		<div className="flex justify-center">
			<Card className="p-4 sm:p-6 mt-4 w-full">
				<h2 className="font-bold text-xl sm:text-2xl mb-4 text-center">
					{data.clientName} ({data.accountNo})
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
