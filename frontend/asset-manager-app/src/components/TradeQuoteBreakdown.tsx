import { Card } from "@fineract-apps/ui";
import { Info } from "lucide-react";
import { FC, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TradeQuoteBreakdownProps {
	quote: {
		side: "BUY" | "SELL";
		units: number;
		executionPrice: number;
		accruedInterestAmount?: number;
		fee: number;
		netAmount: number;
		priceBreakdown?: {
			cleanPricePerUnit: number;
			accruedInterestPerUnit: number;
			dirtyPricePerUnit: number;
			dayCountConvention?: string;
			daysSinceLastCoupon?: number;
		};
		bondBenefit?: {
			bondType: "COUPON" | "DISCOUNT";
			annualizedYieldPercent?: number;
			daysToMaturity?: number;
		};
	};
	assetSymbol: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (n: number) =>
	new Intl.NumberFormat("fr-FR").format(Math.round(n));

const pct = (n: number) => `${n.toFixed(2)}%`;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Small tooltip that reveals an explanation on hover / focus. */
const InfoTooltip: FC<{ text: string }> = ({ text }) => {
	const [visible, setVisible] = useState(false);

	return (
		<span className="relative inline-flex items-center ml-1">
			<button
				type="button"
				aria-label="Plus d'informations"
				className="text-gray-400 hover:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				onFocus={() => setVisible(true)}
				onBlur={() => setVisible(false)}
			>
				<Info className="h-3.5 w-3.5" />
			</button>
			{visible && (
				<span className="absolute left-5 top-0 z-50 w-64 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
					{text}
				</span>
			)}
		</span>
	);
};

/** A single breakdown row. */
const Row: FC<{
	label: React.ReactNode;
	value: string;
	sub?: string;
	sign?: "+" | "-" | "";
	muted?: boolean;
	bold?: boolean;
}> = ({ label, value, sub, sign = "", muted = false, bold = false }) => (
	<div
		className={`flex justify-between items-baseline py-1 ${bold ? "border-t border-gray-200 mt-1 pt-2" : ""}`}
	>
		<span
			className={`text-sm ${muted ? "text-gray-400" : bold ? "font-semibold text-gray-900" : "text-gray-600"}`}
		>
			{label}
		</span>
		<span
			className={`text-sm font-mono ${muted ? "text-gray-400" : bold ? "font-bold text-gray-900" : "text-gray-700"}`}
		>
			{sign}
			{value} XAF
			{sub && <span className="ml-1 text-xs text-gray-400">{sub}</span>}
		</span>
	</div>
);

/** Divider line. */
const Divider: FC = () => (
	<div className="border-t border-dashed border-gray-200 my-2" />
);

// ---------------------------------------------------------------------------
// Full breakdown — coupon bond (OTA)
// ---------------------------------------------------------------------------

const CouponBuyBreakdown: FC<{
	quote: TradeQuoteBreakdownProps["quote"];
}> = ({ quote }) => {
	const pb = quote.priceBreakdown!;
	const bb = quote.bondBenefit;
	const cleanTotal = pb.cleanPricePerUnit * quote.units;
	const accrued = quote.accruedInterestAmount ?? 0;

	const daysSub =
		pb.daysSinceLastCoupon != null ? `(${pb.daysSinceLastCoupon}j)` : "";
	const feeRatePct =
		cleanTotal > 0 ? pct((quote.fee / cleanTotal) * 100) : "";

	return (
		<>
			<Row
				label={`Prix propre (ask)`}
				value={`${fmt(pb.cleanPricePerUnit)}/unité`}
				muted
			/>
			<Row
				label={`× ${quote.units} unité${quote.units > 1 ? "s" : ""}`}
				value={fmt(cleanTotal)}
			/>
			<Row
				label={
					<span className="inline-flex items-center">
						Coupon couru
						<InfoTooltip text="Intérêt accumulé depuis le dernier coupon, payé au vendeur. Vous recevrez le coupon complet à la prochaine date de paiement." />
					</span>
				}
				value={fmt(accrued)}
				sub={daysSub}
				sign="+"
			/>
			<Row label="Frais plateforme" value={fmt(quote.fee)} sub={`(${feeRatePct})`} sign="+" />
			<Divider />
			<Row label="TOTAL À PAYER" value={fmt(quote.netAmount)} bold />
			{bb?.annualizedYieldPercent != null && (
				<div className="mt-2 text-xs text-blue-600 font-medium">
					Rendement annualisé : {pct(bb.annualizedYieldPercent)}
				</div>
			)}
		</>
	);
};

// ---------------------------------------------------------------------------
// Full breakdown — discount bond (BTA)
// ---------------------------------------------------------------------------

const DiscountSellBreakdown: FC<{
	quote: TradeQuoteBreakdownProps["quote"];
}> = ({ quote }) => {
	const pb = quote.priceBreakdown!;
	const bb = quote.bondBenefit;
	const marketTotal = pb.dirtyPricePerUnit * quote.units;
	const accrued = quote.accruedInterestAmount ?? 0;
	const feeRatePct =
		marketTotal > 0 ? pct((quote.fee / marketTotal) * 100) : "";

	return (
		<>
			<Row
				label="Prix marché (escompte)"
				value={`${fmt(pb.dirtyPricePerUnit)}/unité`}
				muted
			/>
			<Row
				label={`× ${quote.units} unité${quote.units > 1 ? "s" : ""}`}
				value={fmt(marketTotal)}
			/>
			<Row
				label="Coupon couru"
				value={fmt(accrued)}
			/>
			<Row
				label="Frais plateforme"
				value={fmt(quote.fee)}
				sub={`(${feeRatePct})`}
				sign="-"
			/>
			<Divider />
			<Row label="NET REÇU" value={fmt(quote.netAmount)} bold />
			<div className="mt-2 text-xs text-gray-400">
				BTA : prix calculé selon l&apos;escompte — aucun coupon couru.
				{pb.dayCountConvention && (
					<>
						{" "}
						Convention : {pb.dayCountConvention}
						{bb?.daysToMaturity != null && (
							<> | Jours restants : {bb.daysToMaturity}</>
						)}
					</>
				)}
			</div>
		</>
	);
};

// ---------------------------------------------------------------------------
// Fallback — no priceBreakdown from API yet
// ---------------------------------------------------------------------------

const FallbackBreakdown: FC<{
	quote: TradeQuoteBreakdownProps["quote"];
}> = ({ quote }) => {
	const accrued = quote.accruedInterestAmount ?? 0;
	const isBuy = quote.side === "BUY";

	return (
		<>
			<Row
				label={`Prix d'exécution`}
				value={`${fmt(quote.executionPrice)}/unité`}
				muted
			/>
			<Row
				label={`× ${quote.units} unité${quote.units > 1 ? "s" : ""}`}
				value={fmt(quote.executionPrice * quote.units)}
			/>
			{accrued > 0 && (
				<Row
					label={
						<span className="inline-flex items-center">
							Coupon couru
							<InfoTooltip text="Intérêt accumulé depuis le dernier coupon, payé au vendeur. Vous recevrez le coupon complet à la prochaine date de paiement." />
						</span>
					}
					value={fmt(accrued)}
					sign="+"
				/>
			)}
			<Row
				label="Frais plateforme"
				value={fmt(quote.fee)}
				sign={isBuy ? "+" : "-"}
			/>
			<Divider />
			<Row
				label={isBuy ? "TOTAL À PAYER" : "NET REÇU"}
				value={fmt(quote.netAmount)}
				bold
			/>
		</>
	);
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const TradeQuoteBreakdown: FC<TradeQuoteBreakdownProps> = ({
	quote,
	assetSymbol,
}) => {
	const isBuy = quote.side === "BUY";
	const bondType = quote.bondBenefit?.bondType;
	const hasPriceBreakdown = Boolean(quote.priceBreakdown);

	const headerLabel = `${isBuy ? "BUY" : "SELL"} QUOTE — ${assetSymbol}`;

	const renderContent = () => {
		if (!hasPriceBreakdown) {
			return <FallbackBreakdown quote={quote} />;
		}
		if (bondType === "COUPON") {
			return <CouponBuyBreakdown quote={quote} />;
		}
		if (bondType === "DISCOUNT") {
			return <DiscountSellBreakdown quote={quote} />;
		}
		// Generic bond or non-bond with breakdown data
		return <FallbackBreakdown quote={quote} />;
	};

	return (
		<Card className="p-4">
			{/* Header badge */}
			<div className="flex items-center gap-2 mb-3">
				<span
					className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide ${
						isBuy
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{quote.side}
				</span>
				<span className="text-sm font-semibold text-gray-700">
					{headerLabel}
				</span>
			</div>

			{/* Breakdown rows */}
			<div className="space-y-0.5">{renderContent()}</div>
		</Card>
	);
};
