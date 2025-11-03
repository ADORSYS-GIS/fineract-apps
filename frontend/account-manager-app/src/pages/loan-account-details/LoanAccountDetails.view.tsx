import { GetLoansLoanIdTransactions } from "@fineract-apps/fineract-api";
import { HandCoins } from "lucide-react";
import { AccountDetailsLayout } from "@/components/AccountDetails/AccountDetailsLayout";
import { useLoanAccountDetails } from "./useLoanAccountDetails";

export const LoanAccountDetailsView = (
	props: ReturnType<typeof useLoanAccountDetails>,
) => {
	const { account, isLoading, transactions } = props;

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const isPendingApproval = account?.status?.pendingApproval;
	const isApproved =
		account?.status?.active && !account?.status?.waitingForDisbursal;

	const header = (
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-4">
				<div className="bg-white/20 p-3 rounded-full">
					<HandCoins className="h-8 w-8" />
				</div>
				<div>
					<p className="text-sm opacity-80">{account?.loanProductName}</p>
					<div className="flex items-center gap-2">
						<p className="text-xl font-bold">{account?.clientName}</p>
						{isPendingApproval && (
							<span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
								Pending Approval
							</span>
						)}
						{isApproved && (
							<span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
								Approved
							</span>
						)}
					</div>
				</div>
			</div>
			<div className="hidden md:flex items-center gap-4">
				<div className="text-right bg-white/10 p-6 rounded-lg">
					<p className="text-2xl font-bold">Loan Overview</p>
					<div className="flex gap-8 mt-4">
						<div>
							<p className="text-md opacity-80">Principal</p>
							<p className="font-bold text-2xl">
								{account?.summary?.currency?.displaySymbol}
								{account?.summary?.principalDisbursed}
							</p>
						</div>
						<div>
							<p className="text-md opacity-80">Outstanding</p>
							<p className="font-bold text-2xl">
								{account?.summary?.currency?.displaySymbol}
								{account?.summary?.totalOutstanding}
							</p>
						</div>
					</div>
				</div>
				{isApproved && (
					<button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
						Disburse
					</button>
				)}
			</div>
		</div>
	);

	const tabs = [
		{
			title: "Transactions",
			content: (
				<div>
					<h2 className="text-xl font-bold mb-4">All Transactions</h2>
					<div className="hidden md:block">
						<table className="min-w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Amount
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Principal
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Interest
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Fee
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Balance
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{transactions?.map(
									(transaction: GetLoansLoanIdTransactions) => {
										const formattedDate =
											transaction.date &&
											new Date(
												Number(transaction.date[0]),
												Number(transaction.date[1]) - 1,
												Number(transaction.date[2]),
											).toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "long",
												year: "numeric",
											});
										return (
											<tr key={transaction.id}>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{formattedDate}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{transaction.type?.value}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm">
													{transaction.amount}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm">
													{transaction.principalPortion}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm">
													{transaction.interestPortion}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm">
													{transaction.feeChargesPortion}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{transaction.outstandingLoanBalance}
												</td>
											</tr>
										);
									},
								)}
							</tbody>
						</table>
					</div>
				</div>
			),
		},
		{
			title: "Loan Schedule",
			content: (
				<div>
					<h2 className="text-xl font-bold mb-4">Loan Schedule</h2>
					<p>Loan schedule content will be displayed here.</p>
				</div>
			),
		},
	];

	return (
		<AccountDetailsLayout
			header={header}
			tabs={tabs}
			clientId={account?.clientId}
		/>
	);
};
