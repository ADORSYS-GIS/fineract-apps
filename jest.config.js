/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	roots: ["<rootDir>/frontend", "<rootDir>/packages"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: "<rootDir>/packages/config/tsconfig.base.json",
			},
		],
	},
	moduleNameMapper: {
		"^@fineract-apps/(.*)$": "<rootDir>/packages/$1/src",
		"\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
	},
	setupFilesAfterEnv: ["@testing-library/jest-dom"],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	testMatch: [
		"<rootDir>/frontend/**/?(*.)+(spec|test).[jt]s?(x)",
		"<rootDir>/packages/**/?(*.)+(spec|test).[jt]s?(x)",
	],
	collectCoverage: true,
	coverageReporters: ["lcov", "text"],
	coverageDirectory: "coverage",
	coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
};
