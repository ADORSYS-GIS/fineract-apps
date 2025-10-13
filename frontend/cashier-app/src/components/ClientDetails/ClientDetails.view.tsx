import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { formatCurrency } from "@/utils/currency";
import { TransactionForm } from "../TransactionForm";
import { ClientDetailsViewProps } from "./ClientDetails.types";

export const ClientDetailsView: React.FC<ClientDetailsViewProps> = ({
	savingsAccount,
	clientImage,
	isClientImageLoading,
	isImageModalOpen,
	transactionType,
	transactionError,
	onCloseTransactionModal,
	onOpenImageModal,
	onCloseImageModal,
	onSubmitTransaction,
	isSubmitting,
	isSuccess,
	selectedAccount,
	onDeposit,
	onWithdraw,
}) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialogNode = dialogRef.current;
		if (!dialogNode) return;

		const handleBackdropClick = (event: MouseEvent) => {
			if (event.target === dialogNode) {
				onCloseImageModal();
			}
		};

		if (isImageModalOpen) {
			dialogNode.showModal();
			dialogNode.addEventListener("click", handleBackdropClick);
		} else {
			dialogNode.removeEventListener("click", handleBackdropClick);
			dialogNode.close();
		}

		return () => {
			dialogNode.removeEventListener("click", handleBackdropClick);
		};
	}, [isImageModalOpen, onCloseImageModal]);

	if (!savingsAccount) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p>Loading client details...</p>
			</div>
		);
	}

	const status = savingsAccount.status as { value?: string };
	const recentTransactions =
		savingsAccount.transactions
			?.sort((a, b) => {
				const dateA = a.date
					? new Date(
							Number(a.date[0]),
							Number(a.date[1]) - 1,
							Number(a.date[2]),
						).getTime()
					: 0;
				const dateB = b.date
					? new Date(
							Number(b.date[0]),
							Number(b.date[1]) - 1,
							Number(b.date[2]),
						).getTime()
					: 0;
				return dateB - dateA;
			})
			.slice(0, 10) ?? [];

	const renderClientImage = () => {
		if (isClientImageLoading) {
			return (
				<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
					<span className="text-sm text-gray-500">Loading...</span>
				</div>
			);
		}
		if (clientImage) {
			return (
				<img
					src={clientImage}
					alt="Client"
					className="w-32 h-32 rounded-full shadow-md"
				/>
			);
		}
		return (
			<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
				<span className="text-sm text-gray-500">No Image</span>
			</div>
		);
	};
	return (
		<div className="p-4 md:p-6 bg-gray-50 min-h-screen">
			<div className="max-w-4xl mx-auto my-16 bg-white rounded-lg shadow-md overflow-hidden">
				<div className="p-6 border-b border-gray-200">
					<div className="flex flex-col md:flex-row justify-between md:items-center">
						<div className="flex items-center gap-4">
							<Link to="/dashboard" search={{ query: "" }}>
								<Button variant="outline">&larr; Back</Button>
							</Link>
							<h2 className="text-3xl font-bold text-gray-800">
								Client Details
							</h2>
						</div>
						<div className="mt-2 md:mt-0">
							<span
								className={`px-3 py-1 text-sm font-semibold rounded-full ${
									status?.value === "Active"
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{status?.value}
							</span>
						</div>
					</div>
				</div>
				<div className="p-6">
					<div className="flex flex-col md:flex-row gap-8 items-start">
						<div className="flex-shrink-0 mx-auto md:mx-0">
							<Button
								variant="ghost"
								className="cursor-pointer appearance-none bg-transparent border-none p-0 text-left h-auto"
								onClick={onOpenImageModal}
							>
								{renderClientImage()}
							</Button>
							<div className="mt-4 text-center md:text-left">
								<p className="text-sm font-medium text-gray-500">clientName</p>
								<p className="mt-1 text-lg text-gray-900">
									{savingsAccount.clientName}
								</p>
							</div>
						</div>
						<div className="flex-grow w-full">
							{(() => {
								const dateArray = savingsAccount?.lastActiveTransactionDate as
									| number[]
									| undefined;
								const formattedDate =
									dateArray && dateArray.length >= 3
										? format(
												new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
												"PPP",
											)
										: "N/A";
								return (
									<div className="p-4 border rounded-lg">
										<div className="block md:grid md:grid-cols-5 md:gap-4 md:items-center text-gray-700">
											<div className="col-span-4">
												<div className="flex justify-between md:block">
													<span className="font-semibold">Account No: </span>
													<span>{savingsAccount?.accountNo}</span>
												</div>
												<div className="flex justify-between md:block">
													<span className="font-semibold">Last Active: </span>
													<span>{formattedDate}</span>
												</div>
												<div className="flex justify-between md:block">
													<span className="font-semibold">
														accountBalance:{" "}
													</span>
													<span>
														{formatCurrency(
															savingsAccount?.summary?.accountBalance,
														)}
													</span>
												</div>
												<div className="flex justify-between md:block">
													<span className="font-semibold">
														availableBalance:{" "}
													</span>
													<span>
														{formatCurrency(
															savingsAccount?.summary?.availableBalance,
														)}
													</span>
												</div>
											</div>
										</div>
									</div>
								);
							})()}
						</div>
					</div>
				</div>
				<div className="p-6 border-t border-gray-200">
					<div className="flex justify-end gap-4">
						<Button onClick={onDeposit}>Deposit</Button>
						<Button onClick={onWithdraw} variant="outline">
							Withdraw
						</Button>
					</div>
				</div>
				<div className="border-t border-gray-200 px-6 py-6">
					<h3 className="text-xl text-gray-700 mb-4">Recent Transactions</h3>
					<div className="border border-gray-200 rounded-lg overflow-hidden">
						<div className="hidden md:grid grid-cols-3 gap-4 p-4 border-b border-gray-200 items-center text-gray-500 font-medium">
							<div>Date</div>
							<div>Transaction Type</div>
							<div className="text-right">Amount</div>
						</div>
						<div className="divide-y divide-gray-200">
							{recentTransactions.length > 0 ? (
								recentTransactions.map((transaction) => (
									<div
										key={transaction.id}
										className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-center"
									>
										<div>
											{transaction.date
												? format(new Date(transaction.date), "dd MMM yyyy")
												: "N/A"}
										</div>
										<div>{transaction.transactionType?.value}</div>
										<div
											className={`text-right ${
												transaction.transactionType?.value === "Deposit"
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											{savingsAccount.currency?.displaySymbol}{" "}
											{transaction.amount}
										</div>
									</div>
								))
							) : (
								<div className="p-4 text-center text-gray-500">
									No transactions found.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{isImageModalOpen && (
				<dialog
					ref={dialogRef}
					className="p-0 bg-transparent border-none backdrop:bg-black backdrop:bg-opacity-75 w-screen h-screen flex items-center justify-center"
					onClose={onCloseImageModal}
				>
					<div className="relative max-w-4xl max-h-full">
						<img
							src={clientImage}
							alt="Client Full"
							className="object-contain w-full h-full"
						/>
						<form method="dialog">
							<Button
								variant="ghost"
								type="submit"
								className="absolute top-4 right-4 text-white text-2xl bg-transparent border-none cursor-pointer hover:bg-black/20 h-auto"
								aria-label="Close"
							>
								&times;
							</Button>
						</form>
					</div>
				</dialog>
			)}
			{transactionType && selectedAccount?.accountNo && (
				<TransactionForm
					accountNumber={selectedAccount.accountNo}
					onCancel={onCloseTransactionModal}
					onSubmit={onSubmitTransaction}
					transactionType={transactionType}
					errorMessage={transactionError}
					isSubmitting={isSubmitting}
					isSuccess={isSuccess}
				/>
			)}
		</div>
	);
};
