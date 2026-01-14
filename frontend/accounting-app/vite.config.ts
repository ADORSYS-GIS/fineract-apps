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
		publicDir: "../../public",
		base: "/accounting/",
		plugins: [
			tanstackRouter({
				target: "react",
				autoCodeSplitting: true,
				routeFileIgnorePattern: ".*(Container|View|use.*)\\.(tsx|ts)$",
			}),
		],
		resolve: {
			alias: {
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
		server: {
			port: 5006,
		},
	}),
);
