import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import { SavingsAccountDetailsView } from "./SavingsAccountDetails.view";
import { useSavingsAccountDetails } from "./useSavingsAccountDetails";

export const SavingsAccountDetails: FC = () => {
	const { accountId } = useParams({
		from: "/savings-account-details/$accountId",
	});
	const props = useSavingsAccountDetails(Number(accountId));

	return <SavingsAccountDetailsView {...props} />;
};
