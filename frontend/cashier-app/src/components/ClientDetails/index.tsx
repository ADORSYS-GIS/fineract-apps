import { useState } from "react";
import { Route } from "@/routes/clients/$clientId";
import { ClientDetailsView } from "./ClientDetails.view";
import { useClientDetails } from "./useClientDetails";
import { useClientImage } from "./useClientImage";

export function ClientDetails() {
	const { clientId } = Route.useParams();
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const {
		savingsAccount,
		isLoading: isSavingsAccountLoading,
		isError: isSavingsAccountError,
		isTransactionModalOpen,
		transactionType,
		transactionError,
		onDeposit,
		onWithdraw,
		onCloseTransactionModal,
		onSubmitTransaction,
		isSubmitting,
		isSuccess,
		selectedAccount,
	} = useClientDetails(Number(clientId));
	const { data: clientImage, isLoading: isClientImageLoading } = useClientImage(
		String(savingsAccount?.clientId),
	);

	const handleOpenImageModal = () => setIsImageModalOpen(true);
	const handleCloseImageModal = () => setIsImageModalOpen(false);

	if (isSavingsAccountLoading) {
		return <div>Loading...</div>;
	}

	if (isSavingsAccountError || !savingsAccount) {
		return <div>Error loading client details.</div>;
	}

	return (
		<ClientDetailsView
			savingsAccount={savingsAccount}
			clientImage={clientImage}
			isClientImageLoading={isClientImageLoading}
			isImageModalOpen={isImageModalOpen}
			isTransactionModalOpen={isTransactionModalOpen}
			transactionType={transactionType}
			transactionError={transactionError}
			onDeposit={onDeposit}
			onWithdraw={onWithdraw}
			onCloseTransactionModal={onCloseTransactionModal}
			onOpenImageModal={handleOpenImageModal}
			onCloseImageModal={handleCloseImageModal}
			onSubmitTransaction={onSubmitTransaction}
			isSubmitting={isSubmitting}
			isSuccess={isSuccess}
			selectedAccount={selectedAccount}
		/>
	);
}
