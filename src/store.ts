import { writable } from "svelte/store";

interface Events {
  collisions: {
    [id: number]: string;
  };
}

function createEvents() {
  const events: Events = { collisions: {} };
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
}

function createEditableMap() {
  const map: EditableMap = { items: {}, backgrounds: {} };
  const { subscribe, update } = writable(map);

  return {
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

export const hasEmptySlot = writable(false);
export const currentEmoji = writable("");
export const events = createEvents();
export const editableMap = createEditableMap();
