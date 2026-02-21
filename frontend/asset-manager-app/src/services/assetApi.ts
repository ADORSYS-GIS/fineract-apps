import axios, { type AxiosError } from "axios";

const assetClient = axios.create({
	baseURL: import.meta.env.VITE_ASSET_SERVICE_URL || "http://localhost:8083",
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
		const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
		const data = axiosErr.response?.data;
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
	currentPrice: number;
	change24hPercent: number;
	availableSupply: number;
	totalSupply: number;
	subscriptionStartDate: string;
	subscriptionEndDate: string;
	capitalOpenedPercent?: number;
	// Bond fields (null for non-bond assets)
	issuer?: string;
	isinCode?: string;
	maturityDate?: string;
	interestRate?: number;
	residualDays?: number;
	subscriptionClosed?: boolean;
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
	currentPrice: number;
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
	spreadPercent?: number;
	decimalPlaces: number;
	subscriptionStartDate: string;
	subscriptionEndDate: string;
	capitalOpenedPercent?: number;
	treasuryClientId: number;
	treasuryAssetAccountId?: number;
	treasuryCashAccountId?: number;
	fineractProductId?: number;
	treasuryClientName?: string;
	fineractProductName?: string;
	createdAt: string;
	updatedAt?: string;
	// Exposure limits
	maxPositionPercent?: number;
	maxOrderSize?: number;
	dailyTradeLimitXaf?: number;
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
	issuer?: string;
	isinCode?: string;
	maturityDate?: string;
	interestRate?: number;
	couponFrequencyMonths?: number;
	nextCouponDate?: string;
	residualDays?: number;
	subscriptionClosed?: boolean;
}

export interface CreateAssetRequest {
	name: string;
	symbol: string;
	currencyCode: string;
	description?: string;
	imageUrl?: string;
	category: string;
	initialPrice: number;
	tradingFeePercent?: number;
	spreadPercent?: number;
	totalSupply: number;
	decimalPlaces: number;
	subscriptionStartDate: string;
	subscriptionEndDate: string;
	capitalOpenedPercent?: number;
	treasuryClientId: number;
	// Exposure limits
	maxPositionPercent?: number;
	maxOrderSize?: number;
	dailyTradeLimitXaf?: number;
	// Lock-up
	lockupDays?: number;
	// Income distribution (non-bond)
	incomeType?: string;
	incomeRate?: number;
	distributionFrequencyMonths?: number;
	nextDistributionDate?: string;
	// Bond fields (required when category is BONDS)
	issuer?: string;
	isinCode?: string;
	maturityDate?: string;
	interestRate?: number;
	couponFrequencyMonths?: number;
	nextCouponDate?: string;
}

export interface UpdateAssetRequest {
	name?: string;
	description?: string;
	imageUrl?: string;
	category?: string;
	tradingFeePercent?: number;
	spreadPercent?: number;
	subscriptionStartDate?: string;
	subscriptionEndDate?: string;
	capitalOpenedPercent?: number;
	// Exposure limits
	maxPositionPercent?: number;
	maxOrderSize?: number;
	dailyTradeLimitXaf?: number;
	// Lock-up
	lockupDays?: number;
	// Bond-specific updatable fields
	interestRate?: number;
	maturityDate?: string;
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
	price: number;
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
	currentPrice: number;
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

/** Income distribution forecast (matches backend IncomeForecastResponse). */
export interface IncomeForecastResponse {
	assetId: string;
	symbol: string;
	incomeType: string;
	incomeRate: number;
	distributionFrequencyMonths: number;
	nextDistributionDate: string;
	totalUnitsOutstanding: number;
	currentPrice: number;
	incomePerPeriod: number;
	treasuryBalance: number;
	shortfall: number;
	periodsCoveredByBalance: number;
}

/** Result of manually triggering an income distribution (matches backend IncomeTriggerResponse). */
export interface IncomeTriggerResponse {
	assetId: string;
	symbol: string;
	incomeType: string;
	distributionDate: string;
	holdersPaid: number;
	holdersFailed: number;
	totalAmountPaid: number;
	nextDistributionDate: string;
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
	treasuryBalance: number;
	shortfall: number;
	couponsCoveredByBalance: number;
}

/** Result of manually triggering a coupon payment (matches backend CouponTriggerResponse). */
export interface CouponTriggerResponse {
	assetId: string;
	symbol: string;
	couponDate: string;
	holdersPaid: number;
	holdersFailed: number;
	totalAmountPaid: number;
	nextCouponDate: string;
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
	treasuryShortfall: boolean;
	delistingAnnounced: boolean;
}

export interface UpdateNotificationPreferencesRequest {
	tradeExecuted?: boolean;
	couponPaid?: boolean;
	redemptionCompleted?: boolean;
	assetStatusChanged?: boolean;
	orderStuck?: boolean;
	incomePaid?: boolean;
	treasuryShortfall?: boolean;
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

/** Trade preview request (matches backend TradePreviewRequest). */
export interface TradePreviewRequest {
	assetId: string;
	side: "BUY" | "SELL";
	/** Number of units to trade. Exactly one of units or amount must be provided. */
	units?: number;
	/** XAF amount to invest. System computes max units purchasable for this amount. */
	amount?: number;
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

/** Trade preview response (matches backend TradePreviewResponse). */
export interface TradePreviewResponse {
	feasible: boolean;
	blockers: string[];
	assetId: string;
	assetSymbol?: string;
	side: "BUY" | "SELL";
	units: number;
	basePrice?: number;
	executionPrice?: number;
	spreadPercent?: number;
	grossAmount?: number;
	fee?: number;
	feePercent?: number;
	spreadAmount?: number;
	netAmount?: number;
	availableBalance?: number;
	availableUnits?: number;
	availableSupply?: number;
	bondBenefit?: BondBenefitProjection;
	incomeBenefit?: IncomeBenefitProjection;
	/** Original XAF amount (only present in amount-based mode). */
	computedFromAmount?: number;
	/** Leftover XAF that cannot buy another unit (only present in amount-based mode). */
	remainder?: number;
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
	performedAt: string;
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
	// Assets - Public
	listAssets: (params?: {
		page?: number;
		size?: number;
		category?: string;
		search?: string;
	}) =>
		assetClient.get<{ content: AssetResponse[]; totalPages: number }>(
			"/api/assets",
			{ params },
		),
	getAsset: (id: string) => assetClient.get<AssetResponse>(`/api/assets/${id}`),
	discoverAssets: (params?: { page?: number; size?: number }) =>
		assetClient.get("/api/assets/discover", { params }),

	// Assets - Admin
	listAllAssets: (params?: { page?: number; size?: number }) =>
		assetClient.get<{ content: AssetResponse[]; totalPages: number }>(
			"/api/admin/assets",
			{ params },
		),
	getAssetAdmin: (id: string) =>
		assetClient.get<AssetDetailResponse>(`/api/admin/assets/${id}`),
	createAsset: (data: CreateAssetRequest) =>
		assetClient.post<AssetDetailResponse>("/api/admin/assets", data),
	updateAsset: (id: string, data: UpdateAssetRequest) =>
		assetClient.put<AssetDetailResponse>(`/api/admin/assets/${id}`, data),
	activateAsset: (id: string) =>
		assetClient.post(`/api/admin/assets/${id}/activate`),
	haltAsset: (id: string) => assetClient.post(`/api/admin/assets/${id}/halt`),
	resumeAsset: (id: string) =>
		assetClient.post(`/api/admin/assets/${id}/resume`),
	setPrice: (id: string, data: SetPriceRequest) =>
		assetClient.post(`/api/admin/assets/${id}/set-price`, data),
	mintSupply: (id: string, data: { additionalSupply: number }) =>
		assetClient.post(`/api/admin/assets/${id}/mint`, data),
	getInventory: (params?: { page?: number; size?: number }) =>
		assetClient.get<{ content: InventoryItem[]; totalPages: number }>(
			"/api/admin/assets/inventory",
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
		}>(`/api/admin/assets/${assetId}/coupons`, { params }),
	getCouponForecast: (assetId: string) =>
		assetClient.get<CouponForecastResponse>(
			`/api/admin/assets/${assetId}/coupon-forecast`,
		),
	triggerCouponPayment: (assetId: string) =>
		assetClient.post<CouponTriggerResponse>(
			`/api/admin/assets/${assetId}/coupons/trigger`,
		),
	redeemBond: (assetId: string) =>
		assetClient.post<RedemptionTriggerResponse>(
			`/api/admin/assets/${assetId}/redeem`,
		),
	getRedemptionHistory: (
		assetId: string,
		params?: { page?: number; size?: number },
	) =>
		assetClient.get<{
			content: RedemptionHistoryResponse[];
			totalPages: number;
			totalElements: number;
		}>(`/api/admin/assets/${assetId}/redemptions`, { params }),

	// Income distributions (non-bond)
	getIncomeHistory: (
		assetId: string,
		params?: { page?: number; size?: number },
	) =>
		assetClient.get<{
			content: IncomeDistributionResponse[];
			totalPages: number;
			totalElements: number;
		}>(`/api/admin/assets/${assetId}/income-distributions`, { params }),
	getIncomeForecast: (assetId: string) =>
		assetClient.get<IncomeForecastResponse>(
			`/api/admin/assets/${assetId}/income-forecast`,
		),
	triggerIncomeDistribution: (assetId: string) =>
		assetClient.post<IncomeTriggerResponse>(
			`/api/admin/assets/${assetId}/income-distributions/trigger`,
		),

	// Orders - Admin
	getAdminOrders: (params?: { page?: number; size?: number }) =>
		assetClient.get<{
			content: AdminOrder[];
			totalPages: number;
			totalElements: number;
		}>("/api/admin/orders", { params }),
	getOrderSummary: () =>
		assetClient.get<OrderSummary>("/api/admin/orders/summary"),
	resolveOrder: (id: string, data: ResolveOrderRequest) =>
		assetClient.post<AdminOrder>(`/api/admin/orders/${id}/resolve`, data),

	// Prices
	getPrice: (assetId: string) => assetClient.get(`/api/prices/${assetId}`),
	getPriceHistory: (assetId: string, period: string) =>
		assetClient.get<{ points: PriceHistoryPoint[] }>(
			`/api/prices/${assetId}/history`,
			{
				params: { period },
			},
		),

	// Market
	getMarketStatus: () =>
		assetClient.get<MarketStatusResponse>("/api/market/status"),

	// Delisting - Admin
	delistAsset: (id: string, data: DelistAssetRequest) =>
		assetClient.post(`/api/admin/assets/${id}/delist`, data),
	cancelDelisting: (id: string) =>
		assetClient.post(`/api/admin/assets/${id}/cancel-delist`),

	// Notifications
	getNotifications: (params?: { page?: number; size?: number }) =>
		assetClient.get<{
			content: NotificationResponse[];
			totalPages: number;
			totalElements: number;
		}>("/api/notifications", { params }),
	getUnreadCount: () =>
		assetClient.get<{ count: number }>("/api/notifications/unread-count"),
	markNotificationRead: (id: number) =>
		assetClient.post(`/api/notifications/${id}/read`),
	markAllNotificationsRead: () =>
		assetClient.post("/api/notifications/read-all"),
	getNotificationPreferences: () =>
		assetClient.get<NotificationPreferencesResponse>(
			"/api/notifications/preferences",
		),
	updateNotificationPreferences: (data: UpdateNotificationPreferencesRequest) =>
		assetClient.put("/api/notifications/preferences", data),

	// Portfolio - Income Calendar
	getIncomeCalendar: (months = 12) =>
		assetClient.get<IncomeCalendarResponse>("/api/portfolio/income-calendar", {
			params: { months },
		}),

	// Dashboard - Admin
	getDashboardSummary: () =>
		assetClient.get<AdminDashboardResponse>("/api/admin/dashboard/summary"),

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
		}>("/api/admin/audit-log", { params }),

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
		}>("/api/admin/reconciliation/reports", { params }),
	getReconciliationSummary: () =>
		assetClient.get<{ openReports: number }>(
			"/api/admin/reconciliation/summary",
		),
	triggerReconciliation: () =>
		assetClient.post<{ discrepancies: number }>(
			"/api/admin/reconciliation/trigger",
		),
	triggerAssetReconciliation: (assetId: string) =>
		assetClient.post<{ discrepancies: number }>(
			`/api/admin/reconciliation/trigger/${assetId}`,
		),
	acknowledgeReport: (id: number, admin?: string) =>
		assetClient.patch(
			`/api/admin/reconciliation/reports/${id}/acknowledge`,
			null,
			{ params: { admin } },
		),
	resolveReport: (id: number, admin?: string, notes?: string) =>
		assetClient.patch(`/api/admin/reconciliation/reports/${id}/resolve`, null, {
			params: { admin, notes },
		}),
};
