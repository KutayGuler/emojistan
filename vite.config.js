import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
  ],
  resolve: {
    alias: [{ find: "$lib", replacement: "/src/lib" }],
  },
  ssr: {
    noExternal: ["three"],
  },
};

export default config;
