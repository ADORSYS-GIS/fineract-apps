import { useClientDetails } from './useClientDetails';
import { ClientDetailsView } from './ClientDetails.view';
import { Route } from '@/routes/clients/$clientId';

export function ClientDetails() {
  const { clientId } = Route.useParams();
  const {
    client,
    clientAccounts,
    clientImage,
    isLoading,
    isError,
    isImageModalOpen,
    isTransactionModalOpen,
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
  } = useClientDetails(Number(clientId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !client) {
    return <div>Error loading client details.</div>;
  }

  return (
    <ClientDetailsView
      client={client}
      clientAccounts={clientAccounts}
      clientImage={clientImage}
      isImageModalOpen={isImageModalOpen}
      isTransactionModalOpen={isTransactionModalOpen}
      transactionType={transactionType}
      transactionError={transactionError}
      onDeposit={onDeposit}
      onWithdraw={onWithdraw}
      onCloseTransactionModal={onCloseTransactionModal}
      onOpenImageModal={onOpenImageModal}
      onCloseImageModal={onCloseImageModal}
      onSubmitTransaction={onSubmitTransaction}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      selectedAccount={selectedAccount}
    />
  );
}