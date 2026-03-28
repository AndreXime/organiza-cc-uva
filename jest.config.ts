import type { Config } from "jest";

export default {
	clearMocks: true,
	restoreMocks: true,
	testEnvironment: "jsdom",
	roots: ["<rootDir>/src"],
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
	transform: {
		"^.+\\.(t|j)sx?$": "@swc/jest",
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
} satisfies Config;
