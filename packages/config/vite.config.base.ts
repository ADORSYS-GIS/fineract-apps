import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export const baseViteConfig = defineConfig({
	plugins: [react()],
});
