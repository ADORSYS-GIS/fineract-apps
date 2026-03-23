import { FC } from "react";
import { AgencyDashboardView } from "./AgencyDashboard.view";
import { useAgencyDashboard } from "./useAgencyDashboard";

export const AgencyDashboard: FC = () => {
	const dashboardProps = useAgencyDashboard();
	return <AgencyDashboardView {...dashboardProps} />;
};
