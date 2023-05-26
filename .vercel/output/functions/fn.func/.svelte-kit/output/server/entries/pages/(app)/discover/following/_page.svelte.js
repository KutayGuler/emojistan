import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/index3.js";
import { P as Paginatable } from "../../../../../chunks/Paginatable.js";
import { G as GameCard } from "../../../../../chunks/GameCard.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  async function supabaseQuery(from, to) {
    const res = await data.supabase.from("games").select("name, id, profile:profiles!games_user_id_fkey(username)").in("user_id", data.following_ids).range(0, 9);
    return res;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${data.session ? `${validate_component(Paginatable, "Paginatable").$$render(
    $$result,
    {
      data: data.followingGames,
      component: GameCard,
      supabaseQuery
    },
    {},
    {}
  )}` : `<div>Login to see the games of people you follow.</div>`}`;
});
export {
  Page as default
};
