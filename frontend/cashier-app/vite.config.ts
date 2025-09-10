import { defineConfig, mergeConfig } from "vite";
import { baseViteConfig } from "../../packages/config/vite.config.base";

// https://vitejs.dev/config/
export default mergeConfig(
	baseViteConfig,
	defineConfig({
		// App-specific config goes here
	}),
);
