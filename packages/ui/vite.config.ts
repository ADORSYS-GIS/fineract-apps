import { resolve } from "path";
import { defineConfig, mergeConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { baseViteConfig } from "../config/vite.config.base";

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
