import { Button, Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Loader2,
	Pencil,
	PlusCircle,
	Trash2,
	X,
} from "lucide-react";
import { FC, useState } from "react";
import type { MarketMakerOrderRequest } from "@/services/assetApi";
import { useOrderBook } from "./useOrderBook";

const OrderForm: FC<{
	initialData?: { side: "BUY" | "SELL"; price: number; quantity: number };
	onSubmit: (data: MarketMakerOrderRequest) => void;
	onCancel: () => void;
	isSubmitting: boolean;
	title: string;
}> = ({ initialData, onSubmit, onCancel, isSubmitting, title }) => {
	const [side, setSide] = useState<"BUY" | "SELL">(initialData?.side ?? "SELL");
	const [price, setPrice] = useState(String(initialData?.price ?? ""));
	const [quantity, setQuantity] = useState(String(initialData?.quantity ?? ""));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ side, price: Number(price), quantity: Number(quantity) });
	};

	return (
		<Card className="p-4 mb-4 border-blue-200 bg-blue-50">
			<div className="flex justify-between items-center mb-3">
				<h3 className="font-semibold text-gray-800">{title}</h3>
				<button onClick={onCancel}>
					<X className="h-4 w-4 text-gray-500" />
				</button>
			</div>
			<form
				onSubmit={handleSubmit}
				className="grid grid-cols-1 sm:grid-cols-4 gap-3"
			>
				<div>
					<label className="block text-xs font-medium text-gray-600 mb-1">
						Side
					</label>
					<select
						className="w-full border rounded px-2 py-1.5 text-sm"
						value={side}
						onChange={(e) => setSide(e.target.value as "BUY" | "SELL")}
					>
						<option value="BUY">BUY</option>
						<option value="SELL">SELL</option>
					</select>
				</div>
				<div>
					<label className="block text-xs font-medium text-gray-600 mb-1">
						Price (XAF)
					</label>
					<input
						type="number"
						className="w-full border rounded px-2 py-1.5 text-sm"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						min={0}
						required
					/>
				</div>
				<div>
					<label className="block text-xs font-medium text-gray-600 mb-1">
						Quantity
					</label>
					<input
						type="number"
						className="w-full border rounded px-2 py-1.5 text-sm"
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
						min={0}
						required
					/>
				</div>
				<div className="flex items-end">
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full text-sm"
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Save"
						)}
					</Button>
				</div>
			</form>
		</Card>
	);
};

export const OrderBookView: FC<ReturnType<typeof useOrderBook>> = ({
	assetId,
	asset,
	buyOrders,
	sellOrders,
	isLoading,
	orderBook,
	recentTrades,
	showAddForm,
	setShowAddForm,
	editingOrder,
	setEditingOrder,
	onCreate,
	onUpdate,
	onDelete,
	isCreating,
	isUpdating,
}) => {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="flex items-center gap-4 mb-6">
					<Link to="/asset-details/$assetId" params={{ assetId }}>
						<Button variant="outline" className="p-2">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div className="flex-1">
						<h1 className="text-2xl font-bold text-gray-800">
							Order Book - {asset?.name ?? assetId}
						</h1>
						<p className="text-sm text-gray-500">
							Manage market maker standing orders
						</p>
					</div>
					<Button
						onClick={() => setShowAddForm(true)}
						className="flex items-center gap-2"
					>
						<PlusCircle className="h-4 w-4" />
						Add Order
					</Button>
				</div>

				{/* Add Form */}
				{showAddForm && (
					<OrderForm
						onSubmit={onCreate}
						onCancel={() => setShowAddForm(false)}
						isSubmitting={isCreating}
						title="New Market Maker Order"
					/>
				)}

				{/* Edit Form */}
				{editingOrder && (
					<OrderForm
						initialData={{
							side: editingOrder.side,
							price: editingOrder.price,
							quantity: editingOrder.quantity,
						}}
						onSubmit={(data) => onUpdate(editingOrder.id, data)}
						onCancel={() => setEditingOrder(null)}
						isSubmitting={isUpdating}
						title="Edit Order"
					/>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					{/* Sell Orders (Asks) */}
					<Card className="p-4">
						<h2 className="text-lg font-semibold text-red-700 mb-3">
							Sell Orders (Asks) - {sellOrders.length}
						</h2>
						{sellOrders.length === 0 ? (
							<p className="text-sm text-gray-500 py-4 text-center">
								No sell orders
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm">
									<thead>
										<tr className="text-left text-xs text-gray-500 uppercase border-b">
											<th className="pb-2">Price</th>
											<th className="pb-2">Qty</th>
											<th className="pb-2">Remaining</th>
											<th className="pb-2">Active</th>
											<th className="pb-2" />
										</tr>
									</thead>
									<tbody>
										{sellOrders.map((order) => (
											<tr key={order.id} className="border-b border-gray-100">
												<td className="py-2 font-mono text-red-600">
													{order.price.toLocaleString()}
												</td>
												<td className="py-2">{order.quantity}</td>
												<td className="py-2">{order.remainingQuantity}</td>
												<td className="py-2">
													<span
														className={`text-xs px-1.5 py-0.5 rounded ${
															order.isActive
																? "bg-green-100 text-green-700"
																: "bg-gray-100 text-gray-500"
														}`}
													>
														{order.isActive ? "Yes" : "No"}
													</span>
												</td>
												<td className="py-2">
													<div className="flex gap-1">
														<button
															onClick={() => setEditingOrder(order)}
															className="p-1 text-gray-400 hover:text-blue-600"
														>
															<Pencil className="h-3.5 w-3.5" />
														</button>
														<button
															onClick={() => onDelete(order.id)}
															className="p-1 text-gray-400 hover:text-red-600"
														>
															<Trash2 className="h-3.5 w-3.5" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</Card>

					{/* Buy Orders (Bids) */}
					<Card className="p-4">
						<h2 className="text-lg font-semibold text-green-700 mb-3">
							Buy Orders (Bids) - {buyOrders.length}
						</h2>
						{buyOrders.length === 0 ? (
							<p className="text-sm text-gray-500 py-4 text-center">
								No buy orders
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm">
									<thead>
										<tr className="text-left text-xs text-gray-500 uppercase border-b">
											<th className="pb-2">Price</th>
											<th className="pb-2">Qty</th>
											<th className="pb-2">Remaining</th>
											<th className="pb-2">Active</th>
											<th className="pb-2" />
										</tr>
									</thead>
									<tbody>
										{buyOrders.map((order) => (
											<tr key={order.id} className="border-b border-gray-100">
												<td className="py-2 font-mono text-green-600">
													{order.price.toLocaleString()}
												</td>
												<td className="py-2">{order.quantity}</td>
												<td className="py-2">{order.remainingQuantity}</td>
												<td className="py-2">
													<span
														className={`text-xs px-1.5 py-0.5 rounded ${
															order.isActive
																? "bg-green-100 text-green-700"
																: "bg-gray-100 text-gray-500"
														}`}
													>
														{order.isActive ? "Yes" : "No"}
													</span>
												</td>
												<td className="py-2">
													<div className="flex gap-1">
														<button
															onClick={() => setEditingOrder(order)}
															className="p-1 text-gray-400 hover:text-blue-600"
														>
															<Pencil className="h-3.5 w-3.5" />
														</button>
														<button
															onClick={() => onDelete(order.id)}
															className="p-1 text-gray-400 hover:text-red-600"
														>
															<Trash2 className="h-3.5 w-3.5" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</Card>
				</div>

				{/* Public Order Book View */}
				{orderBook && (
					<Card className="p-4 mb-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-3">
							Public Order Book (Customer View)
						</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="text-sm font-medium text-green-700 mb-2">
									Bids (Buy Side)
								</h3>
								{orderBook.buyOrders.length === 0 ? (
									<p className="text-xs text-gray-400">Empty</p>
								) : (
									<table className="w-full text-xs">
										<thead>
											<tr className="text-gray-500 border-b">
												<th className="text-left pb-1">Price</th>
												<th className="text-left pb-1">Qty</th>
												<th className="text-left pb-1">Value</th>
											</tr>
										</thead>
										<tbody>
											{orderBook.buyOrders.map((e) => (
												<tr key={e.id} className="border-b border-gray-50">
													<td className="py-1 text-green-600 font-mono">
														{e.price.toLocaleString()}
													</td>
													<td className="py-1">{e.quantity}</td>
													<td className="py-1">{e.value.toLocaleString()}</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
							</div>
							<div>
								<h3 className="text-sm font-medium text-red-700 mb-2">
									Asks (Sell Side)
								</h3>
								{orderBook.sellOrders.length === 0 ? (
									<p className="text-xs text-gray-400">Empty</p>
								) : (
									<table className="w-full text-xs">
										<thead>
											<tr className="text-gray-500 border-b">
												<th className="text-left pb-1">Price</th>
												<th className="text-left pb-1">Qty</th>
												<th className="text-left pb-1">Value</th>
											</tr>
										</thead>
										<tbody>
											{orderBook.sellOrders.map((e) => (
												<tr key={e.id} className="border-b border-gray-50">
													<td className="py-1 text-red-600 font-mono">
														{e.price.toLocaleString()}
													</td>
													<td className="py-1">{e.quantity}</td>
													<td className="py-1">{e.value.toLocaleString()}</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
							</div>
						</div>
					</Card>
				)}

				{/* Recent Trades */}
				<Card className="p-4">
					<h2 className="text-lg font-semibold text-gray-800 mb-3">
						Recent Trades
					</h2>
					{recentTrades.length === 0 ? (
						<p className="text-sm text-gray-500 text-center py-4">
							No trades yet
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="text-left text-xs text-gray-500 uppercase border-b">
										<th className="pb-2">Price</th>
										<th className="pb-2">Units</th>
										<th className="pb-2">Side</th>
										<th className="pb-2">Time</th>
									</tr>
								</thead>
								<tbody>
									{recentTrades.map((trade) => (
										<tr
											key={trade.executedAt}
											className="border-b border-gray-100"
										>
											<td className="py-2 font-mono">
												{trade.price.toLocaleString()}
											</td>
											<td className="py-2">{trade.units}</td>
											<td className="py-2">
												<span
													className={`text-xs font-medium ${
														trade.side === "BUY"
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{trade.side}
												</span>
											</td>
											<td className="py-2 text-gray-500">
												{new Date(trade.executedAt).toLocaleString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Card>
			</main>
		</div>
	);
};
