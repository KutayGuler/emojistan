import { c as create_ssr_component, a as subscribe, b as escape, e as each, f as add_styles, d as add_attribute, z as add_classes, q as merge_ssr_styles, v as validate_component } from "../../../../chunks/index3.js";
import "../../../../chunks/singletons.js";
import { e as emojis } from "../../../../chunks/emojis.js";
import { h as map, n as currentColor, k as currentEmoji, g as formattedEmoji, r as recentlyUsed, q as currentSkin, s as saves, t as showLoading, p as pushers, f as mergers, d as controllables, i as interactables, c as sequencers, e as effectors, j as dialogueTree } from "../../../../chunks/store.js";
import { i as DEFAULT_SIDE_LENGTH, p as palette } from "../../../../chunks/constants.js";
/* empty css                                                     */import "../../../../chunks/notifications.js";
import "../../../../chunks/Rulebox.svelte_svelte_type_style_lang.js";
import "d3-zoom";
const Editor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $map, $$unsubscribe_map;
  let $$unsubscribe_currentColor;
  let $$unsubscribe_currentEmoji;
  let $$unsubscribe_formattedEmoji;
  $$unsubscribe_map = subscribe(map, (value) => $map = value);
  $$unsubscribe_currentColor = subscribe(currentColor, (value) => value);
  $$unsubscribe_currentEmoji = subscribe(currentEmoji, (value) => value);
  $$unsubscribe_formattedEmoji = subscribe(formattedEmoji, (value) => value);
  let { sectionIndex = 0 } = $$props;
  let { copyMode } = $$props;
  let { emojiMode } = $$props;
  if ($$props.sectionIndex === void 0 && $$bindings.sectionIndex && sectionIndex !== void 0)
    $$bindings.sectionIndex(sectionIndex);
  if ($$props.copyMode === void 0 && $$bindings.copyMode && copyMode !== void 0)
    $$bindings.copyMode(copyMode);
  if ($$props.emojiMode === void 0 && $$bindings.emojiMode && emojiMode !== void 0)
    $$bindings.emojiMode(emojiMode);
  $$unsubscribe_map();
  $$unsubscribe_currentColor();
  $$unsubscribe_currentEmoji();
  $$unsubscribe_formattedEmoji();
  return `

<div class="badge absolute -top-8 right-80">Section #${escape(sectionIndex)}</div>

<div class="map">${each(
    {
      length: DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH
    },
    (_, i) => {
      let key = sectionIndex + "_" + i, mapItem = $map?.items.get(key), background = $map?.backgrounds.get(key);
      return `
		
		
		<button title="${"Cell #" + escape(i, true)}"${add_styles({
        "background": $map.colors.get(key) || $map.dbg
      })}>${mapItem ? `<i class="${"twa z-10 twa-" + escape(mapItem, true)}"></i>` : `${background ? `<i class="${"twa absolute scale-75 text-center opacity-50 twa-" + escape(background, true)}"></i>` : ``}`}
		</button>`;
    }
  )}</div>`;
});
const index_svelte_svelte_type_style_lang$1 = "";
const index_svelte_svelte_type_style_lang = "";
const RecentlyUsed = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentEmoji, $$unsubscribe_currentEmoji;
  let $recentlyUsed, $$unsubscribe_recentlyUsed;
  let $currentSkin, $$unsubscribe_currentSkin;
  $$unsubscribe_currentEmoji = subscribe(currentEmoji, (value) => $currentEmoji = value);
  $$unsubscribe_recentlyUsed = subscribe(recentlyUsed, (value) => $recentlyUsed = value);
  $$unsubscribe_currentSkin = subscribe(currentSkin, (value) => $currentSkin = value);
  $$unsubscribe_currentEmoji();
  $$unsubscribe_recentlyUsed();
  $$unsubscribe_currentSkin();
  return `<label for="recently-used" class="label"><span class="label-text text-xs text-neutral-content 2xl:text-base">Recently Used
	</span></label>
<div class="emojis flex flex-wrap-reverse justify-center">${each([...$recentlyUsed], (name) => {
    let title = name.replaceAll("-", " ");
    return `
		<button${add_attribute("title", title, 0)}${add_classes(($currentEmoji === name ? "selected" : "").trim())}><i class="${"twa twa-" + escape(name.replace("_", $currentSkin), true)}"></i>
		</button>`;
  })}</div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".hintsEnabled.svelte-18w5ayy.svelte-18w5ayy{opacity:1}.tooltip.svelte-18w5ayy.svelte-18w5ayy:before{z-index:10}.selected.svelte-18w5ayy.svelte-18w5ayy,#world-map.svelte-18w5ayy>button.svelte-18w5ayy:hover{outline:solid 2px black;z-index:2}#world-map.svelte-18w5ayy>button.svelte-18w5ayy:hover:not(.selected){scale:110%}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentEmoji, $$unsubscribe_currentEmoji;
  let $map, $$unsubscribe_map;
  let $currentColor, $$unsubscribe_currentColor;
  let $saves, $$unsubscribe_saves;
  let $$unsubscribe_showLoading;
  let $formattedEmoji, $$unsubscribe_formattedEmoji;
  let $$unsubscribe_pushers;
  let $$unsubscribe_mergers;
  let $$unsubscribe_controllables;
  let $$unsubscribe_interactables;
  let $$unsubscribe_sequencers;
  let $$unsubscribe_effectors;
  let $$unsubscribe_dialogueTree;
  let $currentSkin, $$unsubscribe_currentSkin;
  $$unsubscribe_currentEmoji = subscribe(currentEmoji, (value) => $currentEmoji = value);
  $$unsubscribe_map = subscribe(map, (value) => $map = value);
  $$unsubscribe_currentColor = subscribe(currentColor, (value) => $currentColor = value);
  $$unsubscribe_saves = subscribe(saves, (value) => $saves = value);
  $$unsubscribe_showLoading = subscribe(showLoading, (value) => value);
  $$unsubscribe_formattedEmoji = subscribe(formattedEmoji, (value) => $formattedEmoji = value);
  $$unsubscribe_pushers = subscribe(pushers, (value) => value);
  $$unsubscribe_mergers = subscribe(mergers, (value) => value);
  $$unsubscribe_controllables = subscribe(controllables, (value) => value);
  $$unsubscribe_interactables = subscribe(interactables, (value) => value);
  $$unsubscribe_sequencers = subscribe(sequencers, (value) => value);
  $$unsubscribe_effectors = subscribe(effectors, (value) => value);
  $$unsubscribe_dialogueTree = subscribe(dialogueTree, (value) => value);
  $$unsubscribe_currentSkin = subscribe(currentSkin, (value) => $currentSkin = value);
  let currentCategory = "pile-of-poo";
  let filter = "";
  let sectionIndex = 0;
  const copyModes = ["Emoji", "Color", "Both"];
  const deleteTexts = {
    Emoji: "EMOJIS",
    Color: "COLORS",
    Both: "ALL"
  };
  let copyMode = copyModes[2];
  let emojiMode = "Foreground";
  const views = {
    editor: "world-map|Map Editor",
    rules: "books|Ruleboxes",
    dialogue: "speech-balloon|Dialogue Editor",
    publish: "floppy-disk|Publish"
  };
  let viewKey = "editor";
  let [x, y] = [0, 0];
  const skins = [
    ["#ffdc5d", ""],
    ["#f7d7c4", "-light-skin-tone"],
    ["#d8b094", "-medium-light-skin-tone"],
    ["#bb9167", "-medium-skin-tone"],
    ["#8e562e", "-medium-dark-skin-tone"],
    ["#613d30", "-dark-skin-tone"]
  ];
  $$result.css.add(css);
  $$unsubscribe_currentEmoji();
  $$unsubscribe_map();
  $$unsubscribe_currentColor();
  $$unsubscribe_saves();
  $$unsubscribe_showLoading();
  $$unsubscribe_formattedEmoji();
  $$unsubscribe_pushers();
  $$unsubscribe_mergers();
  $$unsubscribe_controllables();
  $$unsubscribe_interactables();
  $$unsubscribe_sequencers();
  $$unsubscribe_effectors();
  $$unsubscribe_dialogueTree();
  $$unsubscribe_currentSkin();
  return `${$$result.head += `<!-- HEAD_svelte-1evbouv_START -->${$$result.title = `<title>Emojistan | Editor</title>`, ""}<!-- HEAD_svelte-1evbouv_END -->`, ""}



<div class="absolute z-50 flex h-6 w-6 items-center justify-center text-lg"${add_styles(merge_ssr_styles("transform: translate(" + escape(x + 12, true) + "px, " + escape(y - 12, true) + "px);", { "background": $currentColor || "none" }))}><i class="${"twa twa-" + escape($formattedEmoji, true) + " svelte-18w5ayy"}"></i></div>

${$saves.currentSaveID != "" ? `<main class="editor relative box-border flex h-screen flex-col items-center justify-center overflow-hidden">${`<div class="flex h-full w-full flex-row items-center justify-center gap-4 text-lg 2xl:top-8 2xl:text-2xl">${each(Object.entries(views), ([key, data]) => {
    let [icon, title] = data.split("|");
    return `
					<button${add_attribute("title", title, 0)} class="${escape(viewKey === key ? "scale-125 bg-primary" : "bg-neutral", true) + " btn-square rounded duration-200 ease-out hover:scale-125"}"><i class="${"twa twa-" + escape(icon, true) + " svelte-18w5ayy"}"></i>
					</button>`;
  })}</div>
			${`${`<div class="relative box-border flex flex-row items-center justify-center"><aside class="aside overflow-y-auto overflow-x-visible">${`<div class="flex flex-col"><button class="btn mb-8 bg-primary text-lg text-primary-content 2xl:btn-md hover:bg-primary-focus">TEST</button>
								<div class="flex flex-col gap-2"><div class="form-control">${validate_component(RecentlyUsed, "RecentlyUsed").$$render($$result, {}, {}, {})}
										<label for="emoji-mode" class="label"><span class="label-text text-xs text-neutral-content 2xl:text-base">Emoji Mode
											</span></label>
										<select id="emoji-mode" class="select-bordered select 2xl:text-base">${each(["Foreground", "Background"], (mode) => {
    return `<option${add_attribute("value", mode, 0)}>${escape(mode)}</option>`;
  })}</select>
										<label for="copy-delete-mode" class="label"><span class="label-text text-xs text-neutral-content 2xl:text-base">Copy / Delete Mode
											</span></label>
										<select id="copy-delete-mode" class="select-bordered select 2xl:text-base">${each(copyModes, (mode) => {
    return `<option${add_attribute("value", mode, 0)}>${escape(mode)}</option>`;
  })}</select></div>
									<button class="btn bg-accent text-lg text-accent-content 2xl:btn-md hover:bg-accent-focus">CLEAR ${escape(deleteTexts[copyMode])}</button>
									<button id="filler" ${$currentEmoji === "" ? "disabled" : ""} class="btn w-full text-lg 2xl:btn-md">Fill With  <i class="${"twa twa-" + escape($formattedEmoji, true) + " svelte-18w5ayy"}"></i></button>
									<label class="label pt-8"><span class="label-text text-xs text-neutral-content 2xl:text-base">Palette
										</span></label>
									<div class="grid grid-cols-9 grid-rows-10 items-center justify-center gap-1">${each(palette, (color) => {
    let disabled = color === $map.dbg;
    return `
											<button ${disabled ? "disabled" : ""} class="${"h-5 w-5 rounded-sm border border-black duration-75 ease-out " + escape(disabled ? "" : "hover:scale-125", true) + " 2xl:h-6 2xl:w-6"}"${add_styles({ "background-color": color })}></button>`;
  })}</div>
									<button ${$currentColor === "" ? "disabled" : ""} class="btn flex w-full flex-row items-center">Set <div class="m-1 h-4 w-4 rounded 2xl:h-6 2xl:w-6"${add_styles({ "background": $currentColor })}></div>
										as default
									</button>
									<label class="label pt-8"><span class="label-text text-xs text-neutral-content 2xl:text-base">World Map
										</span></label>
									<div id="world-map" class="grid h-[166px] w-[166px] grid-cols-12 grid-rows-12 gap-0.5 self-center svelte-18w5ayy">${each(
    {
      length: DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH
    },
    (_, i) => {
      let selected = i == sectionIndex;
      return `
											<button${add_attribute("title", `Section #${i}`, 0)} class="${[
        "relative h-[16px] w-[16px] duration-75 ease-out svelte-18w5ayy",
        selected ? "selected" : ""
      ].join(" ").trim()}"${add_styles({ "background-color": $map.dbg })}>${$map.ssi == i ? `<i class="twa twa-chequered-flag"></i>` : ``}
											</button>`;
    }
  )}</div>
									<button class="btn mt-1 flex w-full flex-row items-center">Set as  <i class="twa twa-chequered-flag"></i></button></div></div>`}</aside>
					${`<div class="flex flex-col justify-center px-8">${validate_component(Editor, "Editor").$$render($$result, { sectionIndex, copyMode, emojiMode }, {}, {})}</div>`}
					<aside class="aside overflow-y-auto pt-0"><div class="sticky top-0 flex w-full flex-col items-center justify-center gap-4 bg-slate-500 p-4 pt-8"><input class="input-bordered input input-sm w-full 2xl:input-md" type="text" placeholder="Search"${add_attribute("value", filter, 0)}>
							<div class="my-4 grid grid-cols-4 grid-rows-2 gap-4">${each(Object.keys(emojis), (category) => {
    return `<button class="${escape(
      category === currentCategory ? "scale-125" : "opacity-50 hover:scale-125 hover:opacity-100",
      true
    ) + " duration-75 ease-out"}"><i class="${"twa twa-" + escape(category, true) + " text-2xl svelte-18w5ayy"}"></i>
									</button>`;
  })}</div>
							<div class="flex flex-row gap-2">${each(skins, ([hexcode, skinName]) => {
    let selected = $currentSkin === skinName;
    return `
									<button class="${"brutal h-6 w-6 rounded duration-75 ease-out " + escape(selected ? "scale-125" : "hover:scale-125", true)}"${add_styles({ "background": hexcode })}></button>`;
  })}</div></div>
						<div id="flex flex-col">${each(Object.keys(emojis), (category) => {
    return `${currentCategory === category ? `<div class="emojis flex flex-wrap justify-center">${each(emojis[category], (name) => {
      let title = name.replaceAll("-", " ");
      return `
											${title.includes(filter) ? `<button${add_attribute("title", title, 0)} class="${["svelte-18w5ayy", $currentEmoji === name ? "selected" : ""].join(" ").trim()}"><i class="${"twa twa-" + escape(name.replace("_", $currentSkin), true) + " svelte-18w5ayy"}"></i>
												</button>` : ``}`;
    })}
									</div>` : ``}`;
  })}</div></aside></div>`}`}

			<div class="relative flex h-full w-full flex-col items-center justify-center"><div class="absolute bottom-8 left-8 flex flex-row items-center md:bottom-4 md:left-4"><kbd class="kbd kbd-sm mr-2 2xl:kbd-md">Esc</kbd>
					<p class="2xl:text-md text-sm">untoggle emoji / color</p></div></div>`}</main>` : ``}`;
});
export {
  Page as default
};
