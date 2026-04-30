import { FC } from "react";
import { LpManagementView } from "./LpManagement.view";
import { useLpManagement } from "./useLpManagement";

export const LpManagement: FC = () => {
	const props = useLpManagement();
	return <LpManagementView {...props} />;
};
