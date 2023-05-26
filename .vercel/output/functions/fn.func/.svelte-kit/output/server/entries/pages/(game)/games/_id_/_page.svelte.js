import { c as create_ssr_component, a as subscribe, A as is_promise, h as noop, v as validate_component, B as globals } from "../../../../../chunks/index3.js";
import { p as page } from "../../../../../chunks/stores.js";
import { G as Game } from "../../../../../chunks/Game.js";
import { L as Loading } from "../../../../../chunks/Loading.js";
const { Object: Object_1 } = globals;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  async function getGameData() {
    let { data: _data, error } = await data.supabase.from("games").select("data").eq("id", $page.params.id);
    let gameData = _data[0].data;
    if (error) {
      throw error;
    } else if (gameData) {
      for (let [key, val] of Object.entries(gameData)) {
        if (key == "map")
          continue;
        gameData[key] = new Map(val);
      }
      for (let [key, val] of Object.entries(gameData.map)) {
        if (key == "dbg" || key == "ssi")
          continue;
        gameData.map[key] = new Map(val);
      }
      gameData.map.ssi = parseInt(gameData.map.ssi);
      return gameData;
    }
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_page();
  return `${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
	${validate_component(Loading, "Loading").$$render($$result, {}, {}, {})}
`;
    }
    return function(gameData) {
      return `
	<main class="editor relative box-border flex h-screen flex-col items-center justify-center overflow-hidden">${validate_component(Game, "Game").$$render($$result, Object_1.assign({}, gameData), {}, {})}</main>
`;
    }(__value);
  }(getGameData())}`;
});
export {
  Page as default
};
