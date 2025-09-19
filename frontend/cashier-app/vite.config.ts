import path from "node:path";
import { fileURLToPath } from "node:url";
import { baseViteConfig } from "@fineract-apps/config/vite.config.base";
import { defineConfig, mergeConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default mergeConfig(
	baseViteConfig,
	defineConfig({
		resolve: {
			alias: [
				{
					find: /^@\/(.*)$/,
					replacement: path.resolve(__dirname, "../../packages/ui/src/$1"),
				},
			],
		},
	}),
);
