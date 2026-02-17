import { Button, Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import {
	BarChart3,
	Pause,
	Pencil,
	Play,
	Plus,
	Power,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { FC, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CouponForecastCard } from "@/components/CouponForecastCard";
import { CouponHistoryTable } from "@/components/CouponHistoryTable";
import { EditAssetDialog } from "@/components/EditAssetDialog";
import { ErrorFallback } from "@/components/ErrorFallback";
import { MintSupplyDialog } from "@/components/MintSupplyDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { useAssetDetails } from "./useAssetDetails";

export const AssetDetailsView: FC<ReturnType<typeof useAssetDetails>> = ({
	assetId,
	asset,
	isLoading,
	isError,
	refetch,
	price,
	onUpdate,
	onActivate,
	onHalt,
	onResume,
	onMint,
	isUpdating,
	isActivating,
	isHalting,
	isResuming,
	isMinting,
}) => {
	const [confirmAction, setConfirmAction] = useState<
		"activate" | "halt" | "resume" | null
	>(null);
	const [editOpen, setEditOpen] = useState(false);
	const [mintOpen, setMintOpen] = useState(false);

	if (isError) {
		return (
			<ErrorFallback
				message="Failed to load asset details."
				onRetry={refetch}
			/>
		);
	}

	if (isLoading || !asset) {
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
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-bold text-gray-800">{asset.name}</h1>
							<StatusBadge status={asset.status} />
						</div>
						<p className="text-sm text-gray-500 mt-1">
							{asset.symbol} | {asset.category} | ID: {asset.id}
						</p>
					</div>
					<div className="flex gap-2 flex-wrap">
						{asset.status === "PENDING" && (
							<Button
								onClick={() => setConfirmAction("activate")}
								disabled={isActivating}
								className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
							>
								{isActivating ? (
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
								) : (
									<Power className="h-4 w-4" />
								)}
								{isActivating ? "Activating..." : "Activate"}
							</Button>
						)}
						{asset.status === "ACTIVE" && (
							<Button
								onClick={() => setConfirmAction("halt")}
								disabled={isHalting}
								variant="outline"
								className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
							>
								{isHalting ? (
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
								) : (
									<Pause className="h-4 w-4" />
								)}
								{isHalting ? "Halting..." : "Halt Trading"}
							</Button>
						)}
						{asset.status === "HALTED" && (
							<Button
								onClick={() => setConfirmAction("resume")}
								disabled={isResuming}
								className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
							>
								{isResuming ? (
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
								) : (
									<Play className="h-4 w-4" />
								)}
								{isResuming ? "Resuming..." : "Resume Trading"}
							</Button>
						)}
						<Button
							variant="outline"
							className="flex items-center gap-2"
							onClick={() => setEditOpen(true)}
						>
							<Pencil className="h-4 w-4" />
							Edit
						</Button>
						{asset.status !== "PENDING" && (
							<Button
								variant="outline"
								className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
								onClick={() => setMintOpen(true)}
							>
								<Plus className="h-4 w-4" />
								Mint Supply
							</Button>
						)}
						<Link to="/pricing/$assetId" params={{ assetId }}>
							<Button variant="outline" className="flex items-center gap-2">
								<BarChart3 className="h-4 w-4" />
								Pricing
							</Button>
						</Link>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<Card className="p-4">
						<p className="text-sm text-gray-500">Current Price</p>
						<p className="text-2xl font-bold text-gray-900">
							{price?.currentPrice?.toLocaleString() ??
								asset.currentPrice?.toLocaleString() ??
								"—"}{" "}
							XAF
						</p>
						<div className="flex items-center mt-1">
							{(price?.change24hPercent ?? 0) >= 0 ? (
								<TrendingUp className="h-4 w-4 text-green-500 mr-1" />
							) : (
								<TrendingDown className="h-4 w-4 text-red-500 mr-1" />
							)}
							<span
								className={`text-sm ${
									(price?.change24hPercent ?? 0) >= 0
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{(price?.change24hPercent ?? 0).toFixed(2)}%
							</span>
						</div>
					</Card>
					<Card className="p-4">
						<p className="text-sm text-gray-500">Total Supply</p>
						<p className="text-2xl font-bold text-gray-900">
							{asset.totalSupply?.toLocaleString()}
						</p>
						<p className="text-sm text-gray-400 mt-1">units</p>
					</Card>
					<Card className="p-4">
						<p className="text-sm text-gray-500">Circulating</p>
						<p className="text-2xl font-bold text-gray-900">
							{asset.circulatingSupply?.toLocaleString()}
						</p>
						<p className="text-sm text-gray-400 mt-1">
							{asset.totalSupply > 0
								? `${((asset.circulatingSupply / asset.totalSupply) * 100).toFixed(1)}% of supply`
								: ""}
						</p>
					</Card>
				</div>

				{/* Bond Information */}
				{asset.category === "BONDS" && (
					<Card className="p-4 mb-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-3">
							Bond Information
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
							<div>
								<p className="text-gray-500">Issuer</p>
								<p className="font-medium">{asset.issuer ?? "—"}</p>
							</div>
							<div>
								<p className="text-gray-500">ISIN</p>
								<p className="font-medium font-mono">{asset.isinCode ?? "—"}</p>
							</div>
							<div>
								<p className="text-gray-500">Maturity Date</p>
								<p className="font-medium">{asset.maturityDate ?? "—"}</p>
							</div>
							<div>
								<p className="text-gray-500">Yield</p>
								<p className="font-medium">
									{asset.interestRate != null ? `${asset.interestRate}%` : "—"}
								</p>
							</div>
							<div>
								<p className="text-gray-500">Coupon Frequency</p>
								<p className="font-medium">
									{asset.couponFrequencyMonths === 1
										? "Monthly"
										: asset.couponFrequencyMonths === 3
											? "Quarterly"
											: asset.couponFrequencyMonths === 6
												? "Semi-Annual"
												: asset.couponFrequencyMonths === 12
													? "Annual"
													: "—"}
								</p>
							</div>
							<div>
								<p className="text-gray-500">Next Coupon</p>
								<p className="font-medium">{asset.nextCouponDate ?? "—"}</p>
							</div>
							<div>
								<p className="text-gray-500">Residual Days</p>
								<p className="font-medium">
									{asset.residualDays != null
										? `${asset.residualDays} days`
										: "—"}
								</p>
							</div>
							<div>
								<p className="text-gray-500">Validity</p>
								<p className="font-medium">
									{asset.validityDate ?? "No deadline"}
									{asset.offerExpired && (
										<span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
											Expired
										</span>
									)}
								</p>
							</div>
						</div>
					</Card>
				)}

				{/* Coupon Payment History */}
				{asset.category === "BONDS" && <CouponHistoryTable assetId={assetId} />}

				{/* Coupon Obligation Forecast */}
				{asset.category === "BONDS" && <CouponForecastCard assetId={assetId} />}

				{/* Asset Info */}
				<Card className="p-4">
					<h2 className="text-lg font-semibold text-gray-800 mb-3">
						Asset Information
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-gray-500">Fineract Product ID:</span>{" "}
							<span className="font-medium">
								{asset.fineractProductId ?? "—"}
							</span>
						</div>
						<div>
							<span className="text-gray-500">Treasury Client ID:</span>{" "}
							<span className="font-medium">
								{asset.treasuryClientId ?? "—"}
							</span>
						</div>
						<div>
							<span className="text-gray-500">Treasury Asset Account:</span>{" "}
							<span className="font-medium">
								{asset.treasuryAssetAccountId ?? "—"}
							</span>
						</div>
						<div>
							<span className="text-gray-500">Treasury Cash Account:</span>{" "}
							<span className="font-medium">
								{asset.treasuryCashAccountId ?? "—"}
							</span>
						</div>
						<div>
							<span className="text-gray-500">Currency Code:</span>{" "}
							<span className="font-medium">{asset.currencyCode}</span>
						</div>
						<div>
							<span className="text-gray-500">Price Mode:</span>{" "}
							<span className="font-medium">{asset.priceMode}</span>
						</div>
						<div>
							<span className="text-gray-500">Decimal Places:</span>{" "}
							<span className="font-medium">{asset.decimalPlaces}</span>
						</div>
						<div>
							<span className="text-gray-500">Created:</span>{" "}
							<span className="font-medium">
								{new Date(asset.createdAt).toLocaleDateString()}
							</span>
						</div>
						{asset.description && (
							<div className="md:col-span-2">
								<span className="text-gray-500">Description:</span>{" "}
								<span className="font-medium">{asset.description}</span>
							</div>
						)}
					</div>
				</Card>
			</main>

			{/* Confirmation Dialogs */}
			<ConfirmDialog
				isOpen={confirmAction === "activate"}
				title="Activate Asset"
				message={`Are you sure you want to activate "${asset.name}"? This will open it for trading.`}
				confirmLabel="Activate"
				confirmClassName="bg-green-600 hover:bg-green-700"
				onConfirm={() => {
					onActivate();
					setConfirmAction(null);
				}}
				onCancel={() => setConfirmAction(null)}
				isLoading={isActivating}
			/>
			<ConfirmDialog
				isOpen={confirmAction === "halt"}
				title="Halt Trading"
				message={`Are you sure you want to halt trading for "${asset.name}"? No buys or sells will be possible until resumed.`}
				confirmLabel="Halt Trading"
				confirmClassName="bg-red-600 hover:bg-red-700"
				onConfirm={() => {
					onHalt();
					setConfirmAction(null);
				}}
				onCancel={() => setConfirmAction(null)}
				isLoading={isHalting}
			/>
			<ConfirmDialog
				isOpen={confirmAction === "resume"}
				title="Resume Trading"
				message={`Are you sure you want to resume trading for "${asset.name}"?`}
				confirmLabel="Resume"
				confirmClassName="bg-green-600 hover:bg-green-700"
				onConfirm={() => {
					onResume();
					setConfirmAction(null);
				}}
				onCancel={() => setConfirmAction(null)}
				isLoading={isResuming}
			/>
			<EditAssetDialog
				isOpen={editOpen}
				asset={asset}
				onSubmit={(data) => {
					onUpdate(data);
					setEditOpen(false);
				}}
				onCancel={() => setEditOpen(false)}
				isLoading={isUpdating}
			/>
			<MintSupplyDialog
				isOpen={mintOpen}
				currentSupply={asset.totalSupply}
				assetSymbol={asset.symbol}
				onSubmit={(data) => {
					onMint(data);
					setMintOpen(false);
				}}
				onCancel={() => setMintOpen(false)}
				isLoading={isMinting}
			/>
		</div>
	);
};
