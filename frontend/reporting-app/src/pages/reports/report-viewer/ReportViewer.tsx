import type { ReportViewerProps } from "./ReportViewer.types";
import { ReportViewerView } from "./ReportViewer.view";
import { useReportViewer } from "./useReportViewer";

export function ReportViewer(props: ReportViewerProps) {
	const viewerData = useReportViewer(props);
	return <ReportViewerView {...viewerData} {...props} />;
}
