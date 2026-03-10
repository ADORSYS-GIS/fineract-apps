import type { PageHeaderProps } from "./PageHeader.types";
import { PageHeaderView } from "./PageHeader.view";
import { usePageHeader } from "./usePageHeader";

export function PageHeader(props: PageHeaderProps) {
	const viewProps = usePageHeader(props);
	return <PageHeaderView {...viewProps} />;
}
