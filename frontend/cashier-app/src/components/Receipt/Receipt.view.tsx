import React from "react";
import { useQuery } from "@tanstack/react-query";
import { LoanTransactionsService, GetLoansLoanIdTransactionsTransactionIdResponse, ApiError } from "@fineract-apps/fineract-api";
import { Card } from "@fineract-apps/ui";

interface ReceiptProps {
  loanId: number;
  transactionId: number;
}

export const Receipt: React.FC<ReceiptProps> = ({ loanId, transactionId }) => {
  const { data: transaction, isLoading, error } = useQuery<GetLoansLoanIdTransactionsTransactionIdResponse, ApiError>({
    queryKey: ["transaction", loanId, transactionId],
    queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsByTransactionId({ loanId, transactionId }),
  });

  if (isLoading) {
    return <div>Loading receipt...</div>;
  }

  if (error) {
    return <div>Error fetching receipt: {error.message}</div>;
  }

  if (!transaction) {
    return <div>Transaction not found.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card>
      <div className="p-6" id="receipt">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Transaction Receipt</h2>
          <span className="text-sm text-gray-500">Date: {new Date(transaction.date as unknown as string).toLocaleDateString()}</span>
        </div>
        <hr className="my-4" />
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-gray-600">Transaction ID:</p>
            <p className="font-medium text-gray-800">{transaction.id}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Type:</p>
            <p className="font-medium text-gray-800">{transaction.type?.code}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Amount:</p>
            <p className="font-medium text-gray-800">{transaction.amount} {transaction.currency?.displaySymbol}</p>
          </div>
          <hr className="my-4 border-dashed" />
          <div className="flex justify-between">
            <p className="text-gray-600">Principal Portion:</p>
            <p className="font-medium text-gray-800">{transaction.principalPortion} {transaction.currency?.displaySymbol}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Interest Portion:</p>
            <p className="font-medium text-gray-800">{transaction.interestPortion} {transaction.currency?.displaySymbol}</p>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <p className="text-gray-800">Outstanding Loan Balance:</p>
            <p className="text-green-600">{transaction.outstandingLoanBalance} {transaction.currency?.displaySymbol}</p>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-50 flex justify-end">
        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-6 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Print Receipt
        </button>
      </div>
    </Card>
  );
};