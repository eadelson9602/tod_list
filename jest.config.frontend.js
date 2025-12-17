module.exports = {
  preset: "ts-jest",
  testEnvironment: "happy-dom",
  roots: ["<rootDir>/tests/frontend"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.vue$": "@vue/vue3-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/public/$1",
    "^vue$": "vue/dist/vue.cjs.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "vue", "node"],
  collectCoverageFrom: [
    "src/public/**/*.{ts,vue}",
    "!src/public/**/*.d.ts",
    "!src/public/main.ts",
  ],
  coverageDirectory: "coverage/frontend",
  coverageReporters: ["text", "lcov", "html"],
  testTimeout: 10000,
  globals: {
    "ts-jest": {
      tsconfig: {
        compilerOptions: {
          module: "esnext",
          target: "esnext",
          jsx: "preserve",
        },
      },
    },
  },
};
