import { SavingsAccountTransactionData } from "@fineract-apps/fineract-api";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, HandCoins } from "lucide-react";
import { useState } from "react";
import { AccountActions, BlockAccountModal } from "./components";
import { useSavingsAccountDetails } from "./useSavingsAccountDetails";

export const SavingsAccountDetailsView = (
	props: ReturnType<typeof useSavingsAccountDetails> & {
		isBlockModalOpen: boolean;
		openBlockModal: () => void;
		closeBlockModal: () => void;
	},
) => {
	const {
		account,
		isLoading,
		transactions,
		blockReasons,
		blockAccount,
		unblockAccount,
		isBlockModalOpen,
		openBlockModal,
		closeBlockModal,
	} = props;
	const [activeTab, setActiveTab] = useState("Transactions");

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const isBlocked = account?.subStatus?.block || false;

	const navItems = ["Transactions", "Balance Sheet"];

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
							<p className="text-sm opacity-80">
								{account?.savingsProductName}
							</p>
							<div className="flex items-center gap-2">
								<p className="text-xl font-bold">{account?.clientName}</p>
								{isBlocked && (
									<span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
										Blocked
									</span>
								)}
							</div>
						</div>
					</div>
					<div className="hidden md:flex items-center gap-4">
						<div className="text-right bg-white/10 p-6 rounded-lg">
							<p className="text-2xl font-bold">Account Overview</p>
							<div className="flex gap-8 mt-4">
								<div>
									<p className="text-md opacity-80">Current</p>
									<p className="font-bold text-2xl">
										{account?.summary?.currency?.displaySymbol}
										{account?.summary?.accountBalance}
									</p>
								</div>
								<div>
									<p className="text-md opacity-80">Available</p>
									<p className="font-bold text-2xl">
										{account?.summary?.currency?.displaySymbol}
										{account?.summary?.availableBalance}
									</p>
								</div>
							</div>
						</div>
						<AccountActions
							isBlocked={isBlocked}
							onBlock={openBlockModal}
							onUnblock={unblockAccount}
						/>
					</div>
					<div className="md:hidden">
						<AccountActions
							isBlocked={isBlocked}
							onBlock={openBlockModal}
							onUnblock={unblockAccount}
						/>
					</div>
				</div>
				<div className="md:hidden text-center bg-white/10 p-4 rounded-lg w-full mt-4">
					<p className="text-xl font-bold">Account Overview</p>
					<div className="flex justify-center gap-6 mt-2">
						<div>
							<p className="text-sm opacity-80">Current</p>
							<p className="font-bold text-lg">
								{account?.summary?.currency?.displaySymbol}
								{account?.summary?.accountBalance}
							</p>
						</div>
						<div>
							<p className="text-sm opacity-80">Available</p>
							<p className="font-bold text-lg">
								{account?.summary?.currency?.displaySymbol}
								{account?.summary?.availableBalance}
							</p>
						</div>
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
							{/* Mobile View */}
							<div className="md:hidden space-y-4">
								{transactions?.map(
									(transaction: SavingsAccountTransactionData) => {
										const isDeposit = transaction.transactionType?.deposit;
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
											<div
												key={transaction.id}
												className="bg-white p-4 rounded-lg shadow"
											>
												<div className="flex justify-between items-center mb-2">
													<span className="font-bold">
														{transaction.transactionType?.value}
													</span>
													<span
														className={`font-bold ${
															isDeposit ? "text-green-600" : "text-red-600"
														}`}
													>
														{isDeposit ? "+" : "-"}
														{transaction.amount}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-2">
													{formattedDate}
												</div>
												<div className="text-sm text-gray-600">
													Balance:{" "}
													<span className="font-medium">
														{transaction.runningBalance}
													</span>
												</div>
											</div>
										);
									},
								)}
							</div>
							{/* Desktop View */}
							<div className="hidden md:block">
								<table className="min-w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Transaction Date
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Transaction Type
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Debit
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Credit
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Balance
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{transactions?.map(
											(transaction: SavingsAccountTransactionData) => {
												const isDeposit = transaction.transactionType?.deposit;
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
															{transaction.transactionType?.value}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
															{isDeposit ? "N/A" : transaction.amount}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
															{isDeposit ? transaction.amount : "N/A"}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															{transaction.runningBalance}
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
					{activeTab === "Balance Sheet" && (
						<div className="p-4">
							<h2 className="text-xl font-bold mb-4">Balance Sheet</h2>
							<p>Balance sheet content will be displayed here.</p>
						</div>
					)}
				</div>
			</main>
			<BlockAccountModal
				isOpen={isBlockModalOpen}
				onClose={closeBlockModal}
				blockReasons={blockReasons}
				onConfirm={blockAccount}
			/>
		</div>
	);
};
