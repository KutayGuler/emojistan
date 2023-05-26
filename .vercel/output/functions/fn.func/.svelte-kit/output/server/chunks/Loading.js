import { c as create_ssr_component, b as escape, v as validate_component } from "./index3.js";
import { B as Background } from "./Background.js";
const Loading_svelte_svelte_type_style_lang = "";
const css = {
  code: "@keyframes svelte-22uof3-idle{100%{transform:translateY(-20px)}}#loading.svelte-22uof3{animation:svelte-22uof3-idle 300ms ease-out infinite alternate}",
  map: null
};
const Loading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const phrases = [
    "Getting emojis ready...",
    "Feeding chickens banana...",
    "Talking to a baguette...",
    "Playing ping pong on the sea...",
    "Eating a radioactive cookie...",
    "Playing puzzle on ATM...",
    "Boxing with a broccoli...",
    "Celebrating a goose birthday...",
    "Playing violin as a squirrel...",
    "Roaming the desert as a Stegosaurus...",
    "Playing saxaphone on Saturn...",
    "Fencing with a train..."
  ];
  let phraseIndex = Math.floor(Math.random() * phrases.length);
  setInterval(
    () => {
      phraseIndex = Math.floor(Math.random() * phrases.length);
    },
    3e3
  );
  $$result.css.add(css);
  return `<main class="absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-white p-4 text-2xl"><div class="absolute"><span>${escape(phrases[phraseIndex])}</span>
		<span class="px-2 svelte-22uof3" id="loading"><i class="twa twa-alien-monster"></i></span></div>
	${validate_component(Background, "Background").$$render($$result, {}, {}, {})}
</main>`;
});
export {
  Loading as L
};
