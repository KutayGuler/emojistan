import { writable } from "svelte/store";

interface CollisionObject {
  emoji: string | null;
  destroy?: boolean;
}

// TODO: Use CollisionKey
export type CollisionKey = "input1" | "input2" | "output";

type Collision = {
  [key: string]: CollisionObject;
};

interface Events {
  collisions: {
    [id: number]: Collision;
  };
  bumpables: Array<String>;
}

function createEvents() {
  const events: Events = { collisions: {}, bumpables: ["🌲"] };
  const { subscribe, update, set } = writable(events);

  return {
    set,
    subscribe,
    addCollision: () =>
      update((state: Events) => {
        let id = Date.now();
        state.collisions[id] = {
          input1: { emoji: null, destroy: true },
          input2: { emoji: null, destroy: true },
          output: { emoji: null },
        };
        return state;
      }),
    removeCollision: (id: number) => {
      update((state: Events) => {
        delete state.collisions[id];
        return state;
      });
    },
  };
}

export interface Emoji {
  index: number;
  emoji: string;
  behavior: {
    [emoji: string]: string;
  };
}

interface EditableMap {
  items: {
    [id: number]: Emoji;
  };
}

function createEditableMap() {
  const map: EditableMap = { items: {} };
  const { subscribe, update } = writable(map);

  return {
    subscribe,
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
