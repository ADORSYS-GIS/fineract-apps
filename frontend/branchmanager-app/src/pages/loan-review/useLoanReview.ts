import { LoansService } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { LoanDetails } from "./LoanReview.types";

export function useLoanReview() {
	const { loanId } = useParams({
		from: "/approve/loans/$loanId",
	});
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { handleError } = useErrorHandler();

	const {
		data: loan,
		isLoading,
		isError,
		error,
	} = useQuery<LoanDetails, Error>({
		queryKey: ["loan", loanId],
		queryFn: () =>
			LoansService.getV1LoansByLoanId({
				loanId: parseInt(loanId, 10),
				associations: "all",
			}),
	});

	const approveMutation = useMutation({
		mutationFn: (note: string) =>
			LoansService.postV1LoansByLoanId({
				loanId: parseInt(loanId, 10),
				command: "approve",
				requestBody: {
					approvedOnDate: new Date().toLocaleDateString("en-GB"),
					dateFormat: "dd/MM/yyyy",
					locale: "en",
					note,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pendingLoans"] });
			navigate({ to: "/approve/loans", search: { q: "" } });
		},
		onError: handleError,
	});

	const rejectMutation = useMutation({
		mutationFn: (note: string) =>
			LoansService.postV1LoansByLoanId({
				loanId: parseInt(loanId, 10),
				command: "reject",
				requestBody: {
					rejectedOnDate: new Date().toLocaleDateString("en-GB"),
					dateFormat: "dd/MM/yyyy",
					locale: "en",
					note,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pendingLoans"] });
			navigate({ to: "/approve/loans", search: { q: "" } });
		},
		onError: handleError,
	});

	const onApprove = (note: string) => {
		approveMutation.mutate(note);
	};

	const onReject = (note: string) => {
		rejectMutation.mutate(note);
	};

	const loanErrorMsg = isError ? (error?.message ?? "Error") : undefined;

	return {
		loan,
		isLoading,
		error: loanErrorMsg,
		onApprove,
		onReject,
	};
}
