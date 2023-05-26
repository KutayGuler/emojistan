import { c as create_ssr_component, g as createEventDispatcher, b as escape, e as each, v as validate_component, m as missing_component } from "./index3.js";
import "./notifications.js";
const IntersectionObserver_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { element = null } = $$props;
  let { once = false } = $$props;
  let { intersecting = false } = $$props;
  let { root = null } = $$props;
  let { rootMargin = "0px" } = $$props;
  let { threshold = 0 } = $$props;
  let { entry = null } = $$props;
  let { observer = null } = $$props;
  createEventDispatcher();
  if ($$props.element === void 0 && $$bindings.element && element !== void 0)
    $$bindings.element(element);
  if ($$props.once === void 0 && $$bindings.once && once !== void 0)
    $$bindings.once(once);
  if ($$props.intersecting === void 0 && $$bindings.intersecting && intersecting !== void 0)
    $$bindings.intersecting(intersecting);
  if ($$props.root === void 0 && $$bindings.root && root !== void 0)
    $$bindings.root(root);
  if ($$props.rootMargin === void 0 && $$bindings.rootMargin && rootMargin !== void 0)
    $$bindings.rootMargin(rootMargin);
  if ($$props.threshold === void 0 && $$bindings.threshold && threshold !== void 0)
    $$bindings.threshold(threshold);
  if ($$props.entry === void 0 && $$bindings.entry && entry !== void 0)
    $$bindings.entry(entry);
  if ($$props.observer === void 0 && $$bindings.observer && observer !== void 0)
    $$bindings.observer(observer);
  return `${slots.default ? slots.default({ intersecting, entry, observer }) : ``}`;
});
const IntersectionObserver = IntersectionObserver_1;
const Paginatable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { component } = $$props;
  let { data = [] } = $$props;
  let { wrap = false } = $$props;
  let { supabaseQuery } = $$props;
  let paginationCount = 9;
  let intersecting;
  let element;
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.wrap === void 0 && $$bindings.wrap && wrap !== void 0)
    $$bindings.wrap(wrap);
  if ($$props.supabaseQuery === void 0 && $$bindings.supabaseQuery && supabaseQuery !== void 0)
    $$bindings.supabaseQuery(supabaseQuery);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${data ? `<div class="${"h-full overflow-y-auto overflow-x-hidden px-1 " + escape(wrap ? "flex flex-wrap" : "", true)}">${each(data || [], (props, index) => {
      return `${index == data.length - 1 ? `${validate_component(component || missing_component, "svelte:component").$$render(
        $$result,
        Object.assign({}, { index }, props, { div: element }),
        {
          div: ($$value) => {
            element = $$value;
            $$settled = false;
          }
        },
        {}
      )}` : `${validate_component(component || missing_component, "svelte:component").$$render(
        $$result,
        Object.assign(
          {},
          {
            index: index < paginationCount ? 0 : paginationCount - index
          },
          props
        ),
        {},
        {}
      )}`}`;
    })}</div>

	${validate_component(IntersectionObserver, "IntersectionObserver").$$render(
      $$result,
      { element, threshold: 1, intersecting },
      {
        intersecting: ($$value) => {
          intersecting = $$value;
          $$settled = false;
        }
      },
      {}
    )}

	${``}` : `${slots.fallback ? slots.fallback({}) : ``}`}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Paginatable as P
};
