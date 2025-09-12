import { baseViteConfig } from "@fineract-apps/config/vite.config.base";
import { defineConfig, mergeConfig } from "vite";

// https://vitejs.dev/config/
export default mergeConfig(
	baseViteConfig,
	defineConfig({
		// App-specific config goes here
	}),
);
