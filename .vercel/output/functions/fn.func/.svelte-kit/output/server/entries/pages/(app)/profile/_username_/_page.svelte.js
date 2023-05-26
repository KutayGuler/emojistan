import { c as create_ssr_component, b as escape } from "../../../../../chunks/index3.js";
import "../../../../../chunks/notifications.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${`${data.profileData?.bio ? `<p class="h-full text-2xl">${escape(data.profileData.bio)}</p>` : `<i class="twa twa-fountain-pen absolute scale-150 self-center pt-[50%] text-9xl opacity-20"></i>`}
	${data.isOwner ? `<button class="btn-ghost btn-sm btn w-fit self-end">Edit bio</button>` : ``}`}`;
});
export {
  Page as default
};
