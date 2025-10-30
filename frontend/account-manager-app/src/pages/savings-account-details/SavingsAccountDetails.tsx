import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import { SavingsAccountDetailsView } from "./SavingsAccountDetails.view";
import { useSavingsAccountDetails } from "./useSavingsAccountDetails";
import { useSavingsAccountDetailsState } from "./useSavingsAccountDetails.helpers";

export const SavingsAccountDetails: FC = () => {
	const { accountId } = useParams({
		from: "/savings-account-details/$accountId",
	});
	const state = useSavingsAccountDetailsState();
	const props = useSavingsAccountDetails(
		Number(accountId),
		state.closeBlockModal,
	);

	return <SavingsAccountDetailsView {...props} {...state} />;
};
