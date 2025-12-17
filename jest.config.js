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
      roots: ["<rootDir>/tests/api", "<rootDir>/tests/e2e"],
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
            tsconfig: {
              compilerOptions: {
                module: "esnext",
                target: "esnext",
                esModuleInterop: true,
                skipLibCheck: true,
              },
            },
          },
        ],
        "^.+\\.vue$": "@vue/vue3-jest",
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
