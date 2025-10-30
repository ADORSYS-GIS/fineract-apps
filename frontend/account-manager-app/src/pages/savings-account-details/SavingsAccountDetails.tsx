import { useParams } from "@tanstack/react-router";
import { FC, useState } from "react";
import { SavingsAccountDetailsView } from "./SavingsAccountDetails.view";
import { useSavingsAccountDetails } from "./useSavingsAccountDetails";

export const SavingsAccountDetails: FC = () => {
	const { accountId } = useParams({
		from: "/savings-account-details/$accountId",
	});
	const [isBlockModalOpen, setBlockModalOpen] = useState(false);

	const openBlockModal = () => setBlockModalOpen(true);
	const closeBlockModal = () => setBlockModalOpen(false);

	const props = useSavingsAccountDetails(Number(accountId), {
		onBlockSuccess: closeBlockModal,
	});

	return (
		<SavingsAccountDetailsView
			{...props}
			isBlockModalOpen={isBlockModalOpen}
			openBlockModal={openBlockModal}
			closeBlockModal={closeBlockModal}
		/>
	);
};
