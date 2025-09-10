/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	roots: ["<rootDir>/frontend", "<rootDir>/packages"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	moduleNameMapper: {
		"^@fineract-apps/(.*)$": "<rootDir>/packages/$1/src",
	},
	setupFilesAfterEnv: ["@testing-library/jest-dom"],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
