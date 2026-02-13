import { FC } from "react";
import { OrderResolutionView } from "./OrderResolution.view.tsx";
import { useOrderResolution } from "./useOrderResolution.ts";

export const OrderResolution: FC = () => {
	const orderResolutionProps = useOrderResolution();
	return <OrderResolutionView {...orderResolutionProps} />;
};
