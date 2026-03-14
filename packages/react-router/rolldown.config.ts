import { defineConfig } from "rolldown";

export default defineConfig({
  input: "index.tsx",
  external: ["react"],
  output: {
    file: "dist/index.js",
    format: "esm"
  }
});
