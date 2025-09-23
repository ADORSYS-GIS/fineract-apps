import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SavingsAccountCard } from "../SavingsAccountCard";
import { TransactionForm } from "../TransactionForm";
import { ClientDetailsViewProps } from "./ClientDetails.types";

const formatDateArray = (dateArray: number[] | undefined) => {
	if (!dateArray || dateArray.length < 3) {
		return null;
	}
	const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
	return `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("en", { month: "long" })} ${date.getFullYear()}`;
};
export const ClientDetailsView: React.FC<ClientDetailsViewProps> = ({
	client,
	clientAccounts,
	clientImage,
	isClientImageLoading,
	isImageModalOpen,
	transactionType,
	transactionError,
	onDeposit,
	onWithdraw,
	onCloseTransactionModal,
	onOpenImageModal,
	onCloseImageModal,
	onSubmitTransaction,
	isSubmitting,
	isSuccess,
	selectedAccount,
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

	const status = client.status as { value?: string };
	const submittedOnDate = client.timeline
		?.submittedOnDate as unknown as number[];
	const activatedOnDate = client.timeline
		?.activatedOnDate as unknown as number[];
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
						<Button
							variant="ghost"
							className="flex-shrink-0 mx-auto md:mx-0 cursor-pointer appearance-none bg-transparent border-none p-0 text-left h-auto"
							onClick={onOpenImageModal}
						>
							{renderClientImage()}
						</Button>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 flex-grow">
							<div className="flex flex-col">
								<p className="text-sm font-medium text-gray-500">Name</p>
								<p className="mt-1 text-lg text-gray-900">
									{client.displayName}
								</p>
							</div>
							<div className="flex flex-col">
								<p className="text-sm font-medium text-gray-500">
									Client Account No.
								</p>
								<p className="mt-1 text-lg text-gray-900">{client.accountNo}</p>
							</div>
							<div className="flex flex-col">
								<p className="text-sm font-medium text-gray-500">Office</p>
								<p className="mt-1 text-lg text-gray-900">
									{client.officeName}
								</p>
							</div>
							<div className="flex flex-col">
								<p className="text-sm font-medium text-gray-500">Client ID</p>
								<p className="mt-1 text-lg text-gray-900">{client.id}</p>
							</div>
							<div className="flex flex-col">
								<p className="text-sm font-medium text-gray-500">
									Submitted On
								</p>
								<p className="mt-1 text-lg text-gray-900">
									{formatDateArray(submittedOnDate)}
								</p>
							</div>
							<div className="flex flex-col">
								<p className="text-sm font-medium text-gray-500">
									Activated On
								</p>
								<p className="mt-1 text-lg text-gray-900">
									{formatDateArray(activatedOnDate)}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="border-t border-gray-200 px-6 py-6">
					<h3 className="text-xl font-semibold text-gray-800 mb-4">
						Savings Accounts
					</h3>
					<div className="space-y-4">
						{clientAccounts?.savingsAccounts?.map((account) => (
							<SavingsAccountCard
								key={account.id}
								account={account}
								onDeposit={onDeposit}
								onWithdraw={onWithdraw}
							/>
						))}
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
