import { w as writable } from "./index2.js";
import { l as MERGER_W, m as MERGER_H, M as MERGER_BORDER, n as MERGER_BG, o as PUSHER_W, q as PUSHER_H, P as PUSHER_BORDER, r as PUSHER_BG, b as CONTROLLABLE_W, c as CONTROLLABLE_H, a as CONTROLLABLE_BORDER, d as CONTROLLABLE_BG, S as SEQUENCER_W, t as SEQUENCER_H, u as SEQUENCER_BORDER, v as SEQUENCER_BG, w as INTERACTABLE_W, x as INTERACTABLE_H, I as INTERACTABLE_BORDER, y as INTERACTABLE_BG, e as EFFECTOR_W, f as EFFECTOR_H, E as EFFECTOR_BORDER, g as EFFECTOR_BG, z as CTX_MENU_W } from "./constants.js";
class Rulebox {
  constructor(id, type, position) {
    this.id = id;
    this.type = type;
    this.position = position;
    switch (type) {
      case "ctxMenu":
        this.width = CTX_MENU_W;
        return;
      case "effector":
        this.width = EFFECTOR_W;
        this.height = EFFECTOR_H;
        this.borderColor = EFFECTOR_BORDER;
        this.bgColor = EFFECTOR_BG;
        return;
      case "interactable":
        this.width = INTERACTABLE_W;
        this.height = INTERACTABLE_H;
        this.borderColor = INTERACTABLE_BORDER;
        this.bgColor = INTERACTABLE_BG;
        return;
      case "sequencer":
        this.width = SEQUENCER_W;
        this.height = SEQUENCER_H;
        this.borderColor = SEQUENCER_BORDER;
        this.bgColor = SEQUENCER_BG;
        return;
      case "controllable":
        this.width = CONTROLLABLE_W;
        this.height = CONTROLLABLE_H;
        this.borderColor = CONTROLLABLE_BORDER;
        this.bgColor = CONTROLLABLE_BG;
        return;
      case "pusher":
        this.width = PUSHER_W;
        this.height = PUSHER_H;
        this.borderColor = PUSHER_BORDER;
        this.bgColor = PUSHER_BG;
        return;
      case "merger":
        this.width = MERGER_W;
        this.height = MERGER_H;
        this.borderColor = MERGER_BORDER;
        this.bgColor = MERGER_BG;
        return;
    }
  }
}
function createRuleboxes() {
  const arr = [];
  const { set, subscribe, update } = writable(arr);
  return {
    set,
    subscribe,
    update,
    useStorage: (id) => {
      const val = JSON.parse(localStorage.getItem(id + "_rbxs"));
      set(val || []);
      subscribe((state) => {
        localStorage.setItem(id + "_rbxs", JSON.stringify(Array.from(state)));
      });
    },
    spawn(component, position) {
      let id = "-1";
      update((state) => {
        state = state.filter((rbx) => rbx.type != "ctxMenu");
        id = `${Math.max(...state.map((rbx) => +rbx.id), 0) + 1}`;
        state.push(new Rulebox(id, component, position));
        return state;
      });
      return id;
    },
    remove: (id) => update((state) => {
      state = state.filter((rbx) => rbx.id != id);
      return state;
    }),
    removeCtxMenu: () => update((state) => {
      state = state.filter((rbx) => rbx.type != "ctxMenu");
      return state;
    }),
    adjustHeight: (id, sequenceLength, defaultHeight) => update((state) => {
      for (let rbx of state) {
        if (rbx.id === id) {
          rbx.height = defaultHeight + sequenceLength * 56;
          break;
        }
      }
      return state;
    })
  };
}
writable(true);
const movementStore = writable(true);
const rbxSelected = writable(false);
const rbxIdSelected = writable("-1");
writable(1);
const rbxStore = createRuleboxes();
const Interactable_svelte_svelte_type_style_lang = "";
const Rulebox_svelte_svelte_type_style_lang = "";
export {
  rbxSelected as a,
  rbxIdSelected as b,
  movementStore as m,
  rbxStore as r
};
