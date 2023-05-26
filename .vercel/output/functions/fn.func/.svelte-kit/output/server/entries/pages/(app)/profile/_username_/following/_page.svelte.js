import { c as create_ssr_component, v as validate_component } from "../../../../../../chunks/index3.js";
import { P as Paginatable } from "../../../../../../chunks/Paginatable.js";
import { P as ProfileCard } from "../../../../../../chunks/ProfileCard.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  async function supabaseQuery(from, to) {
    const res = await data.supabase.from("follows").select("following_id, profile:profiles!follows_following_id_fkey(username)", { count: "exact" }).eq("follower_id", data.profileData.id).range(from, to);
    return res;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Paginatable, "Paginatable").$$render(
    $$result,
    {
      wrap: true,
      data: data.following.data,
      component: ProfileCard,
      supabaseQuery
    },
    {},
    {
      fallback: () => {
        return `<i slot="fallback" class="twa twa-face-with-monocle absolute scale-150 self-center pt-[50%] text-9xl opacity-20"></i>`;
      }
    }
  )}`;
});
export {
  Page as default
};
