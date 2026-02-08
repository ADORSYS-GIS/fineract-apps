import { FC } from "react";
import { OrderBookView } from "./OrderBook.view.tsx";
import { useOrderBook } from "./useOrderBook.ts";

export const OrderBook: FC = () => {
	const orderBookProps = useOrderBook();
	return <OrderBookView {...orderBookProps} />;
};
