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

interface Emoji {
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

function canMove(keyCode: number, index: number) {
  if (keyCode == 37 && index % 16 == 0) return 0;
  if (keyCode == 38 && index < 16) return 0;
  if (keyCode == 39 && (index + 1) % 16 == 0) return 0;
  if (keyCode == 40 && index >= 240) return 0;
  return (keyCode % 2 == 0 ? 16 : 1) * (keyCode >= 39 ? 1 : -1);
}

interface PlayableMap {
  items: {
    [id: number]: Emoji;
  };
  activeCell: number;
  ghost: boolean;
}

function createPlayableMap() {
  const map: PlayableMap = { items: {}, activeCell: 0, ghost: false };
  const { subscribe, update } = writable(map);

  return {
    subscribe,
    toggleGhost: () =>
      update((_s) => {
        _s.ghost = !_s.ghost;
        return _s;
      }),
    loadItems: (_items: any) =>
      update((state) => {
        state.items = _items;
        return state;
      }),
    moveEmoji: (keyCode: number) =>
      update((_s: PlayableMap) => {
        // TODO: Ghost mode
        let ac = _s.activeCell;
        if (_s.items[_s.activeCell] == undefined) return _s;
        let operation = canMove(keyCode, ac);
        if (operation == 0) return _s;
        _s.activeCell += operation;

        let { emoji, behavior } = _s.items[ac];
        if (_s.items[ac + operation] !== undefined) {
          // TODO: Collision
          console.log("collision");

          let behaviorKey = _s.items[ac + operation].emoji;
          let collisionType = _s.items[ac].behavior[behaviorKey];
          switch (collisionType) {
            case "push":
              // TODO: If there is wall or bumpable, return
              // TODO: Cascade pushables
              _s.items[ac + operation * 2] = _s.items[ac + operation];
              _s.items[ac + operation] = _s.items[ac];
              delete _s.items[ac];

              console.log("push");
              return _s;
              break;
            default:
              // TODO: update behavior
              _s.items[ac + operation].emoji = collisionType;
              delete _s.items[ac];

              return _s;
          }
        }
        _s.items[ac + operation] = {
          index: ac + operation,
          emoji,
          behavior,
        };
        delete _s.items[ac];
        return _s;
      }),
  };
}

export const hasEmptySlot = writable(false);
export const currentEmoji = writable("");
export const events = createEvents();
export const editableMap = createEditableMap();
export const playableMap = createPlayableMap();
