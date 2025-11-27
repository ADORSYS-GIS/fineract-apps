import path from "node:path";
import { fileURLToPath } from "node:url";
import { baseViteConfig } from "@fineract-apps/config/vite.config.base";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig, mergeConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default mergeConfig(
	baseViteConfig,
	defineConfig({
		plugins: [
			tanstackRouter({
				target: "react",
				autoCodeSplitting: true,
			}),
		],
		server: {
			proxy: {
				"/fineract-provider": {
					target: "https://localhost",
					secure: false,
					changeOrigin: true,
				},
				"/api/user-sync": {
					target: "http://localhost:5000",
					secure: false,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api\/user-sync/, ""),
				},
			},
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	}),
);
