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

export interface Orderable {
  order?: number;
}

export interface TEvent extends Orderable {
  name: string;
  sequence: Array<SequenceItem>;
  loop?: Loop;
}

export interface TLoopEvent extends Orderable {
  name: string;
  sequence: Array<SequenceItem>;
  loop: Loop;
}

export interface TCondition extends Orderable {
  a: string;
  b: string;
  _b: string | "any";
  eventID: string;
}

export interface TPush extends Orderable {
  rule: Array<string>;
}

export interface TCollision extends Orderable {
  rule: Array<string>;
}

// export interface TThrowable {
//   throwable: string;
//   range: number;
//   speed: number;
// }

// export interface TWeapon {
//   weapon: string;
//   speed: number;
// }

export interface Emoji {
  emoji: string;
  inventory?: Array<any>;
}

function createMapStore<T>(_state: Map<string, T>) {
  const { set, subscribe, update } = writable(_state);

  return {
    set,
    subscribe,
    add: (value: T) =>
      update((state) => {
        Object.assign(value, { order: state.size + 1 });
        console.log(value);
        let id = Date.now().toString().slice(7);
        state.set(id, value);
        console.log(state);
        return state;
      }),
    update: (id: string, value: T) =>
      update((state) => {
        state.set(id, value);
        return state;
      }),
    updateValue: (id: string, key: string, value: T) =>
      update((state) => {
        // @ts-expect-error
        state.get(id)[key] = value;
        return state;
      }),
    remove: (id: string) =>
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
  });

  return {
    set,
    subscribe,
    useStorage: () => {
      const current = localStorage.getItem("currentSave");
      const saves = JSON.parse(localStorage.getItem("saves"));

      update((state) => {
        if (saves != undefined) {
          state.saves = new Map(saves);
        }
        if (current != undefined) {
          state.current = current;
        }
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
    items: new Map<number, any>(),
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
      console.log(items, objective, backgrounds);

      // TODO: Add save id

      update((state) => {
        if (objective != undefined) {
          state.objective = objective;
        }
        if (items != undefined) {
          state.items = new Map(items);
        }
        if (backgrounds != undefined) {
          state.backgrounds = new Map(backgrounds);
        }
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
    addEmoji: (index: number, obj: Emoji) =>
      update((state) => {
        state.items.set(index, obj);
        return state;
      }),
    removeEmoji: (index: number) =>
      update((state) => {
        console.log(state);
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

function createSetStore() {
  const { subscribe, update } = writable(new Set<string>());

  return {
    subscribe,
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

export type ModalType =
  | "keyboardPlay"
  | "keyboardEditor"
  | "pushes"
  | "merges"
  | "conditions"
  | "events"
  | "statics"
  | "weapons"
  | "throwables"
  | "palette";

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

export const statics = createSetStore();
export const quickAccess = createSetStore();
export const colorPalette = createSetStore();

export const map = createEditableMap();

export const pushes = createMapStore<TCollision>(new Map<string, TCollision>());
export const merges = createMapStore<TCollision>(new Map<string, TCollision>());
// export const weapons = createMapStore<Orderable>(new Map<string, Orderable>());
// export const throwables = createMapStore<Orderable>(
//   new Map<string, Orderable>()
// );

export const collisions = createMapStore<TCollision>(
  new Map<string, TCollision>()
);
export const loopEvents = createMapStore<TLoopEvent>(
  new Map<string, TLoopEvent>()
);
export const events = createMapStore<TEvent>(new Map<string, TEvent>());
export const conditions = createMapStore<TCondition>(
  new Map<string, TCondition>()
);
