import { writable } from "svelte/store";

export function canMove(keyCode: number, index: number) {
  if (keyCode == 37 && index % 16 == 0) return 0;
  if (keyCode == 38 && index < 16) return 0;
  if (keyCode == 39 && (index + 1) % 16 == 0) return 0;
  if (keyCode == 40 && index >= 240) return 0;
  return (keyCode % 2 == 0 ? 16 : 1) * (keyCode >= 39 ? 1 : -1);
}

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
}

function createEvents() {
  const events: Events = { collisions: {} };
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

interface Emoji {
  index: number;
  emoji: string;
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

interface PlayableMap {
  items: {
    [id: number]: Emoji;
  };
}

function createPlayableMap() {
  const map: PlayableMap = { items: {} };
  const { subscribe, update } = writable(map);

  return {
    subscribe,
    // TODO: Add a movement mode switcher
    moveEmoji: (keyCode: number, index: number) =>
      update((state: PlayableMap) => {
        if (state.items[index] == undefined) return state;

        let { emoji } = state.items[index as keyof typeof state.items];
        let operation = canMove(keyCode, index);
        if (operation == 0) return state;

        index += operation; // mutating arg
        if (state.items[index]) {
          console.log("collision");
          // TODO: Collision
        }
        state.items[index] = { index, emoji };
        delete state.items[index];
        return state;
      }),
  };
}

export const hasEmptySlot = writable(false);
export const currentEmoji = writable("");
export const events = createEvents();
export const editableMap = createEditableMap();
export const playableMap = createPlayableMap();
