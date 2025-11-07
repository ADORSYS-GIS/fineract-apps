import {
	GetLoansResponse,
	LoansService,
	StaffService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Loan } from "./PendingLoans.types";

type ApiLoan = NonNullable<GetLoansResponse["pageItems"]>[number];

export function usePendingLoans() {
	const {
		data: loansData,
		isLoading: isLoadingLoans,
		isError: isLoansError,
		error: loansError,
	} = useQuery({
		queryKey: ["pendingLoans"],
		queryFn: () =>
			LoansService.getV1Loans({
				status: "100",
				associations: "all",
			}),
	});

	const {
		data: staffData,
		isLoading: isLoadingStaff,
		isError: isStaffError,
		error: staffError,
	} = useQuery({
		queryKey: ["staff", "all"],
		queryFn: () => StaffService.getV1Staff({ status: "all" }),
	});

	const loans: Loan[] = useMemo(() => {
		if (!loansData?.pageItems || !staffData) return [];

		const staffMap = new Map(staffData.map((staff) => [staff.id, staff]));

		return loansData.pageItems
			.filter(
				(loan): loan is { id: number } & ApiLoan => typeof loan.id === "number",
			)
			.map((loan) => {
				const loanOfficer = staffMap.get(loan.loanOfficerId as number);
				const submittedOnDateArray = loan.timeline?.submittedOnDate;
				const submittedOnDate =
					Array.isArray(submittedOnDateArray) &&
					submittedOnDateArray.length === 3
						? new Date(
								submittedOnDateArray[0],
								submittedOnDateArray[1] - 1,
								submittedOnDateArray[2],
							).toLocaleDateString()
						: undefined;

				return {
					id: loan.id,
					clientName: loan.clientName,
					loanOfficerName: loanOfficer?.displayName,
					principal: loan.principal,
					submittedOnDate,
					loanProductName: loan.loanProductName,
				};
			});
	}, [loansData, staffData]);

	const isLoading = isLoadingLoans || isLoadingStaff;
	const isError = isLoansError || isStaffError;
	const error = loansError || staffError;
	const loansErrorMsg = isError ? (error?.message ?? "Error") : undefined;

	return {
		loans,
		isLoading,
		error: loansErrorMsg,
	};
}
