import { c as create_ssr_component, a as subscribe, e as each, d as add_attribute, b as escape } from "../../../../chunks/index3.js";
import "../../../../chunks/singletons.js";
import { s as saves } from "../../../../chunks/store.js";
import "../../../../chunks/notifications.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $saves, $$unsubscribe_saves;
  $$unsubscribe_saves = subscribe(saves, (value) => $saves = value);
  let { data } = $$props;
  let emojiFreqs = /* @__PURE__ */ new Map();
  let renameIndex = -1;
  let newName = "";
  let deleteIndex = -1;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_saves();
  return `${$$result.head += `<!-- HEAD_svelte-k9s0x6_START -->${$$result.title = `<title>Emojistan</title>`, ""}<!-- HEAD_svelte-k9s0x6_END -->`, ""}



<div class="flex h-full flex-col gap-4"><h1 class="pl-4 text-6xl">Play</h1>
	<div class="flex w-full gap-2 px-4"><label for="save-file" class="relative flex h-28 flex-grow cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-black hover:bg-gray-300"><span class="drop-title">Drop files here</span>
			or
			<input type="file" id="save-file" accept="application/json" required>
			${``}</label>
		<button class="btn-primary btn h-28 flex-grow text-4xl">NEW GAME</button></div>
	<div class="h-full overflow-y-auto overflow-x-hidden px-4">${each([...$saves.saves], ([id, name], i) => {
    return `<div class="brutal relative mb-2 flex h-56 flex-col rounded-lg bg-slate-300 p-4">${renameIndex === i ? `<form class="pb-4">
						<input autofocus class="input-bordered input input-sm" type="text"${add_attribute("value", newName, 0)}>
						<button type="submit"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg></button>
					</form>` : `<div class="flex gap-2 pb-4"><h3>${escape(name)}</h3>
						<button class="w-fit pl-0 text-slate-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg></button>
					</div>`}
				<p>${each([...emojiFreqs.get(id) || []], (e) => {
      return `<i class="${"twa text-4xl twa-" + escape(e, true)}"></i>`;
    })}</p>
				<div class="flex flex-grow"></div>
				<div class="flex w-full flex-row items-end gap-2 self-end"><button title="Download save file" class="btn-ghost btn-sm btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path></svg></button>
					<div class="flex flex-grow"></div>
					${deleteIndex === i ? `<form><button class="btn-error btn-sm btn">CONFIRM</button></form>
						<button class="btn-sm btn">CANCEL</button>` : `<button class="btn-ghost btn-sm btn border-none hover:border-none hover:bg-error">DELETE</button>`}
					<button class="btn-sm btn">OPEN</button></div>
			</div>`;
  })}</div></div>`;
});
export {
  Page as default
};
