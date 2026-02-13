import path from "node:path";
import { fileURLToPath } from "node:url";
import { baseViteConfig } from "@fineract-apps/config/vite.config.base";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
	...baseViteConfig,
	base: "/asset-manager/",
	publicDir: "../../public",
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		...(baseViteConfig.plugins || []),
	],
	server: {
		proxy: {
			"/fineract-provider": {
				target: "https://localhost",
				secure: false,
				changeOrigin: true,
			},
			"/api": {
				target: "http://localhost:8083",
				changeOrigin: true,
			},
		},
	},
	resolve: {
		...baseViteConfig.resolve,
		alias: {
			...baseViteConfig.resolve?.alias,
			"@": path.resolve(__dirname, "./src"),
			react: path.resolve(__dirname, "./node_modules/react"),
			"react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
			formik: path.resolve(__dirname, "./node_modules/formik"),
		},
		dedupe: [
			"react",
			"react-dom",
			"formik",
			"react-i18next",
			"@tanstack/react-query",
			"react-hot-toast",
		],
	},
});
