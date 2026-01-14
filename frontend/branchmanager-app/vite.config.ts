import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { baseViteConfig } from "@fineract-apps/config/vite.config.base";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig, mergeConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const packageJson = JSON.parse(
	readFileSync(path.resolve(__dirname, "package.json"), "utf-8"),
);
const appVersion = packageJson.version;

// https://vitejs.dev/config/
export default mergeConfig(
	baseViteConfig,
	defineConfig({
		publicDir: "../../public",
		base: "/branchmanager/",
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
		},
		define: {
			"import.meta.env.VITE_APP_VERSION": JSON.stringify(appVersion),
		},
	}),
);
