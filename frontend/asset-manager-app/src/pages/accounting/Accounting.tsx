import { AccountingView } from "./Accounting.view";
import { useAccounting } from "./useAccounting";

export const Accounting = () => {
	const props = useAccounting();
	return <AccountingView {...props} />;
};
