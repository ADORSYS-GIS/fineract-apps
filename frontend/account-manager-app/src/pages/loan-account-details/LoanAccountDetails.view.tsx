import { GetLoansLoanIdTransactions } from "@fineract-apps/fineract-api";
import { formatCurrency } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, HandCoins } from "lucide-react";
import { useState } from "react";
import { getLoanStatusProps } from "@/utils/loan";
import { AccountActions } from "../loan-details/components";
import { useLoanAccountDetails } from "./useLoanAccountDetails";

export const LoanAccountDetailsView = (
	props: ReturnType<typeof useLoanAccountDetails>,
) => {
	const { account, isLoading, transactions } = props;
	const [activeTab, setActiveTab] = useState("Transactions");

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const statusProps = getLoanStatusProps(account?.status);

	const navItems = ["Transactions", "Loan Schedule"];

	return (
		<div className="bg-gray-100 min-h-screen font-sans">
			<header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						{account?.clientId && (
							<Link
								to="/client-details/$clientId"
								params={{ clientId: String(account.clientId) }}
								className="text-white hover:bg-white/20 p-2 rounded-full"
							>
								<ArrowLeft className="h-6 w-6" />
							</Link>
						)}
						<div className="bg-white/20 p-3 rounded-full">
							<HandCoins className="h-8 w-8" />
						</div>
						<div>
							<p className="text-sm opacity-80">{account?.loanProductName}</p>
							<div className="flex items-center gap-2">
								<p className="text-xl font-bold">{account?.clientName}</p>
								{statusProps && (
									<span
										className={`px-2 py-1 text-xs font-semibold rounded-full text-white capitalize ${statusProps.className}`}
									>
										{statusProps.text}
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
										{formatCurrency(
											account?.summary?.principalDisbursed,
											account?.currency?.code,
										)}
									</p>
								</div>
								<div>
									<p className="text-md opacity-80">Outstanding</p>
									<p className="font-bold text-2xl">
										{formatCurrency(
											account?.summary?.totalOutstanding,
											account?.currency?.code,
										)}
									</p>
								</div>
							</div>
						</div>
						{account && <AccountActions loan={account} />}
					</div>
				</div>
			</header>

			<main className="p-4 md:p-6 ">
				<div className="bg-white rounded-lg shadow">
					<nav className="flex border-b">
						{navItems.map((item) => (
							<button
								key={item}
								onClick={() => setActiveTab(item)}
								className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
									activeTab === item
										? "border-b-2 border-blue-600 text-blue-600"
										: "text-gray-500 hover:text-blue-500"
								}`}
							>
								{item}
							</button>
						))}
					</nav>

					{activeTab === "Transactions" && (
						<div className="p-4">
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
					)}
					{activeTab === "Loan Schedule" && (
						<div className="p-4">
							<h2 className="text-xl font-bold mb-4">Loan Schedule</h2>
							<p>Loan schedule content will be displayed here.</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};
