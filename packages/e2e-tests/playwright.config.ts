import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const assetManagerTestDir = defineBddConfig({
	paths: ["tests/asset-manager-app/features/*.feature"],
	require: ["tests/shared/steps/*.steps.ts"],
	outputDir: ".features-gen/asset-manager-app",
});

const accountManagerTestDir = defineBddConfig({
	paths: ["tests/account-manager-app/features/*.feature"],
	require: ["tests/shared/steps/*.steps.ts"],
	outputDir: ".features-gen/account-manager-app",
});

export default defineConfig({
	reporter: [
		["list"],
		["html", { open: "never" }],
		["json", { outputFile: "test-results.json" }],
	],
	webServer: [
		{
			command: "pnpm --filter asset-manager-app dev",
			url: "http://localhost:5173/asset-manager/",
			reuseExistingServer: !process.env.CI,
		},
		{
			command: "pnpm --filter account-manager-app dev",
			url: "http://localhost:3000/",
			reuseExistingServer: !process.env.CI,
		},
	],
	projects: [
		{
			name: "asset-manager-app",
			testDir: assetManagerTestDir,
			use: {
				baseURL: "http://localhost:5173/asset-manager/",
				trace: "on",
				screenshot: "on",
			},
		},
		{
			name: "account-manager-app",
			testDir: accountManagerTestDir,
			use: {
				baseURL: "http://localhost:3000/",
				trace: "on",
				screenshot: "on",
			},
		},
	],
});
