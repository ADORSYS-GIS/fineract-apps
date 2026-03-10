import { GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";

type LoanStatus = GetLoansLoanIdResponse["status"];

export const getLoanStatusProps = (status?: LoanStatus) => {
	if (!status) return null;

	if (status.pendingApproval) {
		return { text: "Pending Approval", className: "bg-yellow-500" };
	}
	if (status.waitingForDisbursal) {
		return { text: "Approved", className: "bg-yellow-500" };
	}
	if (status.active) {
		return { text: "Active", className: "bg-green-500" };
	}
	if (status.closed) {
		return { text: "Closed", className: "bg-red-500" };
	}

	// Default fallback for other statuses
	const statusText = status.code
		? status.code.replace("loanStatusType.", "").replaceAll(".", " ")
		: "Unknown";

	return { text: statusText, className: "bg-gray-500" };
};
