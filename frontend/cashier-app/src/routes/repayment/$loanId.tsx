import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LoansService, ApiError, GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";
import { Card } from "@fineract-apps/ui";
import { useState } from "react";
import { Receipt } from "../../components/Receipt/Receipt.view";
import { useRepaymentForm } from "../../hooks/useRepaymentForm";
import { format } from "date-fns";

export const Route = createFileRoute("/repayment/$loanId")({
  component: LoanRepaymentComponent,
});

function LoanRepaymentComponent() {
  const { loanId } = Route.useParams();
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const { data: loan, isLoading, error } = useQuery<GetLoansLoanIdResponse, ApiError>({
    queryKey: ["loan", loanId],
    queryFn: () => LoansService.getV1LoansByLoanId({ loanId: parseInt(loanId, 10) }),
  });

  const {
    amount,
    setAmount,
    paymentTypeId,
    setPaymentTypeId,
    transactionDate,
    setTransactionDate,
    note,
    setNote,
    handleSubmit,
    isLoading: isSubmitting,
    paymentTypes,
  } = useRepaymentForm(parseInt(loanId, 10), setTransactionId);

  if (isLoading) {
    return <div>Loading loan details...</div>;
  }

  if (error) {
    return <div>Error fetching loan details: {error.message}</div>;
  }

  if (!loan) {
    return <div>Loan not found.</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Client Summary</h2>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <p className="text-lg font-bold text-gray-800">{loan.clientName}</p>
                <p className="text-sm text-gray-500">Account: {loan.accountNo}</p>
              </div>
            </div>

            <hr className="my-6" />

            <h2 className="text-xl font-semibold text-gray-700 mb-4">Loan Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Outstanding Balance</p>
                <p className="text-xl font-bold text-gray-800">{loan.summary?.totalOutstanding} XAF</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Next Installment</p>
                <p className="text-xl font-bold text-gray-800">{loan.summary?.totalOutstanding} XAF</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="text-xl font-bold text-gray-800">{loan.timeline?.expectedMaturityDate ? format(new Date(loan.timeline.expectedMaturityDate as unknown as string), "dd MMM yyyy") : 'N/A'}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Transaction Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Repayment Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
                    required
                    placeholder="450,000 XAF"
                  />
                </div>
                <div>
                  <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    id="transactionDate"
                    value={format(transactionDate, "yyyy-MM-dd")}
                    onChange={(e) => setTransactionDate(new Date(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="paymentTypeId" className="block text-sm font-medium text-gray-700">
                  Payment Type
                </label>
                <select
                  id="paymentTypeId"
                  value={paymentTypeId}
                  onChange={(e) => setPaymentTypeId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
                  required
                >
                  <option value="">Select Payment Type</option>
                  {paymentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
                  rows={4}
                  placeholder="Add any additional notes..."
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-6 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit Repayment"}
                </button>
              </div>
            </form>
          </div>
        </Card>

        {transactionId && (
          <Receipt loanId={parseInt(loanId, 10)} transactionId={transactionId} />
        )}
      </div>
    </div>
  );
}