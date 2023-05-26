import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/index3.js";
import { E as EditableMap, C as Controllable, a as Evolve, D as Devolve, I as Interactable, b as Effector } from "../../../../../chunks/store.js";
import { G as Game } from "../../../../../chunks/Game.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const gameProps = {
    map: new EditableMap(/* @__PURE__ */ new Map([["0_5", "woman-walking"], ["0_6", "dog"], ["0_11", "bone"]])),
    controllables: /* @__PURE__ */ new Map([
      [
        "0",
        new Controllable("woman-walking", 1, [["any", 0]], new Evolve("", 0), new Devolve(""))
      ]
    ]),
    interactables: /* @__PURE__ */ new Map([
      [
        "1",
        new Interactable("dog", "-1", 1, [["any", "talk", "none"], ["2", 1, "none"]], new Evolve("service-dog", 2), new Devolve(""), ["-9", 0])
      ],
      [
        "3",
        new Interactable("service-dog", "-1", 1, [["any", "talk", "none"]], new Evolve("", 0), new Devolve(""), ["-9", 0])
      ]
    ]),
    effectors: /* @__PURE__ */ new Map([["2", new Effector("bone", 1, "equippable")]]),
    dt: /* @__PURE__ */ new Map([["1", ["bark!"]], ["3", ["woof."]]]),
    mapClass: "simulation",
    SIZE: 4
  };
  return `${$$result.head += `<!-- HEAD_svelte-ii63rx_START -->${$$result.title = `<title>Emojistan | Tutorial - Controls</title>`, ""}<!-- HEAD_svelte-ii63rx_END -->`, ""}

<div class="relative flex h-full flex-grow flex-row items-center justify-center gap-4"><div class="flex w-full flex-col gap-12"><h1 class="absolute left-0 top-0 text-6xl">Controls</h1>
		<div class="flex flex-col items-center justify-center"><p>Movement</p>
			<div class="flex w-full justify-center"><kbd class="kbd md:kbd-sm">▲</kbd></div>
			<div class="flex w-full justify-center"><kbd class="kbd md:kbd-sm">◀︎</kbd>
				<kbd class="kbd md:kbd-sm">▼</kbd>
				<kbd class="kbd md:kbd-sm">▶︎</kbd></div></div>
		<div class="flex flex-col items-center justify-center"><p>Change Direction</p>
			<div class="flex w-full justify-center"><kbd class="kbd md:kbd-sm">W</kbd></div>
			<div class="flex w-full justify-center"><kbd class="kbd md:kbd-sm">A</kbd>
				<kbd class="kbd md:kbd-sm">S</kbd>
				<kbd class="kbd md:kbd-sm">D</kbd></div></div>
		
		<div class="flex flex-col items-center justify-center"><p>Interact</p>
			<kbd class="kbd px-12 md:kbd-sm">Space</kbd></div>
		<div class="flex flex-col items-center justify-center"><p>Drop Item</p>
			<kbd class="kbd md:kbd-sm">Ctrl</kbd></div>
		<div class="flex flex-col items-center justify-center"><p>Change Item</p>
			<div class="flex w-full justify-center gap-2"><kbd class="kbd md:kbd-sm">1</kbd>
				<kbd class="kbd md:kbd-sm">2</kbd>
				<kbd class="kbd md:kbd-sm">3</kbd>
				<kbd class="kbd md:kbd-sm">4</kbd></div></div>
		<div class="flex flex-col items-center justify-center"><p>Apply On Self</p>
			<div class="flex w-full justify-center"><kbd class="kbd md:kbd-sm">F</kbd></div></div></div>
	<div class="relative flex w-full flex-col items-center justify-center">${validate_component(Game, "Game").$$render($$result, Object.assign({}, gameProps), {}, {})}</div></div>`;
});
export {
  Page as default
};
