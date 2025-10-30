import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import { SavingsAccountDetailsView } from "./SavingsAccountDetails.view";
import { useSavingsAccountDetails } from "./useSavingsAccountDetails";
import { useSavingsAccountDetailsState } from "./useSavingsAccountDetails.helpers";

export const SavingsAccountDetails: FC = () => {
	const { accountId } = useParams({
		from: "/savings-account-details/$accountId",
	});
	const [isBlockModalOpen, openBlockModal, closeBlockModal] =
		useSavingsAccountDetailsState();
	const props = useSavingsAccountDetails(Number(accountId), closeBlockModal);

	return (
		<SavingsAccountDetailsView
			{...props}
			isBlockModalOpen={isBlockModalOpen}
			openBlockModal={openBlockModal}
			closeBlockModal={closeBlockModal}
		/>
	);
};
