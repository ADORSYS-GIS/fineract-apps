export default {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["@testing-library/jest-dom"],
	moduleNameMapper: {
		"^@repo/ui/(.*)$": "<rootDir>/packages/ui/src/$1",
	},
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	testMatch: ["<rootDir>/packages/**/?(*.)+(spec|test).[jt]s?(x)"],
	collectCoverage: true,
	coverageReporters: ["lcov", "text"],
	coverageDirectory: "coverage",
	coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
};
