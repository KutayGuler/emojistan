import { c as create_ssr_component, e as each, b as escape } from "./index3.js";
import { e as emojis } from "./emojis.js";
const Background_svelte_svelte_type_style_lang = "";
const css = {
  code: ".shape.svelte-q8fbcu{position:absolute;overflow:visible}",
  map: null
};
function random(min, max) {
  return Math.random() * (max - min) + min;
}
const Background = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let randomEmojis = [];
  for (let array of Object.values(emojis)) {
    randomEmojis.push(array[Math.round(random(0, array.length))]);
    randomEmojis.push(array[Math.round(random(0, array.length))]);
  }
  $$result.css.add(css);
  return `<div class="h-screen w-screen">${each(randomEmojis, (emoji, i) => {
    return `<i class="${escape(i % 2 == 0 ? "text-2xl" : "text-4xl", true) + " shape twa twa-" + escape(emoji, true) + " left-0 top-0 svelte-q8fbcu"}"></i>`;
  })}
</div>`;
});
export {
  Background as B
};
