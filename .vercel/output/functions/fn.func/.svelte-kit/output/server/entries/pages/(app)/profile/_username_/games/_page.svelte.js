import { c as create_ssr_component, v as validate_component } from "../../../../../../chunks/index3.js";
import { P as Paginatable } from "../../../../../../chunks/Paginatable.js";
import { G as GameCard } from "../../../../../../chunks/GameCard.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  async function supabaseQuery(from, to) {
    let res = await data.supabase.from("games").select("id, name, profile:profiles!games_user_id_fkey(username)", { count: "exact" }).eq("user_id", data.profileData.id).range(from, to);
    return res;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Paginatable, "Paginatable").$$render(
    $$result,
    {
      data: data.games.data,
      component: GameCard,
      supabaseQuery
    },
    {},
    {
      fallback: () => {
        return `<i slot="fallback" class="twa twa-floppy-disk absolute scale-150 self-center pt-[50%] text-9xl opacity-20"></i>`;
      }
    }
  )}`;
});
export {
  Page as default
};
