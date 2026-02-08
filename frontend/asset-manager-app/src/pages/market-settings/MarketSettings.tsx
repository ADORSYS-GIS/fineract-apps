import { FC } from "react";
import { MarketSettingsView } from "./MarketSettings.view.tsx";
import { useMarketSettings } from "./useMarketSettings.ts";

export const MarketSettings: FC = () => {
	const marketSettingsProps = useMarketSettings();
	return <MarketSettingsView {...marketSettingsProps} />;
};
