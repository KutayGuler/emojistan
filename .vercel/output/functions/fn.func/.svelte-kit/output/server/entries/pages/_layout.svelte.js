import { c as create_ssr_component, a as subscribe, e as each, b as escape, n as null_to_empty, d as add_attribute, v as validate_component } from "../../chunks/index3.js";
import { n as notifications } from "../../chunks/notifications.js";
import { C as CROSS } from "../../chunks/constants.js";
import { m as modal } from "../../chunks/store.js";
import { n as navigating } from "../../chunks/stores.js";
import { L as Loading } from "../../chunks/Loading.js";
import "../../chunks/singletons.js";
const app = "";
const twemoji = "";
const Toast_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "@keyframes svelte-16wuv9i-shake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-8px)}40%,60%{transform:translateX(8px)}}.shake.svelte-16wuv9i{animation:svelte-16wuv9i-shake 50ms 8 alternate}",
  map: null
};
function generateTailwindClass(type) {
  switch (type) {
    case "success":
      return "bg-primary";
    case "info":
      return "bg-info";
    case "warning":
      return "bg-warning";
    case "error":
      return "bg-error";
  }
}
const Toast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $notifications, $$unsubscribe_notifications;
  $$unsubscribe_notifications = subscribe(notifications, (value) => $notifications = value);
  $$result.css.add(css$1);
  $$unsubscribe_notifications();
  return `<div class="pointer-events-none fixed bottom-2 right-2 z-20 flex w-80 flex-col items-center justify-start">${each($notifications, (notification) => {
    return `<div class="${[
      "brutal mt-2 h-fit rounded " + escape(generateTailwindClass(notification.type), true) + " svelte-16wuv9i",
      notification.shake ? "shake" : ""
    ].join(" ").trim()}"><div class="p-4 text-2xl">${escape(notification.message)}</div>
			${notification.icon ? `<i class="${escape(null_to_empty(notification.icon), true) + " svelte-16wuv9i"}"></i>` : ``}
		</div>`;
  })}
</div>`;
});
const Modal_svelte_svelte_type_style_lang = "";
const css = {
  code: "dialog.svelte-mbbj37::backdrop{background:rgba(0, 0, 0, 0.3)}dialog[open].svelte-mbbj37{animation:svelte-mbbj37-zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)}@keyframes svelte-mbbj37-zoom{from{transform:scale(0.95)}to{transform:scale(1)}}dialog[open].svelte-mbbj37::backdrop{animation:svelte-mbbj37-fade 0.2s ease-out}@keyframes svelte-mbbj37-fade{from{opacity:0}to{opacity:1}}",
  map: null
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $modal, $$unsubscribe_modal;
  $$unsubscribe_modal = subscribe(modal, (value) => $modal = value);
  let dialog;
  let inputValue = "";
  $$result.css.add(css);
  $$unsubscribe_modal();
  return `
<dialog class="brutal h-fit w-96 bg-neutral svelte-mbbj37"${add_attribute("this", dialog, 0)}><div class="flex flex-col gap-8 text-neutral-content"><h3>${escape($modal.header)}</h3>
		<p class="text-neutral-300"><!-- HTML_TAG_START -->${$modal.content}<!-- HTML_TAG_END --></p>
		<button class="absolute right-4 top-4">${escape(CROSS)}</button></div>
	${$modal.input ? `<input type="text" class="input-bordered input"${add_attribute("value", inputValue, 0)}>` : ``}
	<div class="mt-8 flex flex-row justify-end gap-2"><button class="btn">CANCEL</button>
		<button autofocus ${$modal.input && inputValue.length < 2 ? "disabled" : ""} class="${"btn " + escape($modal.danger ? "btn-error" : "btn-primary", true)}">${escape($modal.confirmText)}</button></div>
</dialog>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_navigating();
  return `${validate_component(Toast, "Toast").$$render($$result, {}, {}, {})}

${validate_component(Modal, "Modal").$$render($$result, {}, {}, {})}

${slots.default ? slots.default({}) : ``}

${$navigating?.to?.url.pathname == "/editor" || $navigating?.from?.url.pathname == "/editor" || $navigating?.from?.route.id?.includes("(game)") ? `${validate_component(Loading, "Loading").$$render($$result, {}, {}, {})}` : ``}`;
});
export {
  Layout as default
};
