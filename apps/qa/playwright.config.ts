import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [["list"], ["html", { open: "never" }]],
  projects: [
    {
      name: "api",
      testMatch: /.*\.api\.spec\.ts/,
      use: { baseURL: "http://localhost:8080" },
    },
    {
      name: "e2e",
      testMatch: /.*\.e2e\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5173" },
    },
  ],
});
