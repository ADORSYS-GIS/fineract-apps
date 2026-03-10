/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_FINERACT_API_URL: string;
	readonly VITE_FINERACT_USERNAME: string;
	readonly VITE_FINERACT_PASSWORD: string;
	readonly VITE_FINERACT_TENANT_ID: string;
	readonly BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
