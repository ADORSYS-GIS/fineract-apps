import { AuditTrailView } from "./AuditTrail.view";
import { useAuditTrail } from "./useAuditTrail";

export function AuditTrail() {
	const auditData = useAuditTrail();
	return <AuditTrailView {...auditData} />;
}
