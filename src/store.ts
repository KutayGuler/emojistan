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

function createEditableMap() {
  const { set, subscribe, update } = writable({
    items: new Map<number, any>(),
    backgrounds: new Map<number, string>(),
    objective: "",
  });

  return {
    set,
    subscribe,
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
  | "keyboard"
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
    type: "keyboard",
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

export const statics = createSetStore();
export const quickAccess = createSetStore();
export const colorPalette = createSetStore();

export const map = createEditableMap();
// export const mapItems = derived(map, ($map) => $map.items);

export const pushes = createMapStore<TCollision>(new Map<string, TCollision>());
export const merges = createMapStore<TCollision>(new Map<string, TCollision>());
export const weapons = createMapStore<Orderable>(new Map<string, Orderable>());
export const throwables = createMapStore<Orderable>(
  new Map<string, Orderable>()
);

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
