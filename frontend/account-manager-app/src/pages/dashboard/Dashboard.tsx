import { FC } from "react";
import { DashboardView } from "./Dashboard.view.tsx";
import { useDashboard } from "./useDashboard.ts";

export const Dashboard: FC = () => {
	const dashboardProps = useDashboard();
	return <DashboardView {...dashboardProps} />;
};
