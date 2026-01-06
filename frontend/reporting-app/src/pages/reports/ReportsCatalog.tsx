import { ReportsCatalogView } from "./ReportsCatalog.view";
import { useReportsCatalog } from "./useReportsCatalog";

export function ReportsCatalog() {
	const catalogData = useReportsCatalog();
	return <ReportsCatalogView {...catalogData} />;
}
