import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";

import { readFileSync } from "fs";
import { fileURLToPath } from "url";

// https://kit.svelte.dev/faq#read-package-json
const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const pkg = JSON.parse(json);
console.log(pkg);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true,
  }),

  kit: {
    adapter: adapter(),
    vite: {
      define: {
        __version__: JSON.stringify(pkg.version),
      },
    },
  },
};

export default config;
