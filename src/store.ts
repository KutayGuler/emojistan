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

export interface Event {
  name: string;
  sequence: Array<SequenceItem>;
  loop?: Loop;
}

export interface Condition {
  a: string;
  b: string;
  _b: string | "any";
  eventID: string;
}

export interface Emoji {
  emoji: string;
  inventory?: Array<any>;
}

interface EditableMap {
  items: Map<number, Emoji>;
  backgrounds: Map<number, string>;
  objective: string;
}

function createMapStore<T>(_state: Map<string, T>) {
  const { subscribe, update } = writable(_state);

  return {
    subscribe,
    add: (value: T) =>
      update((state) => {
        let id = Date.now().toString().slice(7);

        state.set(id, value);
        return state;
      }),
    update: (id: string, value: T) =>
      update((state) => {
        state.set(id, value);
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
  const map: EditableMap = {
    items: new Map(),
    backgrounds: new Map(),
    objective: "",
  };
  const { subscribe, update } = writable(map);

  return {
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

function createStatics() {
  const { subscribe, update } = writable(new Set<string>());

  return {
    subscribe,
    toggleEmoji: (emoji: string, operation?: string) =>
      emoji != "" &&
      update((state) => {
        if (operation == "add") {
          state.add(emoji);
        } else {
          state.delete(emoji);
        }
        return state;
      }),
  };
}

function createColorPalette() {
  const { subscribe, update } = writable(new Set<string>());

  return {
    subscribe,
    addColor: (color: string) =>
      color != "" &&
      update((state) => {
        state.add(color);
        return state;
      }),
    removeColor: (color: string) =>
      update((state) => {
        state.delete(color);
        return state;
      }),
  };
}

function createInventory() {
  const { subscribe, update } = writable(["🎮", "", "🎮", ""]);

  return {
    subscribe,
    addItem: (item: string) =>
      update((state) => {
        if (!state.includes("")) {
          state[state.indexOf("")] = item;
        }
        return state;
      }),
    removeItemAt: (index: number) =>
      update((state) => {
        state[index] = "";
        return state;
      }),
  };
}

function createQuickAccess() {
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
        console.log("show");
        state.type = type;
        state.open = true;
        console.log(state);
        return state;
      }),
    close: () =>
      update((state) => {
        console.log("close");
        state.open = false;
        return state;
      }),
  };
}

export const modal = createModal();
export const quickAccess = createQuickAccess();

export const currentItem = writable("");
export const currentColor = writable("");
export const currentEmoji = writable("");
export const inventory = createInventory();
export const colorPalette = createColorPalette();
export const editableMap = createEditableMap();
export const statics = createStatics();
export const collisions = createMapStore<Array<string>>(
  new Map<string, Array<string>>()
);
export const events = createMapStore<Event>(new Map<string, Event>());
export const conditions = createMapStore<Condition>(
  new Map<string, Condition>()
);
