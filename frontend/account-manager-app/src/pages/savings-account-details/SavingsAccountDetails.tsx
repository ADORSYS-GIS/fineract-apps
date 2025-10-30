import { useParams } from "@tanstack/react-router";
import { FC, useState } from "react";
import { useBlockAccount } from "./hooks/useBlockAccount";
import { SavingsAccountDetailsView } from "./SavingsAccountDetails.view";
import { useSavingsAccountDetails } from "./useSavingsAccountDetails";

export const SavingsAccountDetails: FC = () => {
	const { accountId } = useParams({
		from: "/savings-account-details/$accountId",
	});
	const [isBlockModalOpen, setBlockModalOpen] = useState(false);
	const props = useSavingsAccountDetails(Number(accountId));
	const blockAccountProps = useBlockAccount(
		Number(accountId),
		setBlockModalOpen,
	);

	return (
		<SavingsAccountDetailsView
			{...props}
			{...blockAccountProps}
			isBlockModalOpen={isBlockModalOpen}
			setBlockModalOpen={setBlockModalOpen}
		/>
	);
};
