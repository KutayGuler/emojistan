import adapter from "@sveltejs/adapter-vercel";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true,
    preserve: ["ld+json"],
  }),

  kit: {
    adapter: adapter(),
    alias: {
      $api: "src/api",
      $rbx: "src/ruleboxes",
      $src: "src",
    },
    serviceWorker: {
      register: false,
    },
  },

  vitePlugin: {
    inspector: {
      toggleKeyCombo: "control-alt",
      showToggleButton: "active",
      toggleButtonPos: "bottom-right",
    },
  },
};

export default config;
