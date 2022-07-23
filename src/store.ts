import { writable } from "svelte/store";

interface Collisions {
  [id: number]: string;
}

function createCollisions() {
  const collisions: Collisions = {};
  const { subscribe, update } = writable(collisions);

  return {
    subscribe,
    addCollision: (rule: string) =>
      update((state) => {
        let id = Date.now();
        state[id] = rule;
        return state;
      }),
    updateCollision: (id: number, rule: string) =>
      update((state) => {
        state[id] = rule;
        return state;
      }),
    removeCollision: (id: number) => {
      update((state) => {
        delete state[id];
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
  isLoop: boolean;
  loop: Loop;
}

export interface Events {
  [id: number]: Event;
}

function createEvents() {
  const events: Events = {};
  const { subscribe, update } = writable(events);

  return {
    subscribe,
    addEvent: (event: Event) =>
      update((state) => {
        let id = Date.now();
        state[id] = event;
        return state;
      }),
    updateEvent: (id: number, event: Event) =>
      update((state) => {
        state[id] = event;
        return state;
      }),
    removeEvent: (id: number) =>
      update((state) => {
        delete state[id];
        // TODO: Fix not removing
        console.log(state);
        return state;
      }),
  };
}

export interface Condition {
  a: string;
  b: string;
  eventID: number;
  once: boolean;
}

interface Conditions {
  [id: number]: Condition;
}

function createConditions() {
  const conditions: Conditions = {};
  const { subscribe, update } = writable(conditions);

  return {
    subscribe,
    addCondition: (condition: Condition) =>
      update((state) => {
        let id = Date.now();
        state[id] = condition;
        return state;
      }),
    updateCondition: (id: number, condition: Condition) =>
      update((state) => {
        console.log("updated condition");
        console.log(condition);
        state[id] = condition;
        return state;
      }),
    removeCondition: (id: number) =>
      update((state) => {
        delete state[id];
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
  items: {
    [id: number]: Emoji;
  };
  backgrounds: {
    [index: number]: string;
  };
  objective: string;
}

function createEditableMap() {
  const map: EditableMap = { items: {}, backgrounds: {}, objective: "" };
  const { subscribe, update } = writable(map);

  return {
    subscribe,
    updateBackground: (index: number, color: string) =>
      update((state) => {
        state.backgrounds[index] = color;
        return state;
      }),
    deleteBackground: (index: number) =>
      update((state) => {
        delete state.backgrounds[index];
        return state;
      }),
    addEmoji: (obj: Emoji) =>
      update((state: EditableMap) => {
        state.items[obj.index] = obj;
        return state;
      }),
    removeEmoji: (index: number) =>
      update((state: EditableMap) => {
        delete state.items[index];
        return state;
      }),
  };
}

function createStaticItems() {
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

function createColorPalette() {
  const colors: Array<string> = [];
  const { subscribe, update } = writable(colors);

  return {
    subscribe,
    addColor: (color: string) =>
      color != "" &&
      update((state) => {
        if (state.includes(color)) return state;
        state.push(color);
        return state;
      }),
    removeColor: (color: string) =>
      update((state) => {
        state = state.filter((el) => el != color);
        console.log(state);
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
export const staticItems = createStaticItems();
export const colorPalette = createColorPalette();
