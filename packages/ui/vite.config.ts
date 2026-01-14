import { fileURLToPath } from "node:url";
import { baseViteConfig } from "@fineract-apps/config/vite.config.base";
import { resolve } from "path";
import { defineConfig, mergeConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default mergeConfig(
	baseViteConfig,
	defineConfig({
		plugins: [libInjectCss()],
		build: {
			lib: {
				entry: resolve(__dirname, "src/index.ts"),
				name: "@fineract-apps/ui",
				fileName: "index",
				formats: ["es"],
			},
			rollupOptions: {
				external: [
					"react",
					"react-dom",
					"formik",
					"react-i18next",
					"@tanstack/react-query",
					"react-hot-toast",
				],
				output: {
					globals: {
						react: "React",
						"react-dom": "ReactDOM",
						formik: "Formik",
						"react-i18next": "ReactI18next",
						"@tanstack/react-query": "ReactQuery",
						"react-hot-toast": "ReactHotToast",
					},
				},
			},
		},
	}),
);
