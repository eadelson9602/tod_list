module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.vue$": "@vue/vue3-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/public/$1",
    "^vue$": "vue/dist/vue.cjs.js",
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/public/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "vue", "node"],
  testTimeout: 30000,
  projects: [
    {
      displayName: "backend",
      testEnvironment: "node",
      roots: ["<rootDir>/tests/api"],
      testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
      transform: {
        "^.+\\.ts$": "ts-jest",
      },
    },
    {
      displayName: "frontend",
      testEnvironment: "jsdom",
      roots: ["<rootDir>/tests/frontend"],
      testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
      transform: {
        "^.+\\.ts$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/tests/frontend/tsconfig.json",
          },
        ],
        "^.+\\.vue$": [
          "@vue/vue3-jest",
          {
            tsConfig: {
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        ],
      },
      testEnvironmentOptions: {
        customExportConditions: ["node", "node-addons"],
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/public/$1",
        "^vue$": "vue/dist/vue.cjs.js",
      },
    },
  ],
};
