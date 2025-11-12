import { DashboardViewProps } from "./Dashboard.types";
import { DashboardView } from "./Dashboard.view";

export function Dashboard({ onLogout }: Readonly<DashboardViewProps>) {
	return <DashboardView onLogout={onLogout} />;
}
