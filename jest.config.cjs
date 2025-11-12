module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
  transform: {
    "^.+\\.[tj]sx?$": ["babel-jest", { configFile: "./babel.config.cjs" }],
  },
  collectCoverageFrom: ["src/services/**/*.js", "src/supabase/**/*.js"],
  testMatch: ["**/tests/unit/**/*.test.js"],
};

