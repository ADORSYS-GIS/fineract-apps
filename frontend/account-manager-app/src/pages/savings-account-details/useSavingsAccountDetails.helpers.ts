import { useState } from "react";

export const useSavingsAccountDetailsState = (): [
	boolean,
	() => void,
	() => void,
] => {
	const [isBlockModalOpen, setBlockModalOpen] = useState(false);

	const openBlockModal = () => setBlockModalOpen(true);
	const closeBlockModal = () => setBlockModalOpen(false);

	return [isBlockModalOpen, openBlockModal, closeBlockModal];
};
