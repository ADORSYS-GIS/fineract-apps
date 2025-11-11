import { DashboardView } from "./Dashboard.view";
import { DashboardViewProps } from "./Dashboard.types";

export function Dashboard({ onLogout }: Readonly<DashboardViewProps>) {
	return <DashboardView onLogout={onLogout} />;
}
