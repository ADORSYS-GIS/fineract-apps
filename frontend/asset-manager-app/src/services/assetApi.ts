import axios from "axios";

const assetClient = axios.create({
	baseURL: import.meta.env.VITE_ASSET_SERVICE_URL || "http://localhost:8083",
});

// Interceptor adds auth token from sessionStorage
assetClient.interceptors.request.use((config) => {
	const raw = sessionStorage.getItem("auth");
	if (raw) {
		const auth = JSON.parse(raw);
		if (auth.base64EncodedAuthenticationKey) {
			config.headers.Authorization = `Basic ${auth.base64EncodedAuthenticationKey}`;
		} else if (auth.token) {
			config.headers.Authorization = `Bearer ${auth.token}`;
		}
	}
	return config;
});

// --- Types ---

export interface AssetResponse {
	id: string;
	symbol: string;
	name: string;
	description?: string;
	imageUrl?: string;
	category: string;
	status: string;
	priceMode: string;
	currentPrice: number;
	change24hPercent: number;
	annualYield?: number;
	totalSupply: number;
	circulatingSupply: number;
	availableSupply: number;
	fineractProductId?: number;
	treasuryClientId: number;
	createdAt: string;
}

export interface CreateAssetRequest {
	name: string;
	symbol: string;
	currencyCode: string;
	description?: string;
	imageUrl?: string;
	category: string;
	initialPrice: number;
	annualYield?: number;
	tradingFeePercent?: number;
	spreadPercent?: number;
	totalSupply: number;
	decimalPlaces: number;
	treasuryClientId: number;
	treasuryCashAccountId: number;
	expectedLaunchDate?: string;
}

export interface UpdateAssetRequest {
	name?: string;
	description?: string;
	imageUrl?: string;
	category?: string;
	annualYield?: number;
	tradingFeePercent?: number;
	spreadPercent?: number;
}

export interface SetPriceRequest {
	price: number;
}

export interface InventoryItem {
	assetId: string;
	symbol: string;
	name: string;
	totalSupply: number;
	circulatingSupply: number;
	availableSupply: number;
	treasuryBalance: number;
}

export interface MarketStatusResponse {
	isOpen: boolean;
	schedule: string;
	secondsUntilClose?: number;
	secondsUntilOpen?: number;
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
	createAsset: (data: CreateAssetRequest) =>
		assetClient.post<AssetResponse>("/api/admin/assets", data),
	updateAsset: (id: string, data: UpdateAssetRequest) =>
		assetClient.put<AssetResponse>(`/api/admin/assets/${id}`, data),
	activateAsset: (id: string) =>
		assetClient.post(`/api/admin/assets/${id}/activate`),
	haltAsset: (id: string) => assetClient.post(`/api/admin/assets/${id}/halt`),
	resumeAsset: (id: string) =>
		assetClient.post(`/api/admin/assets/${id}/resume`),
	setPrice: (id: string, data: SetPriceRequest) =>
		assetClient.post(`/api/admin/assets/${id}/set-price`, data),
	getInventory: () =>
		assetClient.get<InventoryItem[]>("/api/admin/assets/inventory"),

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
