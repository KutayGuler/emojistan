import { c as create_ssr_component } from "../../../chunks/index3.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-k9s0x6_START -->${$$result.title = `<title>Emojistan</title>`, ""}<!-- HEAD_svelte-k9s0x6_END -->`, ""}`;
});
export {
  Page as default
};
