import { Button, Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	Banknote,
	BarChart3,
	Pause,
	Pencil,
	Play,
	Plus,
	Power,
	Trash2,
	TrendingDown,
	TrendingUp,
	XCircle,
} from "lucide-react";
import { FC, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CouponForecastCard } from "@/components/CouponForecastCard";
import { CouponSummaryCard } from "@/components/CouponSummaryCard";
import { DelistDialog } from "@/components/DelistDialog";
import { EditAssetDialog } from "@/components/EditAssetDialog";
import { ErrorFallback } from "@/components/ErrorFallback";
import { IncomeForecastCard } from "@/components/IncomeForecastCard";
import { IncomeSummaryCard } from "@/components/IncomeSummaryCard";
import { MintSupplyDialog } from "@/components/MintSupplyDialog";
import { RedemptionHistoryTable } from "@/components/RedemptionHistoryTable";
import { StatusBadge } from "@/components/StatusBadge";
import { BOND_TYPE_LABELS } from "@/constants/bondTypes";
import { DAY_COUNT_LABELS } from "@/constants/dayCountConventions";
import { FREQUENCY_LABELS } from "@/constants/frequencies";
import {
	INCOME_TYPE_LABELS,
	INCOME_VARIABILITY,
} from "@/constants/incomeTypes";
import { useAssetDetails } from "./useAssetDetails";

type ConfirmActionType =
	| "activate"
	| "halt"
	| "resume"
	| "redeem"
	| "cancel-delist"
	| "delete"
	| null;

/* ---------- Spinner helper ---------- */
function Spinner({ className }: { className: string }) {
	return (
		<div
			className={`animate-spin rounded-full h-4 w-4 border-b-2 ${className}`}
		/>
	);
}

/* ---------- Account link helper ---------- */
function AccountLink({
	accountManagerUrl,
	path,
	id,
}: {
	accountManagerUrl: string;
	path: string;
	id: number | null | undefined;
}) {
	if (!id) return <p className="text-xs text-gray-400">ID: —</p>;
	return (
		<a
			href={`${accountManagerUrl}/${path}/${id}`}
			target="_blank"
			rel="noopener noreferrer"
			className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
		>
			ID: {id} ↗
		</a>
	);
}

/* ---------- Tax display helper ---------- */
function formatTaxField(
	enabled: boolean | undefined,
	rate: number | null | undefined,
	defaultLabel: string,
	exempt?: boolean,
): string {
	if (enabled === false) return "Disabled";
	if (exempt) return "Exempt";
	if (rate != null) return `${(rate * 100).toFixed(1)}%`;
	return defaultLabel;
}

/* ---------- Pricing/Limits item ---------- */
function LimitItem({
	label,
	value,
	suffix,
}: {
	label: string;
	value: number | null | undefined;
	suffix: string;
}) {
	if (value == null) return null;
	return (
		<div>
			<p className="text-gray-500">{label}</p>
			<p className="font-medium">
				{value.toLocaleString()} {suffix}
			</p>
		</div>
	);
}

/* ---------- Header action buttons ---------- */
function HeaderActions({
	asset,
	assetId,
	isActivating,
	isDeleting,
	isHalting,
	isResuming,
	isRedeeming,
	isDelisting,
	isCancellingDelist,
	setConfirmAction,
	setEditOpen,
	setMintOpen,
	setDelistOpen,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
	assetId: string;
	isActivating: boolean;
	isDeleting: boolean;
	isHalting: boolean;
	isResuming: boolean;
	isRedeeming: boolean;
	isDelisting: boolean;
	isCancellingDelist: boolean;
	setConfirmAction: (a: ConfirmActionType) => void;
	setEditOpen: (v: boolean) => void;
	setMintOpen: (v: boolean) => void;
	setDelistOpen: (v: boolean) => void;
}) {
	return (
		<div className="flex gap-2 flex-wrap">
			<PendingActions
				status={asset.status}
				isActivating={isActivating}
				isDeleting={isDeleting}
				setConfirmAction={setConfirmAction}
			/>
			<TradingActions
				status={asset.status}
				category={asset.category}
				isHalting={isHalting}
				isResuming={isResuming}
				isRedeeming={isRedeeming}
				isDelisting={isDelisting}
				isCancellingDelist={isCancellingDelist}
				setConfirmAction={setConfirmAction}
				setDelistOpen={setDelistOpen}
			/>
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
	);
}

function PendingActions({
	status,
	isActivating,
	isDeleting,
	setConfirmAction,
}: {
	status: string;
	isActivating: boolean;
	isDeleting: boolean;
	setConfirmAction: (a: ConfirmActionType) => void;
}) {
	if (status !== "PENDING") return null;
	return (
		<>
			<Button
				onClick={() => setConfirmAction("activate")}
				disabled={isActivating}
				className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
			>
				{isActivating ? (
					<Spinner className="border-white" />
				) : (
					<Power className="h-4 w-4" />
				)}
				{isActivating ? "Activating..." : "Activate"}
			</Button>
			<Button
				onClick={() => setConfirmAction("delete")}
				disabled={isDeleting}
				variant="outline"
				className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
			>
				<Trash2 className="h-4 w-4" />
				{isDeleting ? "Deleting..." : "Delete"}
			</Button>
		</>
	);
}

function TradingActions({
	status,
	category,
	isHalting,
	isResuming,
	isRedeeming,
	isDelisting,
	isCancellingDelist,
	setConfirmAction,
	setDelistOpen,
}: {
	status: string;
	category: string;
	isHalting: boolean;
	isResuming: boolean;
	isRedeeming: boolean;
	isDelisting: boolean;
	isCancellingDelist: boolean;
	setConfirmAction: (a: ConfirmActionType) => void;
	setDelistOpen: (v: boolean) => void;
}) {
	return (
		<>
			{status === "ACTIVE" && (
				<Button
					onClick={() => setConfirmAction("halt")}
					disabled={isHalting}
					variant="outline"
					className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
				>
					{isHalting ? (
						<Spinner className="border-red-600" />
					) : (
						<Pause className="h-4 w-4" />
					)}
					{isHalting ? "Halting..." : "Halt Trading"}
				</Button>
			)}
			{status === "HALTED" && (
				<Button
					onClick={() => setConfirmAction("resume")}
					disabled={isResuming}
					className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
				>
					{isResuming ? (
						<Spinner className="border-white" />
					) : (
						<Play className="h-4 w-4" />
					)}
					{isResuming ? "Resuming..." : "Resume Trading"}
				</Button>
			)}
			{status === "MATURED" && category === "BONDS" && (
				<Button
					onClick={() => setConfirmAction("redeem")}
					disabled={isRedeeming}
					className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
				>
					{isRedeeming ? (
						<Spinner className="border-white" />
					) : (
						<Banknote className="h-4 w-4" />
					)}
					{isRedeeming ? "Redeeming..." : "Redeem Bond"}
				</Button>
			)}
			{(status === "ACTIVE" || status === "HALTED") && (
				<Button
					onClick={() => setDelistOpen(true)}
					disabled={isDelisting}
					variant="outline"
					className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
				>
					<Trash2 className="h-4 w-4" />
					{isDelisting ? "Delisting..." : "Delist Asset"}
				</Button>
			)}
			{status === "DELISTING" && (
				<Button
					onClick={() => setConfirmAction("cancel-delist")}
					disabled={isCancellingDelist}
					variant="outline"
					className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
				>
					<XCircle className="h-4 w-4" />
					{isCancellingDelist ? "Cancelling..." : "Cancel Delisting"}
				</Button>
			)}
		</>
	);
}

/* ---------- Delisting banner ---------- */
function DelistingBanner({
	asset,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
}) {
	if (asset.status !== "DELISTING") return null;
	const priceText = asset.delistingRedemptionPrice
		? ` at ${asset.delistingRedemptionPrice.toLocaleString()} XAF per unit`
		: " at the last traded price";
	return (
		<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
			<AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
			<div>
				<p className="text-sm font-medium text-orange-800">
					This asset is being delisted
					{asset.delistingDate ? ` on ${asset.delistingDate}` : ""}.
				</p>
				<p className="text-sm text-orange-700 mt-1">
					Only SELL orders are accepted. On the delisting date, remaining
					holders will be force-bought out{priceText}.
				</p>
			</div>
		</div>
	);
}

/* ---------- Stats cards ---------- */
function StatsCards({
	asset,
	price,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
	price: ReturnType<typeof useAssetDetails>["price"];
}) {
	const changePercent = price?.change24hPercent ?? 0;
	const isPositive = changePercent >= 0;
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			<Card className="p-4">
				<p className="text-sm text-gray-500">Ask Price</p>
				<p className="text-2xl font-bold text-gray-900">
					{price?.askPrice?.toLocaleString() ??
						asset.askPrice?.toLocaleString() ??
						"—"}{" "}
					XAF
				</p>
				<div className="flex items-center mt-1">
					{isPositive ? (
						<TrendingUp className="h-4 w-4 text-green-500 mr-1" />
					) : (
						<TrendingDown className="h-4 w-4 text-red-500 mr-1" />
					)}
					<span
						className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
					>
						{changePercent.toFixed(2)}%
					</span>
				</div>
			</Card>
			<Card className="p-4">
				<p className="text-sm text-gray-500">Bid Price</p>
				<p className="text-2xl font-bold text-gray-900">
					{(price?.bidPrice ?? asset.bidPrice)?.toLocaleString() ?? "—"} XAF
				</p>
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
	);
}

/* ---------- Bond info card ---------- */
function BondInfoCard({
	asset,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
}) {
	if (asset.category !== "BONDS") return null;
	return (
		<Card className="p-4 mb-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">
				Bond Information
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
				<div>
					<p className="text-gray-500">Bond Type</p>
					<p className="font-medium">
						{asset.bondType
							? (BOND_TYPE_LABELS[asset.bondType] ?? asset.bondType)
							: "—"}
					</p>
				</div>
				<div>
					<p className="text-gray-500">Issuer</p>
					<p className="font-medium">{asset.issuerName ?? "—"}</p>
				</div>
				<div>
					<p className="text-gray-500">ISIN</p>
					<p className="font-medium font-mono">{asset.isinCode ?? "—"}</p>
				</div>
				<div>
					<p className="text-gray-500">Maturity Date</p>
					<p className="font-medium">{asset.maturityDate ?? "—"}</p>
				</div>
				{asset.faceValue != null && (
					<div>
						<p className="text-gray-500">Face Value</p>
						<p className="font-medium">
							{asset.faceValue.toLocaleString()} XAF
						</p>
						<p className="text-xs text-gray-400">
							{asset.bondType === "DISCOUNT"
								? "Par value redeemed at maturity — BTA purchase price is discounted below this"
								: "Nominal value per unit used for coupon calculation"}
						</p>
					</div>
				)}
				<div>
					<p className="text-gray-500">Coupon Amount</p>
					<p className="font-medium">
						{asset.couponAmountPerUnit != null
							? `${asset.couponAmountPerUnit.toLocaleString()} XAF/unit`
							: "—"}
					</p>
					{asset.interestRate != null &&
						asset.couponFrequencyMonths != null && (
							<p className="text-xs text-gray-400">
								= faceValue &times; {asset.interestRate}% &times;{" "}
								{asset.couponFrequencyMonths}/12
							</p>
						)}
					{asset.bondType === "DISCOUNT" && (
						<p className="text-xs text-gray-400">
							BTA — no periodic coupons; gain realised at redemption
						</p>
					)}
				</div>
				<div>
					<p className="text-gray-500">Current Yield</p>
					<p className="font-medium">
						{asset.currentYield != null
							? `${asset.currentYield.toFixed(2)}%`
							: "—"}
					</p>
					{asset.currentYield != null && asset.bondType === "DISCOUNT" && (
						<p className="text-xs text-gray-400">
							= ((faceValue / askPrice) &minus; 1) &times; (360 /
							daysToMaturity) &times; 100
						</p>
					)}
					{asset.currentYield != null &&
						asset.bondType === "COUPON" &&
						asset.interestRate != null && (
							<p className="text-xs text-gray-400">
								= faceValue &times; {asset.interestRate}% / askPrice
							</p>
						)}
				</div>
				<div>
					<p className="text-gray-500">Coupon Frequency</p>
					<p className="font-medium">
						{asset.couponFrequencyMonths
							? (FREQUENCY_LABELS[asset.couponFrequencyMonths] ?? "—")
							: "—"}
					</p>
					{asset.couponFrequencyMonths && (
						<p className="text-xs text-gray-400">
							Coupon paid every {asset.couponFrequencyMonths} month
							{asset.couponFrequencyMonths > 1 ? "s" : ""}
						</p>
					)}
				</div>
				<div>
					<p className="text-gray-500">Day Count Convention</p>
					<p className="font-medium">
						{asset.dayCountConvention
							? (DAY_COUNT_LABELS[asset.dayCountConvention] ??
								asset.dayCountConvention)
							: "—"}
					</p>
					<p className="text-xs text-gray-400">
						{asset.dayCountConvention === "ACT_360"
							? "Actual days / 360 — BTA standard (CEMAC T-Bills)"
							: asset.dayCountConvention === "ACT_365"
								? "Actual days / 365 — OTA standard (fixed-coupon bonds)"
								: asset.dayCountConvention === "THIRTY_360"
									? "30/360 — assumes 30-day months, 360-day year"
									: ""}
					</p>
				</div>
				{asset.bondType === "COUPON" && asset.interestRate != null && (
					<div>
						<p className="text-gray-500">Annual Coupon Rate</p>
						<p className="font-medium">{asset.interestRate}%</p>
						<p className="text-xs text-gray-400">
							Annualised rate used to compute periodic coupon payments
						</p>
					</div>
				)}
				<div>
					<p className="text-gray-500">Next Coupon</p>
					<p className="font-medium">{asset.nextCouponDate ?? "—"}</p>
					{asset.nextCouponDate && (
						<p className="text-xs text-gray-400">
							Date of next scheduled coupon payment; auto-advances after each
							confirmation
						</p>
					)}
				</div>
				<div>
					<p className="text-gray-500">Residual Days</p>
					<p className="font-medium">
						{asset.residualDays != null ? `${asset.residualDays} days` : "—"}
					</p>
					<p className="text-xs text-gray-400">
						= maturityDate &minus; today (calendar days to redemption)
					</p>
				</div>
				<div>
					<p className="text-gray-500">IRCM Status</p>
					{asset.isGovernmentBond ? (
						<p className="font-medium text-green-700">
							Exempté (obligation d'État)
						</p>
					) : asset.ircmExempt === true ? (
						<p className="font-medium text-green-700">Exempté (manuel)</p>
					) : !asset.ircmEnabled ? (
						<p className="font-medium text-gray-500">Disabled</p>
					) : asset.isBvmacListed ? (
						<p className="font-medium flex items-center gap-1">
							<AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
							Assujetti — 11% (BVMAC listed)
						</p>
					) : (
						<p className="font-medium flex items-center gap-1">
							<AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
							Assujetti
							{asset.ircmRateOverride != null
								? ` — ${(asset.ircmRateOverride * 100).toFixed(1)}%`
								: " — auto rate (16.5% dividends / 5.5% bonds ≥5yr)"}
						</p>
					)}
					<p className="text-xs text-gray-400">
						Withholding tax deducted at source on income distributions
					</p>
				</div>
				<div>
					<p className="text-gray-500">Bond Classification</p>
					<p className="font-medium text-xs">
						{asset.isGovernmentBond && (
							<span className="inline-block mr-2 px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
								Government bond
							</span>
						)}
						{asset.isBvmacListed && (
							<span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
								BVMAC listed
							</span>
						)}
						{!asset.isGovernmentBond && !asset.isBvmacListed && (
							<span className="text-gray-500">Standard</span>
						)}
					</p>
					<p className="text-xs text-gray-400">
						Determines automatic IRCM rate applied
					</p>
				</div>
			</div>
		</Card>
	);
}

/* ---------- Current market data card ---------- */
function CurrentMarketDataCard({
	asset,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
}) {
	if (asset.category !== "BONDS") return null;

	const md = (asset as AssetDetailResponseWithMarketData).currentMarketData;

	return (
		<Card className="p-4 mb-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">
				Current Market Data
			</h2>
			{md ? (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
					{md.cleanPrice != null && (
						<div>
							<p className="text-gray-500">Clean Price</p>
							<p className="font-medium">
								{md.cleanPrice.toLocaleString()} XAF
							</p>
							<p className="text-xs text-gray-400">
								= LP ask price — quoted market price excluding accrued coupon
							</p>
						</div>
					)}
					{md.accruedInterest != null && (
						<div>
							<p className="text-gray-500">Accrued Coupon</p>
							<p className="font-medium">
								{md.accruedInterest.toLocaleString()} XAF
							</p>
							{asset.bondType === "COUPON" ? (
								<p className="text-xs text-gray-400">
									= faceValue &times; rate% &times; daysSinceLastCoupon /{" "}
									{asset.dayCountConvention === "ACT_360" ? "360" : "365"}
								</p>
							) : (
								<p className="text-xs text-gray-400">
									= 0 — BTA gain accretes via price, not coupon
								</p>
							)}
						</div>
					)}
					{md.dirtyPrice != null && (
						<div>
							<p className="text-gray-500">Dirty Price</p>
							<p className="font-medium">
								{md.dirtyPrice.toLocaleString()} XAF
							</p>
							<p className="text-xs text-gray-400">
								= cleanPrice + accruedCoupon — total amount paid by buyer
							</p>
						</div>
					)}
				</div>
			) : (
				<p className="text-sm text-gray-400">
					Market pricing data not available.
				</p>
			)}
		</Card>
	);
}

/** Extended asset type to accommodate the optional currentMarketData field
 *  until AssetDetailResponse in assetApi.ts is updated. */
interface CurrentMarketData {
	cleanPrice?: number | null;
	accruedInterest?: number | null;
	dirtyPrice?: number | null;
}
interface AssetDetailResponseWithMarketData
	extends NonNullable<ReturnType<typeof useAssetDetails>["asset"]> {
	currentMarketData?: CurrentMarketData | null;
}

/* ---------- Pricing & Limits card ---------- */
function PricingLimitsCard({
	asset,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
}) {
	return (
		<Card className="p-4 mb-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">
				Pricing & Limits
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
				{asset.issuerPrice != null && (
					<div>
						<p className="text-gray-500">Issuer Price</p>
						<p className="font-medium">
							{asset.issuerPrice.toLocaleString()} XAF
						</p>
					</div>
				)}
				{asset.tradingFeePercent != null && (
					<div>
						<p className="text-gray-500">Trading Fee</p>
						<p className="font-medium">
							{(asset.tradingFeePercent * 100).toFixed(2)}%
						</p>
						<p className="text-xs text-gray-400">
							Added to buyer's cost, deducted from seller's proceeds
						</p>
					</div>
				)}
				{asset.lpMarginPerUnit != null && (
					<div>
						<p className="text-gray-500">LP Spread</p>
						<p className="font-medium">
							{asset.lpMarginPerUnit.toLocaleString()} XAF
							{asset.lpMarginPercent != null &&
								` (${asset.lpMarginPercent.toFixed(2)}%)`}
						</p>
						<p className="text-xs text-gray-400">
							= askPrice &minus; bidPrice — LP margin per unit
						</p>
					</div>
				)}
				{asset.maxPositionPercent != null && (
					<div>
						<p className="text-gray-500">Max Position</p>
						<p className="font-medium">{asset.maxPositionPercent}% of supply</p>
					</div>
				)}
				<LimitItem
					label="Max Order Size"
					value={asset.maxOrderSize}
					suffix="units"
				/>
				<LimitItem
					label="Daily Trade Limit"
					value={asset.dailyTradeLimitXaf}
					suffix="XAF"
				/>
				<LimitItem
					label="Min Order Size"
					value={asset.minOrderSize}
					suffix="units"
				/>
				<LimitItem
					label="Min Order Amount"
					value={asset.minOrderCashAmount}
					suffix="XAF"
				/>
				{asset.lockupDays != null && (
					<div>
						<p className="text-gray-500">Lock-up Period</p>
						<p className="font-medium">{asset.lockupDays} days</p>
					</div>
				)}
			</div>
		</Card>
	);
}

/* ---------- Income distribution card ---------- */
function IncomeDistributionCard({
	asset,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
}) {
	if (asset.category === "BONDS") return null;
	return (
		<Card className="p-4 mb-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">
				Income Distribution
			</h2>
			{asset.incomeType ? (
				<IncomeDistributionDetails asset={asset} />
			) : (
				<p className="text-sm text-gray-400">
					Not configured. Use the Edit button to set income type, rate, and
					frequency.
				</p>
			)}
		</Card>
	);
}

function IncomeDistributionDetails({
	asset,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
}) {
	const variability = asset.incomeType
		? INCOME_VARIABILITY[asset.incomeType]
		: undefined;
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
			<div>
				<p className="text-gray-500">Income Type</p>
				<p className="font-medium">
					{INCOME_TYPE_LABELS[asset.incomeType!] ?? asset.incomeType}
					{variability && (
						<span
							className={`ml-2 inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
								variability.variable
									? "bg-amber-100 text-amber-700"
									: "bg-green-100 text-green-700"
							}`}
						>
							{variability.label}
						</span>
					)}
				</p>
			</div>
			{asset.incomeRate != null && (
				<div>
					<p className="text-gray-500">Income Rate</p>
					<p className="font-medium">{asset.incomeRate}%</p>
				</div>
			)}
			{asset.distributionFrequencyMonths != null && (
				<div>
					<p className="text-gray-500">Frequency</p>
					<p className="font-medium">
						{FREQUENCY_LABELS[asset.distributionFrequencyMonths] ??
							`Every ${asset.distributionFrequencyMonths} months`}
					</p>
				</div>
			)}
			{asset.nextDistributionDate && (
				<div>
					<p className="text-gray-500">Next Distribution</p>
					<p className="font-medium">{asset.nextDistributionDate}</p>
				</div>
			)}
		</div>
	);
}

/* ---------- Tax config card ---------- */
function TaxConfigCard({
	asset,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
}) {
	const a = asset as NonNullable<
		ReturnType<typeof useAssetDetails>["asset"]
	> & {
		isBvmacListed?: boolean;
		isGovernmentBond?: boolean;
		tvaEnabled?: boolean;
		tvaRate?: number;
	};
	return (
		<Card className="p-4 mb-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">
				Tax Configuration
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
				{asset.category === "BONDS" && (
					<>
						<div>
							<p className="text-gray-500">BVMAC Listed</p>
							<p className="font-medium">
								{a.isBvmacListed ? (
									<span className="text-blue-700">Yes</span>
								) : (
									"No"
								)}
							</p>
							<p className="text-xs text-gray-400">
								BVMAC-listed bonds use 11% IRCM rate
							</p>
						</div>
						<div>
							<p className="text-gray-500">Government Bond</p>
							<p className="font-medium">
								{a.isGovernmentBond ? (
									<span className="text-green-700">Yes</span>
								) : (
									"No"
								)}
							</p>
							<p className="text-xs text-gray-400">
								Government bonds are IRCM-exempt by default
							</p>
						</div>
					</>
				)}
				<div>
					<p className="text-gray-500">Registration Duty</p>
					<p className="font-medium">
						{formatTaxField(
							asset.registrationDutyEnabled,
							asset.registrationDutyRate,
							"Enabled (default 2%)",
						)}
					</p>
					<p className="text-xs text-gray-400">
						Applied to gross transaction value on every buy/sell
					</p>
				</div>
				<div>
					<p className="text-gray-500">IRCM Withholding</p>
					<p className="font-medium">
						{formatTaxField(
							asset.ircmEnabled,
							asset.ircmRateOverride,
							"Enabled (auto rate)",
							asset.ircmExempt,
						)}
					</p>
					<p className="text-xs text-gray-400">
						Deducted at source from coupon/dividend payments
					</p>
				</div>
				<div>
					<p className="text-gray-500">Capital Gains Tax</p>
					<p className="font-medium">
						{formatTaxField(
							asset.capitalGainsTaxEnabled,
							asset.capitalGainsRate,
							"Enabled (default 16.5%)",
						)}
					</p>
					<p className="text-xs text-gray-400">
						= 16.5% on gains above 500,000 XAF annual exemption
					</p>
				</div>
				{a.tvaEnabled && (
					<div>
						<p className="text-gray-500">TVA (VAT)</p>
						<p className="font-medium">
							{formatTaxField(
								a.tvaEnabled,
								a.tvaRate,
								"Enabled (default 19.25%)",
							)}
						</p>
						<p className="text-xs text-gray-400">
							Applied to the trading fee amount only
						</p>
					</div>
				)}
			</div>
		</Card>
	);
}

/* ---------- Integration card ---------- */
function IntegrationCard({
	asset,
	accountManagerUrl,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
	accountManagerUrl: string;
}) {
	return (
		<Card className="p-4">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">Integration</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
				<div>
					<p className="text-gray-500 text-xs">Savings Product</p>
					<p className="font-medium">{asset.fineractProductName ?? "—"}</p>
					<p className="text-xs text-gray-400">
						ID: {asset.fineractProductId ?? "—"}
					</p>
				</div>
				<div>
					<p className="text-gray-500 text-xs">Liquidity Partner</p>
					<p className="font-medium">{asset.lpClientName ?? "—"}</p>
					<AccountLink
						accountManagerUrl={accountManagerUrl}
						path="client-details"
						id={asset.lpClientId}
					/>
				</div>
				<div>
					<p className="text-gray-500 text-xs">LP Asset Account</p>
					<p className="font-medium">Token Holdings</p>
					<AccountLink
						accountManagerUrl={accountManagerUrl}
						path="savings-account-details"
						id={asset.lpAssetAccountId}
					/>
				</div>
				<div>
					<p className="text-gray-500 text-xs">LP Cash Account</p>
					<p className="font-medium">Cash ({asset.currencyCode})</p>
					<AccountLink
						accountManagerUrl={accountManagerUrl}
						path="savings-account-details"
						id={asset.lpCashAccountId}
					/>
				</div>
				{asset.lpSpreadAccountId && (
					<div>
						<p className="text-gray-500 text-xs">LP Spread Account</p>
						<p className="font-medium">Spread Revenue</p>
						<AccountLink
							accountManagerUrl={accountManagerUrl}
							path="savings-account-details"
							id={asset.lpSpreadAccountId}
						/>
					</div>
				)}
			</div>
		</Card>
	);
}

/* ---------- Category-specific sections ---------- */
function CategorySections({
	asset,
	assetId,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
	assetId: string;
}) {
	if (asset.category === "BONDS") {
		return (
			<>
				<CouponForecastCard assetId={assetId} />
				<CouponSummaryCard assetId={assetId} />
				{(asset.status === "MATURED" || asset.status === "REDEEMED") && (
					<RedemptionHistoryTable assetId={assetId} />
				)}
			</>
		);
	}
	if (asset.incomeType) {
		return (
			<>
				<IncomeForecastCard assetId={assetId} />
				<IncomeSummaryCard assetId={assetId} />
			</>
		);
	}
	return null;
}

/* ---------- Confirmation dialogs ---------- */
function AssetConfirmDialogs({
	asset,
	confirmAction,
	setConfirmAction,
	onActivate,
	onHalt,
	onResume,
	onRedeem,
	onCancelDelist,
	onDelete,
	isActivating,
	isHalting,
	isResuming,
	isRedeeming,
	isCancellingDelist,
	isDeleting,
}: {
	asset: NonNullable<ReturnType<typeof useAssetDetails>["asset"]>;
	confirmAction: ConfirmActionType;
	setConfirmAction: (a: ConfirmActionType) => void;
	onActivate: () => void;
	onHalt: () => void;
	onResume: () => void;
	onRedeem: () => void;
	onCancelDelist: () => void;
	onDelete: () => void;
	isActivating: boolean;
	isHalting: boolean;
	isResuming: boolean;
	isRedeeming: boolean;
	isCancellingDelist: boolean;
	isDeleting: boolean;
}) {
	const dialogs: Array<{
		action: NonNullable<ConfirmActionType>;
		title: string;
		message: string;
		confirmLabel: string;
		confirmClassName: string;
		onConfirm: () => void;
		isLoading: boolean;
	}> = [
		{
			action: "activate",
			title: "Activate Asset",
			message: `Are you sure you want to activate "${asset.name}"? This will open it for trading.`,
			confirmLabel: "Activate",
			confirmClassName: "bg-green-600 hover:bg-green-700",
			onConfirm: onActivate,
			isLoading: isActivating,
		},
		{
			action: "halt",
			title: "Halt Trading",
			message: `Are you sure you want to halt trading for "${asset.name}"? No buys or sells will be possible until resumed.`,
			confirmLabel: "Halt Trading",
			confirmClassName: "bg-red-600 hover:bg-red-700",
			onConfirm: onHalt,
			isLoading: isHalting,
		},
		{
			action: "resume",
			title: "Resume Trading",
			message: `Are you sure you want to resume trading for "${asset.name}"?`,
			confirmLabel: "Resume",
			confirmClassName: "bg-green-600 hover:bg-green-700",
			onConfirm: onResume,
			isLoading: isResuming,
		},
		{
			action: "redeem",
			title: "Redeem Bond Principal",
			message: `This will pay the face value to all holders of "${asset.name}" and return their asset units to the LP account. No fees will be charged. This action cannot be undone.`,
			confirmLabel: "Redeem Bond",
			confirmClassName: "bg-purple-600 hover:bg-purple-700",
			onConfirm: onRedeem,
			isLoading: isRedeeming,
		},
		{
			action: "cancel-delist",
			title: "Cancel Delisting",
			message: `Are you sure you want to cancel the delisting of "${asset.name}"? The asset will return to ACTIVE status and BUY orders will be allowed again.`,
			confirmLabel: "Cancel Delisting",
			confirmClassName: "bg-green-600 hover:bg-green-700",
			onConfirm: onCancelDelist,
			isLoading: isCancellingDelist,
		},
		{
			action: "delete",
			title: "Delete Asset",
			message: `Are you sure you want to permanently delete "${asset.name}"? This will also remove the associated resources (accounts, product, currency). This action cannot be undone.`,
			confirmLabel: "Delete Asset",
			confirmClassName: "bg-red-600 hover:bg-red-700",
			onConfirm: onDelete,
			isLoading: isDeleting,
		},
	];

	return (
		<>
			{dialogs.map((d) => (
				<ConfirmDialog
					key={d.action}
					isOpen={confirmAction === d.action}
					title={d.title}
					message={d.message}
					confirmLabel={d.confirmLabel}
					confirmClassName={d.confirmClassName}
					onConfirm={() => {
						d.onConfirm();
						setConfirmAction(null);
					}}
					onCancel={() => setConfirmAction(null)}
					isLoading={d.isLoading}
				/>
			))}
		</>
	);
}

/* ========== Main view component ========== */

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
	onRedeem,
	onDelist,
	onCancelDelist,
	onDelete,
	isUpdating,
	isActivating,
	isHalting,
	isResuming,
	isMinting,
	isRedeeming,
	isDelisting,
	isCancellingDelist,
	isDeleting,
}) => {
	const [confirmAction, setConfirmAction] = useState<ConfirmActionType>(null);
	const [editOpen, setEditOpen] = useState(false);
	const [mintOpen, setMintOpen] = useState(false);
	const [delistOpen, setDelistOpen] = useState(false);
	const accountManagerUrl =
		import.meta.env.VITE_ACCOUNT_MANAGER_URL || "/account";

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
						{asset.lpClientName && (
							<p className="text-xs text-gray-400 mt-0.5">
								LP: {asset.lpClientName}
								{asset.issuerName ? ` | Issuer: ${asset.issuerName}` : ""}
							</p>
						)}
					</div>
					<HeaderActions
						asset={asset}
						assetId={assetId}
						isActivating={isActivating}
						isDeleting={isDeleting}
						isHalting={isHalting}
						isResuming={isResuming}
						isRedeeming={isRedeeming}
						isDelisting={isDelisting}
						isCancellingDelist={isCancellingDelist}
						setConfirmAction={setConfirmAction}
						setEditOpen={setEditOpen}
						setMintOpen={setMintOpen}
						setDelistOpen={setDelistOpen}
					/>
				</div>

				<DelistingBanner asset={asset} />
				<StatsCards asset={asset} price={price} />

				{/* Image + Description Banner */}
				{(asset.imageUrl || asset.description) && (
					<Card className="p-4 mb-6">
						<div className="flex items-start gap-4">
							{asset.imageUrl && (
								<img
									src={asset.imageUrl}
									alt={asset.name}
									className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
								/>
							)}
							{asset.description && (
								<div>
									<p className="text-sm text-gray-500 mb-1">Description</p>
									<p className="text-sm text-gray-700">{asset.description}</p>
								</div>
							)}
						</div>
					</Card>
				)}

				<BondInfoCard asset={asset} />
				<CurrentMarketDataCard asset={asset} />

				<PricingLimitsCard asset={asset} />
				<IncomeDistributionCard asset={asset} />
				<TaxConfigCard asset={asset} />
				<CategorySections asset={asset} assetId={assetId} />

				{/* Asset Overview */}
				<Card className="p-4 mb-6">
					<h2 className="text-lg font-semibold text-gray-800 mb-3">
						Asset Overview
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
					</div>
				</Card>

				<IntegrationCard asset={asset} accountManagerUrl={accountManagerUrl} />
			</main>

			<AssetConfirmDialogs
				asset={asset}
				confirmAction={confirmAction}
				setConfirmAction={setConfirmAction}
				onActivate={onActivate}
				onHalt={onHalt}
				onResume={onResume}
				onRedeem={onRedeem}
				onCancelDelist={onCancelDelist}
				onDelete={onDelete}
				isActivating={isActivating}
				isHalting={isHalting}
				isResuming={isResuming}
				isRedeeming={isRedeeming}
				isCancellingDelist={isCancellingDelist}
				isDeleting={isDeleting}
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
			<DelistDialog
				isOpen={delistOpen}
				assetName={asset.name}
				askPrice={asset.askPrice ?? 0}
				onSubmit={(data) => {
					onDelist(data);
					setDelistOpen(false);
				}}
				onCancel={() => setDelistOpen(false)}
				isLoading={isDelisting}
			/>
		</div>
	);
};
