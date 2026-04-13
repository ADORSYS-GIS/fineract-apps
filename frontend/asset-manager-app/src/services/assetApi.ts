import axios, { type AxiosError } from "axios";

const assetClient = axios.create({
	baseURL:
		(import.meta.env.VITE_ASSET_SERVICE_URL || "http://localhost:8083") +
		"/api/v1",
	timeout: 30000,
});

if (!import.meta.env.VITE_ASSET_SERVICE_URL && import.meta.env.PROD) {
	console.warn("VITE_ASSET_SERVICE_URL not set, using localhost fallback");
}

// Interceptor adds auth token from sessionStorage
assetClient.interceptors.request.use((config) => {
	try {
		const raw = sessionStorage.getItem("auth");
		if (raw) {
			const auth = JSON.parse(raw);
			if (auth.base64EncodedAuthenticationKey) {
				config.headers.Authorization = `Basic ${auth.base64EncodedAuthenticationKey}`;
			} else if (auth.token) {
				config.headers.Authorization = `Bearer ${auth.token}`;
			}
		}
	} catch {
		// Malformed auth in sessionStorage — proceed without auth
	}
	return config;
});

// Response interceptor for 401 auto-redirect and retry
assetClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		if (error.response?.status === 401) {
			sessionStorage.removeItem("auth");
			const base = import.meta.env.BASE_URL || "/asset-manager/";
			if (import.meta.env.VITE_AUTH_MODE === "oauth") {
				window.location.href = `/oauth2/authorization/keycloak?rd=${encodeURIComponent(window.location.href)}`;
			} else {
				window.location.href = base;
			}
			return Promise.reject(error);
		}

		// In OAuth mode, network errors are likely CORS-blocked auth redirects (token expired)
		if (!error.response && import.meta.env.VITE_AUTH_MODE === "oauth") {
			sessionStorage.removeItem("auth");
			window.location.href = `/oauth2/authorization/keycloak?rd=${encodeURIComponent(window.location.href)}`;
			return Promise.reject(error);
		}

		// Retry on network errors or 5xx (up to 2 retries)
		const config = error.config as AxiosError["config"] & {
			__retryCount?: number;
		};
		if (config && (!config.__retryCount || config.__retryCount < 2)) {
			const shouldRetry = !error.response || error.response.status >= 500;
			if (shouldRetry) {
				config.__retryCount = (config.__retryCount || 0) + 1;
				const delay = config.__retryCount * 1000;
				await new Promise((r) => setTimeout(r, delay));
				return assetClient(config);
			}
		}

		return Promise.reject(error);
	},
);

/** Extract a human-readable error message from any error (axios or otherwise). */
export function extractErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const axiosErr = error as AxiosError<{
			message?: string;
			error?: string;
			details?: Record<string, string>;
		}>;
		const data = axiosErr.response?.data;
		if (data?.details && Object.keys(data.details).length > 0) {
			return Object.values(data.details).join("; ");
		}
		if (data?.message) return data.message;
		if (data?.error) return data.error;
		if (axiosErr.response?.status === 403) return "Access denied";
		if (axiosErr.response?.status === 401) return "Not authenticated";
		return axiosErr.message || "Request failed";
	}
	if (error instanceof Error) return error.message;
	return "An unexpected error occurred";
}

// --- Types ---

/** Asset summary for list views (matches backend AssetResponse). */
export interface AssetResponse {
	id: string;
	name: string;
	symbol: string;
	imageUrl?: string;
	category: string;
	status: string;
	askPrice: number;
	change24hPercent: number;
	availableSupply: number;
	totalSupply: number;
	// Bond fields (null for non-bond assets)
	issuerName?: string;
	isinCode?: string;
	maturityDate?: string;
	interestRate?: number;
	currentYield?: number;
	residualDays?: number;
	lpName?: string;
	couponAmountPerUnit?: number;
}

/** Full asset detail with Fineract IDs (matches backend AssetDetailResponse). */
export interface AssetDetailResponse {
	id: string;
	name: string;
	symbol: string;
	currencyCode: string;
	description?: string;
	imageUrl?: string;
	category: string;
	status: string;
	priceMode: string;
	bidPrice?: number;
	askPrice?: number;
	change24hPercent?: number;
	dayOpen?: number;
	dayHigh?: number;
	dayLow?: number;
	dayClose?: number;
	totalSupply: number;
	circulatingSupply: number;
	availableSupply: number;
	tradingFeePercent?: number;
	decimalPlaces: number;

	lpClientId: number;
	lpAssetAccountId?: number;
	lpCashAccountId?: number;
	lpSpreadAccountId?: number;
	lpTaxAccountId?: number;
	fineractProductId?: number;
	lpClientName?: string;
	fineractProductName?: string;
	createdAt: string;
	updatedAt?: string;
	// Exposure limits
	maxPositionPercent?: number;
	maxOrderSize?: number;
	dailyTradeLimitXaf?: number;
	minOrderSize?: number;
	minOrderCashAmount?: number;
	// Lock-up
	lockupDays?: number;
	// Income distribution (non-bond)
	incomeType?: string;
	incomeRate?: number;
	distributionFrequencyMonths?: number;
	nextDistributionDate?: string;
	// Delisting
	delistingDate?: string;
	delistingRedemptionPrice?: number;
	// Bond fields (null for non-bond assets)
	bondType?: string;
	dayCountConvention?: string;
	issuerCountry?: string;
	issuerName?: string;
	issuerPrice?: number;
	faceValue?: number;
	lpMarginPerUnit?: number;
	lpMarginPercent?: number;
	couponAmountPerUnit?: number;
	isinCode?: string;
	maturityDate?: string;
	interestRate?: number;
	currentYield?: number;
	couponFrequencyMonths?: number;
	nextCouponDate?: string;
	residualDays?: number;
	// Tax configuration (Cameroon/CEMAC)
	registrationDutyEnabled?: boolean;
	registrationDutyRate?: number;
	ircmEnabled?: boolean;
	ircmRateOverride?: number;
	ircmExempt?: boolean;
	capitalGainsTaxEnabled?: boolean;
	capitalGainsRate?: number;
	isBvmacListed?: boolean;
	isGovernmentBond?: boolean;
	tvaEnabled?: boolean;
	tvaRate?: number;
}

export interface CreateAssetRequest {
	name: string;
	symbol: string;
	currencyCode: string;
	description?: string;
	imageUrl?: string;
	category: string;
	issuerPrice: number;
	faceValue?: number;
	lpBidPrice: number;
	lpAskPrice: number;
	tradingFeePercent?: number;
	totalSupply: number;
	decimalPlaces: number;

	lpClientId: number;
	// Exposure limits
	maxPositionPercent?: number;
	maxOrderSize?: number;
	dailyTradeLimitXaf?: number;
	// Lock-up
	lockupDays?: number;
	// Min order size
	minOrderSize?: number;
	minOrderCashAmount?: number;
	// Income distribution (non-bond)
	incomeType?: string;
	incomeRate?: number;
	distributionFrequencyMonths?: number;
	nextDistributionDate?: string;
	// Bond fields (required when category is BONDS)
	bondType?: string;
	dayCountConvention?: string;
	issuerCountry?: string;
	issuerName?: string;
	isinCode?: string;
	maturityDate?: string;
	issueDate?: string;
	interestRate?: number;
	couponFrequencyMonths?: number;
	nextCouponDate?: string;
	// Tax configuration (Cameroon/CEMAC)
	registrationDutyEnabled?: boolean;
	registrationDutyRate?: number;
	ircmEnabled?: boolean;
	ircmRateOverride?: number;
	ircmExempt?: boolean;
	capitalGainsTaxEnabled?: boolean;
	capitalGainsRate?: number;
	isBvmacListed?: boolean;
	isGovernmentBond?: boolean;
	tvaEnabled?: boolean;
	tvaRate?: number;
}

export interface UpdateAssetRequest {
	name?: string;
	description?: string;
	imageUrl?: string;
	category?: string;
	tradingFeePercent?: number;
	lpBidPrice?: number;
	lpAskPrice?: number;

	// Exposure limits
	maxPositionPercent?: number;
	maxOrderSize?: number;
	dailyTradeLimitXaf?: number;
	// Lock-up
	lockupDays?: number;
	// Min order size
	minOrderSize?: number;
	minOrderCashAmount?: number;
	// Income distribution
	incomeType?: string;
	incomeRate?: number;
	distributionFrequencyMonths?: number;
	nextDistributionDate?: string;
	// Bond-specific updatable fields
	interestRate?: number;
	maturityDate?: string;
	// Tax configuration (Cameroon/CEMAC)
	registrationDutyEnabled?: boolean;
	registrationDutyRate?: number;
	ircmEnabled?: boolean;
	ircmRateOverride?: number;
	ircmExempt?: boolean;
	capitalGainsTaxEnabled?: boolean;
	capitalGainsRate?: number;

	// PENDING-only fields (rejected if asset is not PENDING)
	issuerPrice?: number;
	totalSupply?: number;
	issuerName?: string;
	isinCode?: string;
	couponFrequencyMonths?: number;
	bondType?: string;
	dayCountConvention?: string;
	issuerCountry?: string;
}

/** Coupon payment audit record (matches backend CouponPaymentResponse). */
export interface CouponPaymentResponse {
	id: number;
	userId: number;
	units: number;
	faceValue: number;
	annualRate: number;
	periodMonths: number;
	cashAmount: number;
	fineractTransferId?: number;
	status: string;
	failureReason?: string;
	paidAt: string;
	couponDate: string;
}

export interface SetPriceRequest {
	askPrice: number;
	bidPrice?: number;
}

/** Inventory stats (matches backend InventoryResponse). */
export interface InventoryItem {
	assetId: string;
	name: string;
	symbol: string;
	status: string;
	totalSupply: number;
	circulatingSupply: number;
	availableSupply: number;
	askPrice: number;
	totalValueLocked: number;
}

/** Income distribution audit record (matches backend IncomeDistributionResponse). */
export interface IncomeDistributionResponse {
	id: number;
	userId: number;
	incomeType: string;
	units: number;
	rateApplied: number;
	cashAmount: number;
	fineractTransferId?: number;
	status: string;
	failureReason?: string;
	paidAt: string;
	distributionDate: string;
}

/** Compact payment history summary for asset detail page. */
export interface PaymentSummaryResponse {
	lastPaymentDate: string | null;
	lastPaymentAmountPaid: number | null;
	lastPaymentAt: string | null;
	nextScheduledDate: string | null;
	totalPaidToDate: number;
	failedPaymentCount: number;
	totalPaymentCount: number;
}

/** Unified individual payment result (coupon or income) from a scheduled payment. */
export interface PaymentResultResponse {
	id: number;
	userId: number;
	units: number;
	amount: number;
	status: string;
	failureReason?: string;
	paidAt: string;
	// Coupon-specific (null for income)
	faceValue?: number;
	annualRate?: number;
	periodMonths?: number;
	// Income-specific (null for coupon)
	incomeType?: string;
	rateApplied?: number;
}

/** Income distribution forecast (matches backend IncomeForecastResponse). */
export interface IncomeForecastResponse {
	assetId: string;
	symbol: string;
	incomeType: string;
	incomeRate: number;
	distributionFrequencyMonths: number;
	nextDistributionDate: string;
	totalUnitsOutstanding: number;
	faceValue: number;
	incomePerPeriod: number;
	lpCashBalance: number;
	shortfall: number;
	periodsCoveredByBalance: number;
}

/** Coupon obligation forecast for a bond (matches backend CouponForecastResponse). */
export interface CouponForecastResponse {
	assetId: string;
	symbol: string;
	interestRate: number;
	couponFrequencyMonths: number;
	maturityDate: string;
	nextCouponDate: string;
	totalUnitsOutstanding: number;
	faceValuePerUnit: number;
	couponPerPeriod: number;
	remainingCouponPeriods: number;
	totalRemainingCouponObligation: number;
	principalAtMaturity: number;
	totalObligation: number;
	lpCashBalance: number;
	shortfall: number;
	couponsCoveredByBalance: number;
}

/** Result of triggering bond principal redemption (matches backend RedemptionTriggerResponse). */
export interface RedemptionTriggerResponse {
	assetId: string;
	symbol: string;
	redemptionDate: string;
	totalHolders: number;
	holdersRedeemed: number;
	holdersFailed: number;
	totalPrincipalPaid: number;
	totalPrincipalFailed: number;
	bondStatus: string;
	details: {
		userId: number;
		units: number;
		cashAmount: number;
		status: string;
		failureReason?: string;
	}[];
}

/** Principal redemption audit record (matches backend RedemptionHistoryResponse). */
export interface RedemptionHistoryResponse {
	id: number;
	userId: number;
	units: number;
	faceValue: number;
	cashAmount: number;
	realizedPnl?: number;
	fineractCashTransferId?: number;
	fineractAssetTransferId?: number;
	status: string;
	failureReason?: string;
	redeemedAt: string;
	redemptionDate: string;
}

export interface MarketStatusResponse {
	isOpen: boolean;
	schedule: string;
	secondsUntilClose?: number;
	secondsUntilOpen?: number;
	timezone?: string;
}

export interface PriceHistoryPoint {
	price: number;
	capturedAt: string;
}

/**
 * Order history entry for the authenticated user (matches backend OrderResponse).
 *
 * Amount breakdown:
 *   BUY:  totalAmount = (units × pricePerUnit) + fee + registrationDutyAmount + tvaAmount + accruedInterestAmount
 *   SELL: totalAmount = (units × pricePerUnit) - fee - registrationDutyAmount - capitalGainsTaxAmount - tvaAmount + accruedInterestAmount
 *
 * Tax fields are undefined when not applicable (e.g. capitalGainsTaxAmount is always absent on BUY).
 */
export interface OrderResponse {
	/** UUID of the order. */
	orderId: string;
	/** ID of the asset that was traded. */
	assetId: string;
	/** Ticker symbol, e.g. "BRVM-TST". */
	symbol?: string;
	/** Direction of the trade. */
	side: "BUY" | "SELL";
	/** Number of units traded. Absent while order is QUOTED or PENDING. */
	units?: number;
	/** LP execution price per unit in XAF. Absent while order is QUOTED or PENDING. */
	pricePerUnit?: number;
	/**
	 * Net amount that cleared the user's account in XAF.
	 * BUY: total debited (gross + fee + taxes + accrued interest).
	 * SELL: total credited (gross - fee - taxes + accrued interest).
	 */
	totalAmount: number;
	/** Platform trading fee in XAF. Deducted on BUY; deducted from proceeds on SELL. */
	fee?: number;
	/** LP spread collected in XAF. Zero if spread is disabled for this asset. */
	spreadAmount?: number;
	/** Lifecycle status of the order (QUOTED, PENDING, EXECUTING, FILLED, FAILED, REJECTED, CANCELLED…). */
	status: string;
	/** ISO-8601 timestamp when the order was created. */
	createdAt: string;
	/** Registration duty (droit d'enregistrement) in XAF. Absent if not applicable. */
	registrationDutyAmount?: number;
	/** Capital gains tax in XAF. Only present on SELL orders where a gain was realised. */
	capitalGainsTaxAmount?: number;
	/** TVA (VAT) charged on the platform fee in XAF. Absent if not applicable. */
	tvaAmount?: number;
	/** Accrued interest (pied du coupon) for bond assets in XAF. Absent for non-bond assets. */
	accruedInterestAmount?: number;
}

/**
 * Single asset position in the user's portfolio (matches backend PositionResponse).
 *
 * Price vs. value:
 *   avgPurchasePrice and marketPrice are per-unit prices.
 *   costBasis and marketValue are total position amounts (price × totalUnits).
 *
 * Example — bought 10 units @ 1 000 XAF, then 10 more @ 1 200 XAF, market now at 1 300 XAF:
 *   avgPurchasePrice = 1 100      (weighted average per unit)
 *   costBasis        = 22 000     (1 100 × 20 — total spent)
 *   marketPrice      = 1 300      (current ask price per unit)
 *   marketValue      = 26 000     (1 300 × 20 — current worth)
 *   unrealizedPnl    = +4 000     (26 000 - 22 000 — paper profit)
 */
export interface PositionResponse {
	/** Internal asset identifier. */
	assetId: string;
	/** Ticker symbol, e.g. "BRVM-TST". */
	symbol?: string;
	/** Human-readable asset name. */
	name?: string;
	/** Units currently held. Increases on BUY, decreases on SELL. */
	totalUnits: number;
	/**
	 * Weighted average purchase price per unit in XAF.
	 * Recalculated after every BUY; unchanged on SELL.
	 * Multiply by totalUnits to get costBasis.
	 */
	avgPurchasePrice: number;
	/**
	 * Current market price per unit (LP ask price) in XAF.
	 * What a new buyer would pay today.
	 * Multiply by totalUnits to get marketValue.
	 */
	marketPrice: number;
	/**
	 * Current market value of the entire position in XAF (marketPrice × totalUnits).
	 * Recalculated at read time; not persisted.
	 */
	marketValue: number;
	/**
	 * Total amount spent to acquire current holdings in XAF (avgPurchasePrice × totalUnits).
	 * Break-even value: marketValue > costBasis means the position is in profit.
	 */
	costBasis: number;
	/**
	 * Unrealized (paper) P&L in XAF (marketValue - costBasis).
	 * Positive = paper profit; negative = paper loss.
	 * Calculated at read time; not persisted.
	 */
	unrealizedPnl: number;
	/**
	 * Unrealized P&L as a percentage of costBasis (e.g. 18.18 means +18.18%).
	 * Zero when costBasis is zero.
	 */
	unrealizedPnlPercent: number;
	/**
	 * Cumulative realized P&L from all completed SELL trades in XAF.
	 * Calculated at execution via FIFO lot matching and persisted.
	 */
	realizedPnl: number;
	/** Coupon schedule and principal redemption projections. Absent for non-bond assets. */
	bondBenefit?: BondBenefitProjection;
	/** Dividend, rent, or yield projections. Absent for bond and non-income assets. */
	incomeBenefit?: IncomeBenefitProjection;
	/**
	 * Full trade history for this position, newest first (up to 200 entries).
	 * Each entry includes the complete amount breakdown: totalAmount, fee, and all tax fields.
	 * Empty array if the user has no orders for this asset.
	 */
	orders: OrderResponse[];

	// --- Bond pricing fields (added alongside PortfolioSummaryResponse; may be null until backend ships) ---

	/** Bond type: "BTA" (treasury bill) or "OTA" (treasury bond). Null for non-bond assets. */
	bondType?: string;
	/**
	 * Clean price per unit (excluding accrued interest) in XAF.
	 * Only present for bond positions where the backend computes it.
	 */
	cleanPrice?: number;
	/**
	 * Dirty price per unit (clean price + accrued interest) in XAF.
	 * Only present for bond positions where the backend computes it.
	 */
	dirtyPrice?: number;
	/**
	 * Accrued interest (pied du coupon) per unit since last coupon date in XAF.
	 * Only present for coupon-bearing bonds (OTA); absent for BTA and non-bonds.
	 */
	accruedInterestPerUnit?: number;
	/**
	 * Dirty market value of the entire position (dirtyPrice × totalUnits) in XAF.
	 * Falls back to marketValue when dirtyPrice is absent.
	 */
	dirtyMarketValue?: number;
}

/**
 * Aggregated portfolio summary returned by GET /portfolio.
 * Contains top-level metrics and the list of individual positions.
 */
export interface PortfolioSummaryResponse {
	/** Total current market value across all positions in XAF (sum of position marketValues). */
	totalValue: number;
	/** Total cost basis across all positions in XAF (sum of position costBases). */
	totalCostBasis: number;
	/** Total unrealized P&L in XAF (totalValue - totalCostBasis). */
	unrealizedPnl: number;
	/** Total unrealized P&L as a percentage of totalCostBasis. */
	unrealizedPnlPercent: number;
	/** Weighted average estimated annual yield across all income-bearing positions (%). */
	estimatedAnnualYieldPercent?: number;
	/** Individual asset positions. */
	positions: PositionResponse[];
}

/** Admin order view (matches backend AdminOrderResponse). */
export interface AdminOrder {
	orderId: string;
	assetId: string;
	symbol: string;
	side: "BUY" | "SELL";
	units?: number;
	pricePerUnit?: number;
	totalAmount: number;
	fee?: number;
	spreadAmount?: number;
	status: string;
	failureReason?: string;
	userExternalId: string;
	userId: number;
	resolvedBy?: string;
	resolvedAt?: string;
	createdAt: string;
	updatedAt?: string;
}

/** Order status summary counts (matches backend OrderSummaryResponse). */
export interface OrderSummary {
	needsReconciliation: number;
	failed: number;
	manuallyClosed: number;
}

export interface ResolveOrderRequest {
	resolution: string;
}

/** Admin order filter parameters. */
export interface AdminOrderFilter {
	status?: string;
	assetId?: string;
	search?: string;
	fromDate?: string;
	toDate?: string;
}

/** Lightweight asset summary for filter dropdowns. */
export interface AssetOption {
	assetId: string;
	symbol: string;
	name: string;
}

/** Extended order detail (matches backend OrderDetailResponse). */
export interface OrderDetail {
	orderId: string;
	assetId: string;
	symbol: string;
	assetName: string;
	side: "BUY" | "SELL";
	units?: number;
	pricePerUnit?: number;
	totalAmount: number;
	fee?: number;
	spreadAmount?: number;
	status: string;
	failureReason?: string;
	userExternalId: string;
	userId: number;
	idempotencyKey: string;
	fineractBatchId?: string;
	version: number;
	resolvedBy?: string;
	resolvedAt?: string;
	createdAt: string;
	updatedAt?: string;
}

/** Notification response (matches backend NotificationResponse). */
export interface NotificationResponse {
	id: number;
	eventType: string;
	title: string;
	body: string;
	referenceId?: string;
	referenceType?: string;
	read: boolean;
	readAt?: string;
	createdAt: string;
}

/** Notification preferences (matches backend NotificationPreferencesResponse). */
export interface NotificationPreferencesResponse {
	tradeExecuted: boolean;
	couponPaid: boolean;
	redemptionCompleted: boolean;
	assetStatusChanged: boolean;
	orderStuck: boolean;
	incomePaid: boolean;
	lpShortfall: boolean;
	delistingAnnounced: boolean;
}

export interface UpdateNotificationPreferencesRequest {
	tradeExecuted?: boolean;
	couponPaid?: boolean;
	redemptionCompleted?: boolean;
	assetStatusChanged?: boolean;
	orderStuck?: boolean;
	incomePaid?: boolean;
	lpShortfall?: boolean;
	delistingAnnounced?: boolean;
}

/** Reconciliation report (matches backend ReconciliationReportResponse). */
export interface ReconciliationReportResponse {
	id: number;
	reportDate: string;
	reportType: string;
	assetId?: string;
	userId?: number;
	expectedValue?: number;
	actualValue?: number;
	discrepancy?: number;
	severity: string;
	status: string;
	notes?: string;
	resolvedBy?: string;
	resolvedAt?: string;
	createdAt: string;
}

export interface DelistAssetRequest {
	delistingDate: string;
	delistingRedemptionPrice?: number;
}

/** Bond benefit projections (matches backend BondBenefitProjection). */
export interface BondBenefitProjection {
	faceValue: number;
	interestRate: number;
	couponFrequencyMonths: number;
	maturityDate: string;
	nextCouponDate?: string;
	couponPerPeriod: number;
	remainingCouponPayments: number;
	totalCouponIncome: number;
	principalAtMaturity: number;
	investmentCost?: number;
	totalProjectedReturn: number;
	netProjectedProfit?: number;
	annualizedYieldPercent?: number;
	daysToMaturity: number;
}

/** Income benefit projections for non-bond assets (matches backend IncomeBenefitProjection). */
export interface IncomeBenefitProjection {
	incomeType: string;
	incomeRate: number;
	distributionFrequencyMonths: number;
	nextDistributionDate?: string;
	incomePerPeriod: number;
	estimatedAnnualIncome: number;
	estimatedYieldPercent?: number;
	variableIncome: boolean;
}

// Portfolio Income History
export interface IncomeHistoryEntry {
	id: number;
	assetId: string;
	symbol: string;
	assetName: string;
	/** COUPON | MATURITY | INCOME */
	incomeType: string;
	paymentDate: string;
	units: number;
	grossAmount: number;
	ircmWithheld?: number;
	netAmount: number;
	/** PAID | SCHEDULED */
	status: "PAID" | "SCHEDULED";
	exempt?: boolean;
}

export interface IncomeHistoryResponse {
	content: IncomeHistoryEntry[];
	totalPages: number;
	totalElements: number;
	totalPaid: number;
	totalScheduled: number;
	totalIrcmWithheld: number;
}

// Income Calendar
export interface IncomeEvent {
	assetId: string;
	symbol: string;
	assetName: string;
	incomeType: string;
	paymentDate: string;
	expectedAmount: number;
	units: number;
	rateApplied: number;
}

export interface MonthlyAggregate {
	month: string;
	totalAmount: number;
	eventCount: number;
}

export interface IncomeCalendarResponse {
	events: IncomeEvent[];
	monthlyTotals: MonthlyAggregate[];
	totalExpectedIncome: number;
	totalByIncomeType: Record<string, number>;
}

// Scheduled Payments
export interface ScheduledPaymentResponse {
	id: number;
	assetId: string;
	symbol: string;
	assetName: string;
	paymentType: string;
	scheduleDate: string;
	status: string;
	estimatedRate: number;
	estimatedAmountPerUnit: number;
	estimatedTotal: number;
	holderCount: number;
	actualAmountPerUnit?: number;
	confirmedBy?: string;
	confirmedAt?: string;
	cancelledBy?: string;
	cancelledAt?: string;
	cancelReason?: string;
	holdersPaid?: number;
	holdersFailed?: number;
	totalAmountPaid?: number;
	executedAt?: string;
	createdAt: string;
	lpCashBalance?: number;
	// IRCM withholding (optional — populated once backend deploys new API version)
	ircmExempt?: boolean | null;
	ircmRate?: number | null;
	grossAmountPerUnit?: number | null;
	ircmWithheldPerUnit?: number | null;
	netAmountPerUnit?: number | null;
	totalIrcmWithheld?: number | null;
}

export interface ScheduledPaymentDetailResponse
	extends ScheduledPaymentResponse {
	holders: {
		userId: number;
		units: number;
		estimatedPayment: number;
	}[];
}

export interface ScheduledPaymentSummary {
	pendingCount: number;
	confirmedThisMonth: number;
	totalPaidThisMonth: number;
}

export interface ConfirmPaymentRequest {
	amountPerUnit?: number;
}

export interface CancelPaymentRequest {
	reason?: string;
}

// Audit Log
export interface AuditLogResponse {
	id: number;
	action: string;
	adminSubject: string;
	targetAssetId: string | null;
	targetAssetSymbol: string | null;
	result: string;
	errorMessage: string | null;
	durationMs: number;
	requestSummary: string | null;
	clientIp: string | null;
	userAgent: string | null;
	performedAt: string;
}

/** LP performance metrics aggregated from trade log. */
export interface LPPerformanceResponse {
	totalSpreadEarned: number;
	totalBuybackPremiumPaid: number;
	totalFeeCommission: number;
	netMargin: number;
	totalTrades: number;
	perAsset: {
		assetId: string;
		symbol: string;
		spreadEarned: number;
		buybackPremiumPaid: number;
		feeCommission: number;
		netMargin: number;
		tradeCount: number;
	}[];
}

// Admin Dashboard
export interface AdminDashboardResponse {
	assets: {
		total: number;
		active: number;
		halted: number;
		pending: number;
		delisting: number;
		matured: number;
		delisted: number;
	};
	trading: {
		tradeCount24h: number;
		buyVolume24h: number;
		sellVolume24h: number;
		activeTraders24h: number;
	};
	orders: {
		needsReconciliation: number;
		failed: number;
		manuallyClosed: number;
	};
	reconciliation: {
		openReports: number;
		criticalOpen: number;
		warningOpen: number;
	};
	activeInvestors: number;
}

// --- API ---

export const assetApi = {
	// File Upload
	uploadFile: (file: File, folder = "assets/icons") => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("folder", folder);
		return assetClient.post<{ key: string; url: string }>(
			"/admin/files/upload",
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
	},

	// Assets - Public
	listAssets: (params?: {
		page?: number;
		size?: number;
		category?: string;
		search?: string;
	}) =>
		assetClient.get<{ content: AssetResponse[]; totalPages: number }>(
			"/assets",
			{ params },
		),
	getAsset: (id: string) => assetClient.get<AssetResponse>(`/assets/${id}`),
	discoverAssets: (params?: { page?: number; size?: number }) =>
		assetClient.get("/assets/discover", { params }),

	// Assets - Admin
	listAllAssets: (params?: { page?: number; size?: number }) =>
		assetClient.get<{ content: AssetResponse[]; totalPages: number }>(
			"/admin/assets",
			{ params },
		),
	getAssetAdmin: (id: string) =>
		assetClient.get<AssetDetailResponse>(`/admin/assets/${id}`),
	createAsset: (data: CreateAssetRequest) =>
		assetClient.post<AssetDetailResponse>("/admin/assets", data),
	updateAsset: (id: string, data: UpdateAssetRequest) =>
		assetClient.put<AssetDetailResponse>(`/admin/assets/${id}`, data),
	activateAsset: (id: string) =>
		assetClient.post(`/admin/assets/${id}/activate`),
	haltAsset: (id: string) => assetClient.post(`/admin/assets/${id}/halt`),
	resumeAsset: (id: string) => assetClient.post(`/admin/assets/${id}/resume`),
	setPrice: (id: string, data: SetPriceRequest) =>
		assetClient.post(`/admin/assets/${id}/set-price`, data),
	mintSupply: (id: string, data: { additionalSupply: number }) =>
		assetClient.post(`/admin/assets/${id}/mint`, data),
	getInventory: (params?: { page?: number; size?: number }) =>
		assetClient.get<{ content: InventoryItem[]; totalPages: number }>(
			"/admin/assets/inventory",
			{ params },
		),
	getCouponHistory: (
		assetId: string,
		params?: { page?: number; size?: number },
	) =>
		assetClient.get<{
			content: CouponPaymentResponse[];
			totalPages: number;
			totalElements: number;
		}>(`/admin/assets/${assetId}/coupons`, { params }),
	getCouponForecast: (assetId: string) =>
		assetClient.get<CouponForecastResponse>(
			`/admin/assets/${assetId}/coupon-forecast`,
		),
	redeemBond: (assetId: string) =>
		assetClient.post<RedemptionTriggerResponse>(
			`/admin/assets/${assetId}/redeem`,
		),
	getRedemptionHistory: (
		assetId: string,
		params?: { page?: number; size?: number },
	) =>
		assetClient.get<{
			content: RedemptionHistoryResponse[];
			totalPages: number;
			totalElements: number;
		}>(`/admin/assets/${assetId}/redemptions`, { params }),

	// Income distributions (non-bond)
	getIncomeHistory: (
		assetId: string,
		params?: { page?: number; size?: number },
	) =>
		assetClient.get<{
			content: IncomeDistributionResponse[];
			totalPages: number;
			totalElements: number;
		}>(`/admin/assets/${assetId}/income-distributions`, { params }),
	getIncomeForecast: (assetId: string) =>
		assetClient.get<IncomeForecastResponse>(
			`/admin/assets/${assetId}/income-forecast`,
		),
	// Orders - Admin
	getAdminOrders: (
		params?: { page?: number; size?: number } & AdminOrderFilter,
	) =>
		assetClient.get<{
			content: AdminOrder[];
			totalPages: number;
			totalElements: number;
		}>("/admin/orders", { params }),
	getOrderSummary: () => assetClient.get<OrderSummary>("/admin/orders/summary"),
	getOrderAssetOptions: () =>
		assetClient.get<AssetOption[]>("/admin/orders/asset-options"),
	getOrderDetail: (id: string) =>
		assetClient.get<OrderDetail>(`/admin/orders/${id}`),
	resolveOrder: (id: string, data: ResolveOrderRequest) =>
		assetClient.post<AdminOrder>(`/admin/orders/${id}/resolve`, data),

	// Admin Notifications
	getAdminNotifications: (params?: { page?: number; size?: number }) =>
		assetClient.get<{
			content: NotificationResponse[];
			totalPages: number;
			totalElements: number;
		}>("/admin/notifications", { params }),
	getAdminUnreadCount: () =>
		assetClient.get<{ unreadCount: number }>(
			"/admin/notifications/unread-count",
		),
	markAdminNotificationRead: (id: number) =>
		assetClient.post(`/admin/notifications/${id}/read`),
	markAllAdminNotificationsRead: () =>
		assetClient.post("/admin/notifications/read-all"),

	// Prices
	getPrice: (assetId: string) => assetClient.get(`/prices/${assetId}`),
	getPriceHistory: (assetId: string, period: string) =>
		assetClient.get<{ points: PriceHistoryPoint[] }>(
			`/prices/${assetId}/history`,
			{
				params: { period },
			},
		),

	// Market
	getMarketStatus: () =>
		assetClient.get<MarketStatusResponse>("/market/status"),

	// Delisting - Admin
	delistAsset: (id: string, data: DelistAssetRequest) =>
		assetClient.post(`/admin/assets/${id}/delist`, data),
	cancelDelisting: (id: string) =>
		assetClient.post(`/admin/assets/${id}/cancel-delist`),
	deleteAsset: (id: string) => assetClient.delete(`/admin/assets/${id}`),

	// Notifications
	getNotifications: (params?: { page?: number; size?: number }) =>
		assetClient.get<{
			content: NotificationResponse[];
			totalPages: number;
			totalElements: number;
		}>("/notifications", { params }),
	getUnreadCount: () =>
		assetClient.get<{ count: number }>("/notifications/unread-count"),
	markNotificationRead: (id: number) =>
		assetClient.post(`/notifications/${id}/read`),
	markAllNotificationsRead: () => assetClient.post("/notifications/read-all"),
	getNotificationPreferences: () =>
		assetClient.get<NotificationPreferencesResponse>(
			"/notifications/preferences",
		),
	updateNotificationPreferences: (data: UpdateNotificationPreferencesRequest) =>
		assetClient.put("/notifications/preferences", data),

	// Portfolio - Income Calendar
	getIncomeCalendar: (months = 12) =>
		assetClient.get<IncomeCalendarResponse>("/portfolio/income-calendar", {
			params: { months },
		}),

	// Portfolio - Income History
	getPortfolioIncomeHistory: (status = "ALL", page = 0, size = 20) =>
		assetClient.get<IncomeHistoryResponse>("/portfolio/income-history", {
			params: { status, page, size },
		}),

	// Dashboard - Admin
	getDashboardSummary: () =>
		assetClient.get<AdminDashboardResponse>("/admin/dashboard/summary"),

	// Audit Log - Admin
	getAuditLog: (params?: {
		page?: number;
		size?: number;
		admin?: string;
		assetId?: string;
		action?: string;
	}) =>
		assetClient.get<{
			content: AuditLogResponse[];
			totalPages: number;
			totalElements: number;
		}>("/admin/audit-log", { params }),

	// Scheduled Payments - Admin
	getScheduledPayments: (params?: {
		page?: number;
		size?: number;
		status?: string;
		assetId?: string;
		type?: string;
	}) =>
		assetClient.get<{
			content: ScheduledPaymentResponse[];
			totalPages: number;
			totalElements: number;
		}>("/admin/scheduled-payments", { params }),
	getScheduledPaymentSummary: () =>
		assetClient.get<ScheduledPaymentSummary>(
			"/admin/scheduled-payments/summary",
		),
	getScheduledPaymentDetail: (id: number) =>
		assetClient.get<ScheduledPaymentDetailResponse>(
			`/admin/scheduled-payments/${id}`,
		),
	confirmScheduledPayment: (id: number, data?: ConfirmPaymentRequest) =>
		assetClient.post<ScheduledPaymentResponse>(
			`/admin/scheduled-payments/${id}/confirm`,
			data || {},
		),
	cancelScheduledPayment: (id: number, data?: CancelPaymentRequest) =>
		assetClient.post<ScheduledPaymentResponse>(
			`/admin/scheduled-payments/${id}/cancel`,
			data || {},
		),
	getScheduledPaymentResults: (
		id: number,
		params?: { page?: number; size?: number },
	) =>
		assetClient.get<{
			content: PaymentResultResponse[];
			totalPages: number;
			totalElements: number;
		}>(`/admin/scheduled-payments/${id}/results`, { params }),

	// Payment summaries for asset detail
	getCouponSummary: (assetId: string) =>
		assetClient.get<PaymentSummaryResponse>(
			`/admin/assets/${assetId}/coupon-summary`,
		),
	getIncomeSummary: (assetId: string) =>
		assetClient.get<PaymentSummaryResponse>(
			`/admin/assets/${assetId}/income-summary`,
		),

	// Reconciliation - Admin
	getReconciliationReports: (params?: {
		page?: number;
		size?: number;
		status?: string;
		severity?: string;
		assetId?: string;
	}) =>
		assetClient.get<{
			content: ReconciliationReportResponse[];
			totalPages: number;
			totalElements: number;
		}>("/admin/reconciliation/reports", { params }),
	getReconciliationSummary: () =>
		assetClient.get<{ openReports: number }>("/admin/reconciliation/summary"),
	triggerReconciliation: () =>
		assetClient.post<{ discrepancies: number }>(
			"/admin/reconciliation/trigger",
		),
	triggerAssetReconciliation: (assetId: string) =>
		assetClient.post<{ discrepancies: number }>(
			`/admin/reconciliation/trigger/${assetId}`,
		),
	acknowledgeReport: (id: number, admin?: string) =>
		assetClient.patch(`/admin/reconciliation/reports/${id}/acknowledge`, null, {
			params: { admin },
		}),
	resolveReport: (id: number, admin?: string, notes?: string) =>
		assetClient.patch(`/admin/reconciliation/reports/${id}/resolve`, null, {
			params: { admin, notes },
		}),

	// User order history
	getUserOrders: (params?: {
		assetId?: string;
		page?: number;
		size?: number;
	}) =>
		assetClient.get<{
			content: OrderResponse[];
			totalPages: number;
			totalElements: number;
		}>("/trades/orders", { params }),
	getUserOrder: (orderId: string) =>
		assetClient.get<OrderResponse>(`/trades/orders/${orderId}`),

	// Portfolio positions
	getPortfolio: () => assetClient.get<PortfolioSummaryResponse>("/portfolio"),
	getPosition: (assetId: string) =>
		assetClient.get<PositionResponse>(`/portfolio/positions/${assetId}`),

	// Order Cancellation
	cancelOrder: (orderId: string) =>
		assetClient.post(`/trades/orders/${orderId}/cancel`),

	// LP Performance - Admin
	getLPPerformance: () =>
		assetClient.get<LPPerformanceResponse>("/admin/lp/performance"),

	// Accounting - Admin
	getTrialBalance: (params: {
		currencyCode?: string;
		fromDate?: string;
		toDate?: string;
	}) =>
		assetClient.get("/admin/accounting/trial-balance", {
			params: {
				...(params.currencyCode && {
					currencyCode: params.currencyCode,
				}),
				...(params.fromDate && { fromDate: params.fromDate }),
				...(params.toDate && { toDate: params.toDate }),
			},
		}),
	getAccountingCurrencies: () =>
		assetClient.get<string[]>("/admin/accounting/currencies"),

	// Settlement - Admin
	getSettlements: (status?: string[]) =>
		assetClient.get("/admin/settlement", {
			params: status?.length ? { status: status[0] } : undefined,
		}),
	getSettlementSummary: () => assetClient.get("/admin/settlement/summary"),
	createSettlement: (data: {
		settlementType: string;
		amount: number;
		lpClientId?: number;
		description?: string;
		sourceGlCode?: string;
		destinationGlCode?: string;
	}) => assetClient.post("/admin/settlement", data),
	approveSettlement: (id: string) =>
		assetClient.post(`/admin/settlement/${id}/approve`),
	executeSettlement: (id: string) =>
		assetClient.post(`/admin/settlement/${id}/execute`),
	rejectSettlement: (id: string, reason?: string) =>
		assetClient.post(`/admin/settlement/${id}/reject`, { reason }),
	exportSettlementReport: (id: string) =>
		assetClient.get(`/admin/settlement/${id}/report`, {
			responseType: "blob",
		}),
	getLpBalances: () => assetClient.get("/admin/settlement/lp-balances"),
	getTrustBalances: () =>
		assetClient.get<
			{
				name: string;
				glCode: string;
				debits: number;
				credits: number;
				balance: number;
			}[]
		>("/admin/settlement/trust-balances"),
	getRebalanceProposal: (reservePercent?: number) =>
		assetClient.get<RebalanceProposal>("/admin/settlement/rebalance-proposal", {
			params: reservePercent != null ? { reservePercent } : undefined,
		}),
	executeRebalanceProposal: (transfers: RebalanceProposal["transfers"]) =>
		assetClient.post("/admin/settlement/rebalance-proposal/execute", {
			transfers,
		}),
};

export interface RebalanceProposal {
	totalLpOwed: number;
	totalTaxOwed: number;
	totalFeesOwed: number;
	totalOutflowNeeded: number;
	ubaCurrentBalance: number;
	afrilandCurrentBalance: number;
	needInUba: number;
	needInAfriland: number;
	momoBalance: number;
	orangeBalance: number;
	momoAvailable: number;
	orangeAvailable: number;
	totalMobileAvailable: number;
	reservePercent: number;
	feasible: boolean;
	shortfall: number;
	transfers: {
		phase: number;
		settlementType: string;
		sourceGlCode: string;
		sourceName: string;
		destinationGlCode: string;
		destinationName: string;
		amount: number;
		description: string;
		adminAction: string;
	}[];
}
