import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/index3.js";
import { P as Paginatable } from "../../../../../chunks/Paginatable.js";
import { G as GameCard } from "../../../../../chunks/GameCard.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  async function supabaseQuery(from, to) {
    const res = await data.supabase.from("games").select("id, name, profile:profiles!games_user_id_fkey(username)").order("created_at", { ascending: false }).range(from, to);
    return res;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Paginatable, "Paginatable").$$render(
    $$result,
    {
      data: data.newGames,
      component: GameCard,
      supabaseQuery
    },
    {},
    {}
  )}`;
});
export {
  Page as default
};
