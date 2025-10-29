import { useParams } from "@tanstack/react-router";
import { FC, useState } from "react";
import { SavingsAccountDetailsView } from "./SavingsAccountDetails.view";
import { useSavingsAccountDetails } from "./useSavingsAccountDetails";

export const SavingsAccountDetails: FC = () => {
	const { accountId } = useParams({
		from: "/savings-account-details/$accountId",
	});
	const props = useSavingsAccountDetails(Number(accountId));
	const [isBlockModalOpen, setBlockModalOpen] = useState(false);

	return (
		<SavingsAccountDetailsView
			{...props}
			isBlockModalOpen={isBlockModalOpen}
			setBlockModalOpen={setBlockModalOpen}
		/>
	);
};
