import { useState } from "react";

export const useSavingsAccountDetailsState = () => {
	const [isBlockModalOpen, setBlockModalOpen] = useState(false);

	const openBlockModal = () => setBlockModalOpen(true);
	const closeBlockModal = () => setBlockModalOpen(false);

	return {
		isBlockModalOpen,
		openBlockModal,
		closeBlockModal,
	};
};
