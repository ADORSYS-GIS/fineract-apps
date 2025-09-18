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
		resolve: {
			alias: {
				"@": resolve(__dirname, "src"),
			},
		},
		build: {
			lib: {
				entry: resolve(__dirname, "src/index.ts"),
				name: "@fineract-apps/ui",
				fileName: "index",
				formats: ["es"],
			},
			rollupOptions: {
				external: ["react", "react-dom"],
				output: {
					globals: {
						react: "React",
						"react-dom": "ReactDOM",
					},
				},
			},
		},
	}),
);
