import { FC } from "react";
import { ActivateAccountView } from "./ActivateAccount.view";
import { useActivateAccount } from "./useActivateAccount";

export const ActivateAccount: FC = () => {
	const activateAccountProps = useActivateAccount();
	return <ActivateAccountView {...activateAccountProps} />;
};
