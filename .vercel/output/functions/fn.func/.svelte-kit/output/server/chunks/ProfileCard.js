import { c as create_ssr_component, b as escape } from "./index3.js";
const ProfileCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { profile } = $$props;
  if ($$props.profile === void 0 && $$bindings.profile && profile !== void 0)
    $$bindings.profile(profile);
  return `<a href="${"/profile/" + escape(profile.username, true)}" class="brutal flex h-48 w-48 flex-col items-center justify-center gap-2 rounded bg-base-300 text-neutral"><div class="placeholder avatar"><div class="w-24 rounded-full bg-neutral"><i class="twa twa-alien text-6xl"></i></div></div>
	${escape(profile.username)}</a>`;
});
export {
  ProfileCard as P
};
