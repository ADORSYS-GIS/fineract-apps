import { ReportViewerView } from "./ReportViewer.view";
import type { ReportViewerProps } from "./ReportViewer.types";
import { useReportViewer } from "./useReportViewer";

export function ReportViewer(props: ReportViewerProps) {
	const viewerData = useReportViewer(props);
	return <ReportViewerView {...viewerData} {...props} />;
}
