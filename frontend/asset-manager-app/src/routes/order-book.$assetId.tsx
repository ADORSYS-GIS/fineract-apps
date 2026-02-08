import { createFileRoute } from "@tanstack/react-router";
import { OrderBook } from "../pages/order-book/OrderBook";

export const Route = createFileRoute("/order-book/$assetId")({
	component: OrderBook,
});
