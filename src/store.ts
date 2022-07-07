import { writable } from "svelte/store";

interface Events {
  collisions: {
    [id: number]: string;
  };
  conditions: {
    [id: number]: string;
  };
}

function createEvents() {
  const events: Events = { collisions: {}, conditions: {} };
  const { subscribe, update, set } = writable(events);

  // TODO: merging should be both ways
  // TODO: Conditions

  return {
    set,
    subscribe,
    addCollision: (rule: string) =>
      update((state: Events) => {
        let id = Date.now();
        state.collisions[id] = rule;
        return state;
      }),
    updateCollision: (id: number, rule: string) =>
      update((state: Events) => {
        state.collisions[id] = rule;
        return state;
      }),

    removeCollision: (id: number) => {
      update((state: Events) => {
        console.log(state.collisions);
        delete state.collisions[id];
        console.log(state.collisions);

        return state;
      });
    },
  };
}

export interface Emoji {
  index: number;
  emoji: string;
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
  const { subscribe, update, set } = writable(map);

  return {
    set,
    subscribe,
    updateBackground: (index: number, color: string) =>
      update((state) => {
        state.backgrounds[index] = color;
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
    addEmoji: (emoji: string) =>
      update((state) => {
        if (state.includes(emoji)) return state;
        state.push(emoji);
        return state;
      }),
    removeEmoji: (emoji: string) =>
      update((state) => {
        state.filter((el) => el != emoji);
        console.log(state);
        return state;
      }),
  };
}

// TODO: Add color palette (default background etc)

export const hasEmptySlot = writable(false);
export const currentEmoji = writable("");
export const staticItems = createStaticItems();
export const events = createEvents();
export const editableMap = createEditableMap();
