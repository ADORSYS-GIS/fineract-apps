export default {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["@testing-library/jest-dom"],
	moduleNameMapper: {},
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	testMatch: ["<rootDir>/packages/**/?(*.)+(spec|test).[jt]s?(x)"],
};
