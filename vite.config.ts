import { existsSync } from "node:fs";
import { Agent } from "node:https";
import { defineConfig, type ProxyOptions } from "vite";

const localAssets: ProxyOptions = {
  agent: new Agent({ family: 4 }),
  changeOrigin: true,
  bypass(request) {
    if (existsSync(new URL(`./public${request.url?.split("?")[0]}`, import.meta.url))) {
      return request.url;
    }
  },
};

export default defineConfig({
  base: "./",
  esbuild: { jsx: "automatic" },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    proxy: {
      "^/videos/report-video\\.mp4(?:\\?|$)": {
        ...localAssets,
        target: "https://lambdahumanoid.github.io",
      },
      "^/(motion|figures|videos)/": {
        ...localAssets,
        target: "https://raw.githubusercontent.com",
        rewrite: path => `/LambdaHumanoid/LambdaHumanoid.github.io/main/public${path}`,
      },
    },
  },
  preview: { host: "0.0.0.0", port: 5173, strictPort: true },
});
