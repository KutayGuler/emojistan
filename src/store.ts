import { writable } from "svelte/store";

// TODO: Convert objects to maps
// TODO: Convert the necessary arrays to sets

function createCollisions() {
  const { subscribe, update } = writable(new Map<string, string>());

  return {
    subscribe,
    addCollision: (rule: string) =>
      update((state) => {
        let id = Date.now().toString();
        state.set(id, rule);
        return state;
      }),
    updateCollision: (id: string, rule: string) =>
      update((state) => {
        state.set(id, rule);
        return state;
      }),
    removeCollision: (id: string) => {
      update((state) => {
        state.delete(id);
        return state;
      });
    },
  };
}

export interface QueueItem {
  type: string;
  background?: string;
  index?: number;
  duration?: number;
  emoji?: string;
}

export interface SetBackgroundOf extends QueueItem {
  index?: number;
  background?: string;
}

export interface Spawn extends QueueItem {
  index?: number;
  emoji?: string;
}

export interface Spawn extends QueueItem {
  duration?: number;
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
  queue: Array<QueueItem>;
  loop?: Loop;
}

function createEvents() {
  const { subscribe, update } = writable(new Map<string, Event>());

  return {
    subscribe,
    addEvent: (event: Event) =>
      update((state) => {
        let id = Date.now().toString();
        // state[id] = event;
        state.set(id, event);
        return state;
      }),
    updateEvent: (id: string, event: Event) =>
      update((state) => {
        // state[id] = event;
        state.set(id, event);
        console.log(state);
        return state;
      }),
    removeEvent: (id: string) =>
      update((state) => {
        // delete state[id];
        state.delete(id);
        return state;
      }),
  };
}

export interface Condition {
  a: string;
  b: string;
  eventID: string;
  once: boolean;
}

function createConditions() {
  const { subscribe, update } = writable(new Map<string, Condition>());

  return {
    subscribe,
    addCondition: (condition: Condition) =>
      update((state) => {
        let id = Date.now().toString();
        // state[id] = condition;
        state.set(id, condition);
        return state;
      }),
    updateCondition: (id: string, condition: Condition) =>
      update((state) => {
        // state[id] = condition;
        state.set(id, condition);
        return state;
      }),
    removeCondition: (id: string) =>
      update((state) => {
        // delete state[id];
        state.delete(id);
        return state;
      }),
  };
}

export interface Emoji {
  index: number;
  emoji: string;
  inventory?: Array<any>;
}

export interface Interactable extends Emoji {
  interact: Function;
}

interface EditableMap {
  items: Map<number, Emoji>;
  backgrounds: Map<number, string>;
  objective: string;
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
    addEmoji: (obj: Emoji) =>
      update((state: EditableMap) => {
        state.items.set(obj.index, obj);
        return state;
      }),
    removeEmoji: (index: number) =>
      update((state: EditableMap) => {
        state.items.delete(index);
        return state;
      }),
  };
}

function createStatics() {
  const statics: Array<string> = [];
  const { subscribe, update } = writable(statics);

  return {
    subscribe,
    toggleEmoji: (emoji: string, operation?: string) =>
      update((state) => {
        if (emoji == "") return state;
        if (operation == "add") {
          if (state.includes(emoji)) return state;
          state.push(emoji);
        } else if (state.includes(emoji)) {
          state = state.filter((el) => el != emoji);
        }
        return state;
      }),
  };
}

function createInteractables() {
  const interactables: Array<string> = [];
  const { subscribe, update } = writable(interactables);

  return {
    subscribe,
    toggleEmoji: (emoji: string, operation?: string) =>
      update((state) => {
        if (emoji == "") return state;
        if (operation == "add") {
          if (state.includes(emoji)) return state;
          state.push(emoji);
        } else if (state.includes(emoji)) {
          state = state.filter((el) => el != emoji);
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
        if (state.has(color)) return state;
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

export const hasEmptySlot = writable(false);
export const currentEmoji = writable("");
export const editableMap = createEditableMap();
export const collisions = createCollisions();
export const events = createEvents();
export const conditions = createConditions();
export const statics = createStatics();
export const interactables = createInteractables();
export const colorPalette = createColorPalette();
