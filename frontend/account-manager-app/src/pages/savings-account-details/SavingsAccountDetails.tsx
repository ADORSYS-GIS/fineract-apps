import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { FC } from "react";
import { SavingsAccountDetailsView } from "./SavingsAccountDetails.view";
import { useSavingsAccountDetails } from "./useSavingsAccountDetails";

export const SavingsAccountDetails: FC = () => {
	const { accountId } = useParams({
		from: "/savings-account-details/$accountId",
	});
	const navigate = useNavigate({
		from: "/savings-account-details/$accountId",
	});
	const { action } = useSearch({
		from: "/savings-account-details/$accountId",
	});
	const isBlockModalOpen = action === "block";

	const openBlockModal = () => {
		navigate({
			search: (prev) => ({ ...prev, action: "block" }),
		});
	};
	const closeBlockModal = () => {
		navigate({
			search: (prev) => ({ ...prev, action: undefined }),
		});
	};

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
