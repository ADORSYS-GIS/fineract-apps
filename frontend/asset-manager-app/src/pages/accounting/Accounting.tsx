import { FC } from "react";
import { AccountingView } from "./Accounting.view";
import { useAccounting } from "./useAccounting";

export const Accounting: FC = () => {
	const props = useAccounting();
	return <AccountingView {...props} />;
};
