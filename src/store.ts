import { page } from "$app/stores";
import { writable, get } from "svelte/store";
import { DEFAULT_BG } from "./constants";

export interface Mutations {
  setBackgroundOf: (
    { index, background }: { index: number; background: string },
    _start?: number
  ) => void;
  removeBackgroundOf: ({ index }: { index: number }) => void;
  trailBackground: (
    {
      index,
      background,
      iterationNumber,
    }: {
      index: number;
      background: string;
      iterationNumber: number;
    },
    _start?: number
  ) => void;
  spawn: (
    { index, emoji }: { index: number; emoji: string },
    _start?: number
  ) => void;
  destroy: ({ index }: { index: number }) => void;
  trail: (
    {
      index,
      emoji,
      iterationNumber,
    }: { index: number; emoji: string; iterationNumber: number },
    _start?: number
  ) => void;
  wait: (duration: number) => Promise<any>;
  // TODO: new stuff
  freezePlayer: Function;
  unfreezePlayer: Function;
  transformPlayer: Function;
  teleportPlayerTo: ({ index }: { index: number }) => void;
  increasePlayerHealthBy: (num: number) => void;
  decreasePlayerHealthBy: (num: number) => void;
  increaseInteractedHealthBy: (num: number) => void;
  decreaseInteractedHealthBy: (num: number) => void;
  addItem: (item: string) => void;
  consumeItem: (item: string) => void;
  // ##### new stuff

  resetLevel: Function;
  completeLevel: Function;
}

export interface SequenceItem {
  type: keyof Mutations;
  index: number;
  background: string;
  duration: number;
  emoji: string;
}

export class SequenceItem {
  constructor(
    type: keyof Mutations,
    index: number,
    background: string,
    duration: number,
    emoji: string
  ) {
    this.type = type;
    this.index = index;
    this.background = background;
    this.duration = duration;
    this.emoji = emoji;
  }
}

export interface Loop {
  start: number;
  end: number;
  iterationNumber: number;
  iterationType: "increment" | "decrement";
  timeGap: number;
  reverse: boolean;
}

export interface TLoopEvent {
  sequence: Array<SequenceItem>;
  loop: Loop;
}

export type A = "playerBackground" | "playerInteractsWith";

export interface Condition {
  a: A;
  b: string;
  eventID: number;
}

export class Condition {
  constructor(a: A, b: string, eventID: number) {
    this.a = a;
    this.b = b;
    this.eventID = eventID;
  }
}

function createMapStore<T>(name: string) {
  const { set, subscribe, update } = writable(new Map<number, T>());

  return {
    set,
    subscribe,
    useStorage: (id: string) => {
      // @ts-expect-error
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

  // if logged in, save on server
  // if not, save on localstorage

  return {
    set,
    subscribe,
    useStorage: () => {
      const current = localStorage.getItem("currentSave");
      // @ts-expect-error
      const saves = JSON.parse(localStorage.getItem("saves"));

      if (get(page).routeId == "editor" && (current == "" || current == null)) {
        return false;
      }

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

      return true;
    },
    rename: (id: string, title: string) =>
      update((state) => {
        state.saves.set(id, title);
        return state;
      }),
    add: () =>
      update((state) => {
        let id = (Math.random() + 1).toString(36).substring(7);
        state.current = id;
        state.saves.set(id, "Island #" + id);
        return state;
      }),
    delete: (id: string) =>
      update((state) => {
        for (let store of [
          "pushes",
          "merges",
          "events",
          "conditions",
          "loopEvents",
          "palette",
          "statics",
          "items",
          "backgrounds",
          "objective",
          "nodes",
          "edges",
          "dbg",
        ]) {
          localStorage.removeItem(id + "_" + store);
        }
        state.current = "";
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
    dbg: DEFAULT_BG,
  });

  return {
    set,
    subscribe,
    useStorage: (id: string) => {
      const objective = localStorage.getItem(id + "_objective");
      const dbg = localStorage.getItem(id + "_dbg") || DEFAULT_BG;
      // @ts-expect-error
      const items = JSON.parse(localStorage.getItem(id + "_items"));
      // @ts-expect-error
      const backgrounds = JSON.parse(localStorage.getItem(id + "_backgrounds"));

      update((state) => {
        state.objective = objective || "";
        state.items = new Map(items) || new Map();
        state.backgrounds = new Map(backgrounds) || new Map();
        state.dbg = dbg || "";
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
        localStorage.setItem(id + "_dbg", state.dbg);
      });
    },
    updateDbg: (color: string) =>
      update((state) => {
        state.dbg = color;
        return state;
      }),
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

    filterBackgrounds: () =>
      update((state) => {
        for (let [id, color] of state.backgrounds) {
          if (color == state.dbg) state.backgrounds.delete(id);
        }
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
      // @ts-expect-error
      const val = JSON.parse(localStorage.getItem(id + "_" + name));
      set(new Set<string>(Array.from(val || [])));
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

// VANILLA
export const currentItem = writable("");
export const currentColor = writable("");
export const currentEmoji = writable("");

// CUSTOM
export const saves = createSaves();
export const map = createEditableMap();

// SETS
export const statics = createSetStore("statics");
export const palette = createSetStore("palette");

// MAPS
export const pushes = createMapStore<Array<string>>("pushes");
export const merges = createMapStore<Array<string>>("merges");
export const loopEvents = createMapStore<TLoopEvent>("loopEvents");
export const events = createMapStore<Array<SequenceItem>>("events");
export const conditions = createMapStore<Condition>("conditions");
