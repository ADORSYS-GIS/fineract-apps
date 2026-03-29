import { FC } from "react";
import { SettlementView } from "./Settlement.view";
import { useSettlement } from "./useSettlement";

export const Settlement: FC = () => {
	const props = useSettlement();
	return <SettlementView {...props} />;
};
