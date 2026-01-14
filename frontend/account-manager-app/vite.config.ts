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
		base: "/account/",
		publicDir: "../../public",
		plugins: [
			tanstackRouter({
				target: "react",
				autoCodeSplitting: true,
			}),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
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
	}),
);
