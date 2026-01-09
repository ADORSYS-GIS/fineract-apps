import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/BackButton";
import { PendingLoansViewProps } from "./PendingLoans.types";

export const PendingLoansView = ({
	loans,
	isLoading,
	error,
}: PendingLoansViewProps) => {
	const { t } = useTranslation();
	const search = useSearch({ from: "/approve/loans" });
	const initial = String(search?.q ?? "");
	const [value, setValue] = useState(initial);
	const navigate = useNavigate({ from: "/approve/loans" });

	const handleValueChange = (val: string) => {
		setValue(val);
	};

	const handleSearch = (val: string) => {
		navigate({
			to: "/approve/loans",
			search: { q: val },
		});
	};

	return (
		<div className="p-4 sm:p-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
				<h1 className="text-2xl font-bold text-center sm:text-left order-2 sm:order-1">
					{t("pendingLoans.pendingLoanApprovals")}
				</h1>
				<div className="order-1 sm:order-2">
					<BackButton to="/approve/account" />
				</div>
			</div>
			<div className="mt-6">
				<Card className="h-full w-full">
					<div>
						<SearchBar
							value={value}
							onValueChange={handleValueChange}
							onSearch={handleSearch}
							placeholder={t("pendingLoans.filterPlaceholder")}
						/>
					</div>
					<div className="overflow-x-auto mt-4">
						<table className="w-full text-sm text-left text-gray-500">
							<thead className="text-xs text-white uppercase bg-primary">
								<tr>
									<th className="px-6 py-3 rounded-l-lg">
										{t("pendingLoans.clientName")}
									</th>
									<th className="px-6 py-3 hidden sm:table-cell">
										{t("pendingLoans.loanOfficer")}
									</th>
									<th className="px-6 py-3">{t("pendingLoans.principal")}</th>
									<th className="px-6 py-3 hidden md:table-cell">
										{t("pendingLoans.submittedOn")}
									</th>
									<th className="px-6 py-3 hidden sm:table-cell">
										{t("pendingLoans.loanProduct")}
									</th>
									<th className="px-6 py-3 rounded-r-lg">
										{t("pendingLoans.action")}
									</th>
								</tr>
							</thead>
							<tbody>
								{isLoading && (
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-gray-500" colSpan={6}>
											{t("cashierDetail.loading")}
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
												<td className="px-6 py-4 hidden sm:table-cell">
													{loan.loanOfficerName}
												</td>
												<td className="px-6 py-4">{loan.principal}</td>
												<td className="px-6 py-4 hidden md:table-cell">
													{loan.submittedOnDate}
												</td>
												<td className="px-6 py-4 hidden sm:table-cell">
													{loan.loanProductName}
												</td>
												<td className="px-6 py-4">
													<Link
														to="/approve/loans/$loanId"
														params={{
															loanId: loan.id.toString(),
														}}
														search={{
															q: value,
														}}
													>
														<Button>{t("pendingLoans.review")}</Button>
													</Link>
												</td>
											</tr>
										))
									) : (
										<tr className="bg-white border-b">
											<td className="px-6 py-4 text-gray-500" colSpan={6}>
												{t("pendingLoans.noPendingLoans")}
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
