import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.ts",
    }),
  ],
  resolve: {
    alias: [{ find: "$lib", replacement: "/src/lib" }],
  },
  ssr: {
    noExternal: ["three"],
  },
};

export default config;
