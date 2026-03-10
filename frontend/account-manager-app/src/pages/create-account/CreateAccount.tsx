import { FC } from "react";
import { CreateAccountView } from "./CreateAccount.view";
import { useCreateAccount } from "./useCreateAccount";

export const CreateAccount: FC = () => {
	const createAccountProps = useCreateAccount();
	return <CreateAccountView {...createAccountProps} />;
};
