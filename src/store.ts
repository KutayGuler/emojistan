import { writable } from "svelte/store";

interface Collisions {
  [id: string]: string;
}

function createCollisions() {
  const collisions: Collisions = {};
  const { subscribe, update } = writable(collisions);

  return {
    subscribe,
    addCollision: (rule: string) =>
      update((state) => {
        let id = Date.now().toString();
        state[id] = rule;
        return state;
      }),
    updateCollision: (id: string, rule: string) =>
      update((state) => {
        state[id] = rule;
        return state;
      }),
    removeCollision: (id: string) => {
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
  loop?: Loop;
}

export interface Events {
  [id: string]: Event;
}

function createEvents() {
  const events: Events = {};
  const { subscribe, update } = writable(events);

  return {
    subscribe,
    addEvent: (event: Event) =>
      update((state) => {
        let id = Date.now().toString();
        state[id] = event;
        return state;
      }),
    updateEvent: (id: string, event: Event) =>
      update((state) => {
        state[id] = event;
        return state;
      }),
    removeEvent: (id: string) =>
      update((state) => {
        delete state[id];
        console.log(state);
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

interface Conditions {
  [id: string]: Condition;
}

function createConditions() {
  const conditions: Conditions = {};
  const { subscribe, update } = writable(conditions);

  return {
    subscribe,
    addCondition: (condition: Condition) =>
      update((state) => {
        let id = Date.now().toString();
        state[id] = condition;
        return state;
      }),
    updateCondition: (id: string, condition: Condition) =>
      update((state) => {
        state[id] = condition;
        return state;
      }),
    removeCondition: (id: string) =>
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
export const statics = createStatics();
export const interactables = createInteractables();
export const colorPalette = createColorPalette();
