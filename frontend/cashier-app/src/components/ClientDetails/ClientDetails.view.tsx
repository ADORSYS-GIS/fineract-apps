import { Button, formatCurrency } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
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
				<p>{t("loadingClientDetails")}</p>
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
					<span className="text-sm text-gray-500">{t("loading")}</span>
				</div>
			);
		}
		if (clientImage) {
			return (
				<img
					src={clientImage}
					alt={t("clientName")}
					className="w-32 h-32 rounded-full shadow-md"
				/>
			);
		}
		return (
			<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
				<span className="text-sm text-gray-500">{t("noImage")}</span>
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
								<Button variant="outline">&larr; {t("back")}</Button>
							</Link>
							<h2 className="text-3xl font-bold text-gray-800">
								{t("clientDetails")}
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
								{t(status?.value?.toLowerCase() ?? "unknown")}
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
								<p className="text-sm font-medium text-gray-500">
									{t("clientName")}
								</p>
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
													<span className="font-semibold">
														{t("accountNo")}:{" "}
													</span>
													<span>{savingsAccount?.accountNo}</span>
												</div>
												<div className="flex justify-between md:block">
													<span className="font-semibold">
														{t("lastActive")}:{" "}
													</span>
													<span>{formattedDate}</span>
												</div>
												<div className="flex justify-between md:block">
													<span className="font-semibold">
														{t("accountBalance")}:{" "}
													</span>
													<span>
														{formatCurrency(
															savingsAccount?.summary?.accountBalance,
															savingsAccount.currency?.code,
														)}
													</span>
												</div>
												<div className="flex justify-between md:block">
													<span className="font-semibold">
														{t("availableBalance")}:{" "}
													</span>
													<span>
														{formatCurrency(
															savingsAccount?.summary?.availableBalance,
															savingsAccount.currency?.code,
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
						<Button onClick={onDeposit} disabled={status?.value !== "Active"}>
							{t("deposit")}
						</Button>
						<Button
							onClick={onWithdraw}
							variant="outline"
							disabled={status?.value !== "Active"}
						>
							{t("withdrawal")}
						</Button>
					</div>
				</div>
				<div className="border-t border-gray-200 px-6 py-6">
					<h3 className="text-xl text-gray-700 mb-4">
						{t("recentTransactions")}
					</h3>
					<div className="border border-gray-200 rounded-lg overflow-hidden">
						<div className="hidden md:grid grid-cols-3 gap-4 p-4 border-b border-gray-200 items-center text-gray-500 font-medium">
							<div>{t("date")}</div>
							<div>{t("transactionType")}</div>
							<div className="text-right">{t("amount")}</div>
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
										<div>
											{t(
												transaction.transactionType?.value?.toLowerCase() ??
													"unknown",
											)}
										</div>
										<div
											className={`text-right ${
												transaction.transactionType?.value === "Deposit"
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											{formatCurrency(
												transaction.amount,
												savingsAccount.currency?.code,
											)}
										</div>
									</div>
								))
							) : (
								<div className="p-4 text-center text-gray-500">
									{t("noTransactionsFound")}
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
							alt={t("clientName")}
							className="object-contain w-full h-full"
						/>
						<form method="dialog">
							<Button
								variant="ghost"
								type="submit"
								className="absolute top-4 right-4 text-white text-2xl bg-transparent border-none cursor-pointer hover:bg-black/20 h-auto"
								aria-label={t("close")}
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
