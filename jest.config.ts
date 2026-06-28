import type { Config } from 'jest';

const config: Config = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleDirectories: ['node_modules'],
	transform: {
		'^.+\\.(t|j)sx?$': [
			'@swc/jest',
			{
				jsc: {
					transform: {
						react: {
							runtime: 'automatic',
						},
					},
				},
			},
		],
	},
	collectCoverage: true,
	collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
	coveragePathIgnorePatterns: [
		'<rootDir>/src/app/layout.tsx',
		'<rootDir>/src/node_modules/',
	],
	coverageThreshold: {
		global: {
			branches: 65,
			functions: 75,
			lines: 80,
			statements: 80,
		},
	},
	testMatch: ['**/__tests__/**/*.ts?(x)'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
};

export default config;
