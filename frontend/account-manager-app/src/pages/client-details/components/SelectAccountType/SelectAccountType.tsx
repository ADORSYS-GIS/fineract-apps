import { FC } from "react";
import { SelectAccountTypeView } from "./SelectAccountType.view";
import { useSelectAccountType } from "./useSelectAccountType";

interface SelectAccountTypeProps {
	isOpen: boolean;
	closeModal: () => void;
	clientId?: number;
}

export const SelectAccountType: FC<SelectAccountTypeProps> = ({
	isOpen,
	closeModal,
	clientId,
}) => {
	const selectAccountTypeProps = useSelectAccountType();
	return (
		<SelectAccountTypeView
			{...selectAccountTypeProps}
			isOpen={isOpen}
			closeModal={closeModal}
			clientId={clientId}
		/>
	);
};
