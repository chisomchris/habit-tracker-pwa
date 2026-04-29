// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    // This pattern looks in BOTH root /tests and /src/tests
    include: ["**/{tests,test}/**/*.{test,spec}.{ts,tsx}"],
  },
});
