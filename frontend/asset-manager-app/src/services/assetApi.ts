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
				window.location.href = `/oauth2/sign_out?rd=${encodeURIComponent(window.location.origin + base)}`;
			} else {
				window.location.href = base;
			}
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
	expectedLaunchDate?: string;
	treasuryClientId: number;
	treasuryAssetAccountId?: number;
	treasuryCashAccountId?: number;
	fineractProductId?: number;
	createdAt: string;
	updatedAt?: string;
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
	treasuryClientId: number;
	expectedLaunchDate?: string;
}

export interface UpdateAssetRequest {
	name?: string;
	description?: string;
	imageUrl?: string;
	category?: string;
	tradingFeePercent?: number;
	spreadPercent?: number;
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
	getInventory: (params?: { page?: number; size?: number }) =>
		assetClient.get<{ content: InventoryItem[]; totalPages: number }>(
			"/api/admin/assets/inventory",
			{ params },
		),

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
};
