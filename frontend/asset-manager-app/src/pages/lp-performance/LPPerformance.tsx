import { FC } from "react";
import { LPPerformanceView } from "./LPPerformance.view";
import { useLPPerformance } from "./useLPPerformance";

export const LPPerformance: FC = () => {
	const props = useLPPerformance();
	return <LPPerformanceView {...props} />;
};
