import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { BackButton } from "@/components/BackButton";
import { PendingLoansViewProps } from "./PendingLoans.types";

export const PendingLoansView = ({
	loans,
	isLoading,
	error,
}: PendingLoansViewProps) => {
	const navigate = useNavigate();
	return (
		<div className="p-4 sm:p-6">
			<div className="flex items-center gap-4">
				<BackButton to="/approve/account" />
				<h1 className="text-2xl font-bold">Pending Loan Approvals</h1>
			</div>
			<div className="mt-6">
				<Card className="h-full w-full">
					<div>
						<SearchBar placeholder="Filter by client, loan officer or product..." />
					</div>
					<div className="overflow-x-auto mt-4">
						<table className="w-full text-sm text-left text-gray-500">
							<thead className="text-xs text-white uppercase bg-primary">
								<tr>
									<th className="px-6 py-3">Client Name</th>
									<th className="px-6 py-3">Loan Officer</th>
									<th className="px-6 py-3">Principal</th>
									<th className="px-6 py-3">Submitted On</th>
									<th className="px-6 py-3">Loan Product</th>
									<th className="px-6 py-3">Action</th>
								</tr>
							</thead>
							<tbody>
								{isLoading && (
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-gray-500" colSpan={6}>
											Loading...
										</td>
									</tr>
								)}
								{error && (
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-red-600" colSpan={6}>
											{error}
										</td>
									</tr>
								)}
								{!isLoading &&
									!error &&
									(loans.length > 0 ? (
										loans.map((loan) => (
											<tr key={loan.id} className="bg-white border-b">
												<td className="px-6 py-4 font-medium text-gray-900">
													{loan.clientName}
												</td>
												<td className="px-6 py-4">{loan.loanOfficerName}</td>
												<td className="px-6 py-4">{loan.principal}</td>
												<td className="px-6 py-4">{loan.submittedOnDate}</td>
												<td className="px-6 py-4">{loan.loanProductName}</td>
												<td className="px-6 py-4">
													<Button
														onClick={() =>
															navigate({
																to: "/approve/loans/$loanId",
																params: { loanId: loan.id.toString() },
															})
														}
													>
														Review
													</Button>
												</td>
											</tr>
										))
									) : (
										<tr className="bg-white border-b">
											<td className="px-6 py-4 text-gray-500" colSpan={6}>
												No pending loans.
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</Card>
			</div>
		</div>
	);
};
