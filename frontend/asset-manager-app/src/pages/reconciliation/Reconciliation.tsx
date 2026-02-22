import { ReconciliationView } from "./Reconciliation.view";
import { useReconciliation } from "./useReconciliation";

export const Reconciliation = () => {
	const props = useReconciliation();
	return <ReconciliationView {...props} />;
};
