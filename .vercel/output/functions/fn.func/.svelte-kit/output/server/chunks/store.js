import { p as page } from "./stores.js";
import { w as writable, d as derived } from "./index2.js";
import { D as DEFAULT_BG, s as storeNames } from "./constants.js";
import { g as generateID } from "./utils.js";
import { l as get_store_value } from "./index3.js";
class HP {
  constructor(points) {
    this.current = points;
    this.max = points;
  }
  add(points) {
    this.current += points;
    if (this.current > this.max) {
      this.max = this.current;
    }
  }
}
class Entity {
  constructor(emoji, inventory, hpPoints) {
    this.emoji = emoji;
    if (inventory) {
      this.inventory = inventory;
    }
    if (hpPoints) {
      this.hp = new HP(hpPoints);
    }
  }
}
class Effector {
  constructor(emoji, hp, type) {
    this.emoji = emoji;
    this.hp = hp;
    this.type = type;
  }
}
class EditableMap {
  constructor(items = /* @__PURE__ */ new Map(), colors = /* @__PURE__ */ new Map(), backgrounds = /* @__PURE__ */ new Map(), dbg = DEFAULT_BG) {
    this.ssi = 0;
    this.items = items;
    this.colors = colors;
    this.backgrounds = backgrounds;
    this.dbg = dbg;
  }
}
class Sequencer {
  constructor(name, sequence) {
    this.name = name;
    this.sequence = sequence;
  }
}
class Evolve {
  constructor(to, at) {
    this.to = to;
    this.at = at;
  }
}
class Devolve {
  constructor(to) {
    this.to = to;
  }
}
class Interactable {
  constructor(emoji, sequenceID, hp, sideEffects, evolve, devolve, drops) {
    this.emoji = emoji;
    this.sequenceID = sequenceID;
    this.hp = hp;
    this.sideEffects = sideEffects;
    this.evolve = evolve;
    this.devolve = devolve;
    this.drops = drops;
  }
}
class Controllable {
  constructor(emoji, hp, sideEffects, evolve, devolve) {
    this.emoji = emoji;
    this.hp = hp;
    this.sideEffects = sideEffects;
    this.evolve = evolve;
    this.devolve = devolve;
  }
}
class Choice {
  constructor(label, text, next) {
    this.label = label;
    this.text = text;
    this.next = next;
  }
}
function createMapStore(name) {
  const { set, subscribe, update } = writable(/* @__PURE__ */ new Map());
  return {
    set,
    subscribe,
    useStorage: (id) => {
      const val = JSON.parse(localStorage.getItem(id + "_" + name));
      set(new Map(val) || /* @__PURE__ */ new Map());
      subscribe((state) => {
        localStorage.setItem(
          id + "_" + name,
          JSON.stringify(Array.from(state.entries()))
        );
      });
    },
    add: (id, value) => update((state) => {
      state.set(id, value);
      return state;
    }),
    update: (id, value) => update((state) => {
      state.set(id, value);
      return state;
    }),
    remove: (id) => update((state) => {
      state.delete(id);
      return state;
    })
  };
}
function createSaves() {
  const { set, subscribe, update } = writable({
    saves: /* @__PURE__ */ new Map(),
    currentSaveID: "",
    currentSaveName: "",
    loaded: false
  });
  return {
    set,
    subscribe,
    useStorage: () => {
      const currentSaveID = localStorage.getItem("currentSaveID");
      const saves2 = JSON.parse(localStorage.getItem("saves"));
      if (get_store_value(page).route.id === "editor" && (currentSaveID === "" || currentSaveID === null)) {
        return false;
      }
      let _saves = new Map(saves2) || /* @__PURE__ */ new Map();
      update((state) => {
        state.saves = _saves;
        state.currentSaveID = currentSaveID || "";
        state.currentSaveName = _saves.get(currentSaveID || "") || "";
        state.loaded = true;
        return state;
      });
      subscribe((state) => {
        localStorage.setItem(
          "saves",
          JSON.stringify(Array.from(state.saves.entries()))
        );
        localStorage.setItem("currentSaveID", state.currentSaveID);
      });
      return true;
    },
    rename: (id, title) => update((state) => {
      state.saves.set(id, title);
      return state;
    }),
    add: (name) => update((state) => {
      let id = generateID();
      state.currentSaveID = id;
      state.currentSaveName = name;
      state.saves.set(id, name);
      return state;
    }),
    delete: (id) => update((state) => {
      for (let store of storeNames) {
        localStorage.removeItem(id + "_" + store);
      }
      state.currentSaveID = "";
      state.saves.delete(id);
      return state;
    })
  };
}
function createEditableMap() {
  const { set, subscribe, update } = writable(new EditableMap());
  return {
    set,
    subscribe,
    useStorage: (id) => {
      const ssi = parseInt(localStorage.getItem(id + "_ssi") || "0");
      const dbg = localStorage.getItem(id + "_dbg") || DEFAULT_BG;
      const items = JSON.parse(localStorage.getItem(id + "_items"));
      const colors = JSON.parse(localStorage.getItem(id + "_colors"));
      const backgrounds = JSON.parse(
        localStorage.getItem(id + "_backgrounds")
      );
      update((state) => {
        state.ssi = ssi;
        state.items = new Map(items) || /* @__PURE__ */ new Map();
        state.colors = new Map(colors) || /* @__PURE__ */ new Map();
        state.backgrounds = new Map(backgrounds) || /* @__PURE__ */ new Map();
        state.dbg = dbg || "";
        return state;
      });
      subscribe((state) => {
        localStorage.setItem(
          id + "_items",
          JSON.stringify(Array.from(state.items.entries()))
        );
        localStorage.setItem(
          id + "_colors",
          JSON.stringify(Array.from(state.colors.entries()))
        );
        localStorage.setItem(
          id + "_backgrounds",
          JSON.stringify(Array.from(state.backgrounds.entries()))
        );
        localStorage.setItem(id + "_dbg", state.dbg);
        localStorage.setItem(id + "_ssi", state.ssi);
      });
    },
    updateStartingSection: (index) => update((state) => {
      state.ssi = index;
      return state;
    }),
    updateDefaultColor: (color) => update((state) => {
      state.dbg = color;
      return state;
    }),
    updateColorAt: (sectionIndex, index, color) => update((state) => {
      state.colors.set(`${sectionIndex}_${index}`, color);
      return state;
    }),
    deleteColorAt: (sectionIndex, index) => update((state) => {
      state.colors.delete(`${sectionIndex}_${index}`);
      return state;
    }),
    clearColors: (sectionIndex) => update((state) => {
      let keys = [];
      for (let key of state.colors.keys()) {
        if (+key.split("_")[0] == sectionIndex) {
          keys.push(key);
        }
      }
      for (let key of keys) {
        state.colors.delete(key);
      }
      return state;
    }),
    filterColors: () => update((state) => {
      for (let [id, color] of state.colors) {
        if (color === state.dbg)
          state.colors.delete(id);
      }
      return state;
    }),
    updateBackgroundAt: (sectionIndex, index, emoji) => update((state) => {
      state.backgrounds.set(`${sectionIndex}_${index}`, emoji);
      return state;
    }),
    deleteBackgroundAt: (sectionIndex, index) => update((state) => {
      state.backgrounds.delete(`${sectionIndex}_${index}`);
      return state;
    }),
    clearBackgrounds: (sectionIndex) => update((state) => {
      let keys = [];
      for (let key of state.backgrounds.keys()) {
        if (+key.split("_")[0] == sectionIndex) {
          keys.push(key);
        }
      }
      for (let key of keys) {
        state.items.delete(key);
      }
      return state;
    }),
    addEmoji: (sectionIndex, index, emoji) => update((state) => {
      state.items.set(`${sectionIndex}_${index}`, emoji);
      return state;
    }),
    removeEmoji: (sectionIndex, index) => update((state) => {
      state.items.delete(`${sectionIndex}_${index}`);
      return state;
    }),
    clearItems: (sectionIndex) => update((state) => {
      let keys = [];
      for (let key of state.items.keys()) {
        if (+key.split("_")[0] == sectionIndex) {
          keys.push(key);
        }
      }
      for (let key of keys) {
        state.items.delete(key);
      }
      return state;
    }),
    clearAll: (sectionIndex) => update((state) => {
      let keys = [];
      for (let key of state.items.keys()) {
        if (+key.split("_")[0] == sectionIndex) {
          keys.push(key);
        }
      }
      for (let key of keys) {
        state.items.delete(key);
      }
      keys = [];
      for (let key of state.colors.keys()) {
        if (+key.split("_")[0] == sectionIndex) {
          keys.push(key);
        }
      }
      for (let key of keys) {
        state.colors.delete(key);
      }
      keys = [];
      for (let key of state.backgrounds.keys()) {
        if (+key.split("_")[0] == sectionIndex) {
          keys.push(key);
        }
      }
      for (let key of keys) {
        state.backgrounds.delete(key);
      }
      return state;
    }),
    hasControllable: () => {
      let _hasControllable = false;
      update((state) => {
        let controllableEmojis = [];
        for (let { emoji } of get_store_value(controllables).values()) {
          controllableEmojis.push(emoji);
        }
        for (let [key, val] of state.items.entries()) {
          if (state.ssi == +key.split("_")[0] && controllableEmojis.includes(val)) {
            _hasControllable = true;
            return state;
          }
        }
        return state;
      });
      return _hasControllable;
    }
  };
}
function createModal() {
  const { set, subscribe, update } = writable({
    visible: false,
    header: "",
    content: "",
    confirmText: "",
    onConfirm: (arg) => {
    },
    danger: false,
    input: false
  });
  return {
    set,
    subscribe,
    show: (modalData) => update((state) => {
      state = modalData;
      state.visible = true;
      return state;
    })
  };
}
function createDialogueTree() {
  const { set, subscribe, update } = writable(/* @__PURE__ */ new Map());
  return {
    set,
    subscribe,
    useStorage: (id) => {
      const val = JSON.parse(localStorage.getItem(id + "_dt"));
      set(new Map(val) || /* @__PURE__ */ new Map());
      subscribe((state) => {
        localStorage.setItem(
          id + "_dt",
          JSON.stringify(Array.from(state.entries()))
        );
      });
    },
    add: (id) => update((state) => {
      state.set(id, []);
      return state;
    }),
    removeChoice: (parentBranchName, choiceID) => update((state) => {
      let length = state.get(parentBranchName)?.length;
      state.get(parentBranchName)[length - 1] = state.get(parentBranchName)?.at(-1).filter(({ next }) => next != choiceID);
      state.delete(choiceID);
      if (typeof state.get(choiceID)?.at(-1) !== "string") {
        state.forEach((_, key) => {
          if (key.includes(choiceID)) {
            state.delete(key);
          }
        });
      }
      return state;
    }),
    remove: (id) => update((state) => {
      state.delete(id);
      if (typeof state.get(id)?.at(-1) !== "string") {
        state.forEach((_, key) => {
          if (key.includes(id)) {
            state.delete(key);
          }
        });
      }
      return state;
    }),
    addTextTo: (id, text) => update((state) => {
      if (typeof state.get(id)?.at(-1) !== "string") {
        let _state = state.get(id);
        _state?.splice(_state?.length - 1, 0, text);
      } else {
        state.get(id)?.push(text);
      }
      return state;
    }),
    addChoiceTo: (rootID, text) => update((state) => {
      const branch = state.get(rootID);
      let id = "";
      if (rootID.includes("_")) {
        id = rootID.split("_")[0] + "_" + generateID();
      } else {
        id = rootID + "_" + generateID();
      }
      state.set(id, []);
      const choice = new Choice(text.slice(0, 4), text, id);
      if (typeof branch?.at(-1) === "string") {
        branch?.push([choice]);
      } else {
        branch?.at(-1)?.push(choice);
      }
      return state;
    })
  };
}
function createRecentlyUsed() {
  const { set, subscribe, update } = writable(/* @__PURE__ */ new Set());
  return {
    set,
    subscribe,
    update,
    useStorage: (id) => {
      const val = JSON.parse(localStorage.getItem(id + "_ru"));
      set(new Set(val) || /* @__PURE__ */ new Set());
      subscribe((state) => {
        localStorage.setItem(
          id + "_ru",
          JSON.stringify(Array.from(state.values()))
        );
      });
    },
    add: (emoji) => update((state) => {
      if (state.has(emoji)) {
        state.delete(emoji);
        state.add(emoji);
      } else {
        state.add(emoji);
      }
      if (state.size > 16) {
        for (let _emoji of state) {
          if (emoji != _emoji) {
            state.delete(_emoji);
            break;
          }
        }
      }
      return state;
    })
  };
}
const showLoading = writable(false);
writable(false);
const modal = createModal();
const currentColor = writable("");
const currentEmoji = writable("");
const currentSkin = writable("");
const formattedEmoji = derived(
  [currentEmoji, currentSkin],
  ([$currentEmoji, $currentSkin]) => $currentEmoji?.replace("_", $currentSkin)
);
const saves = createSaves();
const map = createEditableMap();
const pushers = createMapStore("pushers");
const mergers = createMapStore("mergers");
const effectors = createMapStore("effectors");
const interactables = createMapStore(
  "interactables"
);
const sequencers = createMapStore(
  "sequencers"
);
const controllables = createMapStore(
  "controllables"
);
const dialogueTree = createDialogueTree();
const liked_game_ids = writable(/* @__PURE__ */ new Set());
const recentlyUsed = createRecentlyUsed();
export {
  Controllable as C,
  Devolve as D,
  EditableMap as E,
  Interactable as I,
  Sequencer as S,
  Evolve as a,
  Effector as b,
  sequencers as c,
  controllables as d,
  effectors as e,
  mergers as f,
  formattedEmoji as g,
  map as h,
  interactables as i,
  dialogueTree as j,
  currentEmoji as k,
  liked_game_ids as l,
  modal as m,
  currentColor as n,
  Entity as o,
  pushers as p,
  currentSkin as q,
  recentlyUsed as r,
  saves as s,
  showLoading as t
};
