import { createFileRoute } from "@tanstack/react-router";
import { useLoanAccountForm } from "../common/useLoanAccountForm";

export const Route = createFileRoute("/loan/create-loan-account/$clientId")({});

export const useCreateLoanAccount = () => {
	const { clientId } = Route.useParams();
	const loanAccountForm = useLoanAccountForm({
		clientId: Number(clientId),
	});

	return loanAccountForm;
};
