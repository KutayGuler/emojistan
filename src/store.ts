import { writable } from "svelte/store";

export interface Interactable {
  emoji: string;
  eventID: string;
  interacts: string;
}

export interface SequenceItem {
  type: string;
  background?: string;
  index?: number;
  duration?: number;
  emoji?: string;
}

export interface Loop {
  start: number;
  end: number;
  iterationNumber: number;
  iterationType: "increment" | "decrement";
  timeGap: number;
  reverse: boolean;
}

export interface TEvent {
  sequence: Array<SequenceItem>;
  loop?: Loop;
}

export interface TLoopEvent {
  sequence: Array<SequenceItem>;
  loop: Loop;
}

export interface TCondition {
  a: string;
  b: string;
  _b: string | "any";
  eventID: number;
}

export interface TPush {
  rule: Array<string>;
}

export interface TCollision {
  rule: Array<string>;
}

function createMapStore<T>(name: string) {
  const { set, subscribe, update } = writable(new Map<number, T>());

  return {
    set,
    subscribe,
    useStorage: (id: string) => {
      const val = JSON.parse(localStorage.getItem(id + "_" + name));
      set(new Map(val) || new Map<number, T>());
      subscribe((state) => {
        localStorage.setItem(
          id + "_" + name,
          JSON.stringify(Array.from(state.entries()))
        );
      });
    },
    add: (id: number, value: T) =>
      update((state) => {
        state.set(id, value);
        return state;
      }),
    update: (id: number, value: T) =>
      update((state) => {
        state.set(id, value);
        return state;
      }),
    updateValue: (id: number, key: string, value: T) =>
      update((state) => {
        // @ts-expect-error
        state.get(id)[key] = value;
        return state;
      }),
    remove: (id: number) =>
      update((state) => {
        state.delete(id);
        return state;
      }),
  };
}

function createSaves() {
  const { set, subscribe, update } = writable({
    saves: new Map<string, string>(),
    current: "",
    loaded: false,
  });

  return {
    set,
    subscribe,
    useStorage: () => {
      const current = localStorage.getItem("currentSave");
      const saves = JSON.parse(localStorage.getItem("saves"));
      console.log(current);

      update((state) => {
        state.saves = new Map(saves) || new Map();
        state.current = current || "";
        state.loaded = true;
        return state;
      });

      subscribe((state) => {
        localStorage.setItem(
          "saves",
          JSON.stringify(Array.from(state.saves.entries()))
        );
        localStorage.setItem("currentSave", state.current);
      });
    },
    add: () =>
      update((state) => {
        let id = Date.now().toString().slice(7);
        state.current = id;
        state.saves.set(id, "Game #" + (state.saves.size + 1).toString());
        return state;
      }),
    delete: (id: string) =>
      update((state) => {
        state.saves.delete(id);
        return state;
      }),
  };
}

function createEditableMap() {
  const { set, subscribe, update } = writable({
    items: new Map<number, string>(),
    backgrounds: new Map<number, string>(),
    objective: "",
  });

  return {
    set,
    subscribe,
    useStorage: (id: string) => {
      const objective = localStorage.getItem(id + "_objective");
      const items = JSON.parse(localStorage.getItem(id + "_items"));
      const backgrounds = JSON.parse(localStorage.getItem(id + "_backgrounds"));

      update((state) => {
        state.objective = objective || "";
        state.items = new Map(items) || new Map();
        state.backgrounds = new Map(backgrounds) || new Map();
        return state;
      });

      subscribe((state) => {
        localStorage.setItem(
          id + "_items",
          JSON.stringify(Array.from(state.items.entries()))
        );
        localStorage.setItem(
          id + "_backgrounds",
          JSON.stringify(Array.from(state.backgrounds.entries()))
        );
        localStorage.setItem(id + "_objective", state.objective);
      });
    },
    updateBackground: (index: number, color: string) =>
      update((state) => {
        state.backgrounds.set(index, color);
        return state;
      }),
    deleteBackground: (index: number) =>
      update((state) => {
        state.backgrounds.delete(index);
        return state;
      }),
    clearBackgrounds: () =>
      update((state) => {
        state.backgrounds.clear();
        return state;
      }),
    addEmoji: (index: number, emoji: string) =>
      update((state) => {
        state.items.set(index, emoji);
        return state;
      }),
    removeEmoji: (index: number) =>
      update((state) => {
        state.items.delete(index);
        return state;
      }),
    clearObjects: () =>
      update((state) => {
        state.items.clear();
        return state;
      }),
    clearAll: () =>
      update((state) => {
        state.backgrounds.clear();
        state.items.clear();
        return state;
      }),
  };
}

function createSetStore(name: string) {
  const { set, subscribe, update } = writable(new Set<string>());

  return {
    set,
    subscribe,
    useStorage: (id: string) => {
      const val = JSON.parse(localStorage.getItem(id + "_" + name));
      set(new Set<string>(Array.from(val)));
      subscribe((state) => {
        localStorage.setItem(
          id + "_" + name,
          JSON.stringify(Array.from(state))
        );
      });
    },
    add: (value: string) =>
      value != "" &&
      update((state) => {
        state.add(value);
        console.log(state);
        return state;
      }),
    remove: (value: string) =>
      value != "" &&
      update((state) => {
        state.delete(value);
        return state;
      }),
  };
}

export type ModalType =
  | "keyboardPlay"
  | "keyboardEditor"
  | "pushes"
  | "merges"
  | "conditions"
  | "events"
  | "statics"
  | "palette"
  | "emojistan";

function createModal() {
  const modal: { open: boolean; type: ModalType } = {
    open: false,
    type: "keyboardPlay",
  };
  const { subscribe, update } = writable(modal);

  return {
    subscribe,
    show: (type: ModalType) =>
      update((state) => {
        state.type = type;
        state.open = true;
        return state;
      }),
    close: () =>
      update((state) => {
        state.open = false;
        return state;
      }),
  };
}

export const modal = createModal();

export const currentItem = writable("");
export const currentColor = writable("");
export const currentEmoji = writable("");
export const rulesIndex = writable(0);

export const saves = createSaves();

export const statics = createSetStore("statics");
export const quickAccess = createSetStore("quickAccess");
export const palette = createSetStore("palette");

export const map = createEditableMap();

export const pushes = createMapStore<TCollision>("pushes");
export const merges = createMapStore<TCollision>("merges");
export const collisions = createMapStore<TCollision>("collisions");
export const loopEvents = createMapStore<TLoopEvent>("loopEvents");
export const events = createMapStore<TEvent>("events");
export const conditions = createMapStore<TCondition>("conditions");
