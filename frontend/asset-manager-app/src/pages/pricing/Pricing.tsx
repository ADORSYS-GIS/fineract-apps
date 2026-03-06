import { FC } from "react";
import { PricingView } from "./Pricing.view.tsx";
import { usePricing } from "./usePricing.ts";

export const Pricing: FC = () => {
	const pricingProps = usePricing();
	return <PricingView {...pricingProps} />;
};
