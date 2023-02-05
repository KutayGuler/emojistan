import { DEFAULT_BG } from "./constants";

export type Pusher = [string, string, CollisionType];
export type Merger = [string, string, CollisionType];

export type CollisionType = "bump" | "push" | string;

export interface HP {
  current: number;
  max: number;
  add(points: number): void;
}

export class HP {
  constructor(points: number) {
    this.current = points;
    this.max = points;
  }

  add(points: number) {
    this.current += points;
    if (this.current > this.max) {
      this.max = this.current;
    }
  }
}

// TODO: Integrate equippables to push/merge

export interface Item {
  emoji: string;
  inventory: Array<Equippable>;
  hp: HP;
}

export class Item {
  constructor(
    emoji: string,
    inventory: Array<Equippable> | [] = [],
    hpPoints: number = 1
  ) {
    this.emoji = emoji;
    this.inventory = inventory;
    this.hp = new HP(hpPoints);
  }
}

export interface Equippable {
  emoji: string;
  hp: number;
}

export class Equippable {
  constructor(emoji: string, hp: number) {
    this.emoji = emoji;
    this.hp = hp; // hp of item itself
  }
}

export interface Consumable {
  emoji: string;
  hp: number; // add to consumer hp
  mutateConsumerTo: string;
}

export class Consumable {
  constructor(emoji: string, hp: number, mutateConsumerTo = "") {
    this.emoji = emoji;
    this.hp = hp;
    this.mutateConsumerTo = mutateConsumerTo;
  }
}

export interface _Consumable {
  emoji: string;
  hp: number;
  mutateConsumerTo: string;
}

export interface _Consumables {
  [key: string]: _Consumable;
}

export interface _Interactable {
  executing: boolean;
  sequence: Array<SequenceItem>;
  points: number;
  hp: number;
  modifiers: Array<[string, number]>;
  evolve: Evolve;
  devolve: Devolve;
}

export interface _Interactables {
  [key: string]: _Interactable;
}

export interface _Collisions {
  [key1: string]: {
    [key2: string]: CollisionType;
  };
}

export interface Mutations {
  paint(
    { index, background }: { index: number; background: string },
    _start?: number
  ): void;
  erase({ index }: { index: number }): void;
  spawn(
    { index, emoji }: { index: number; emoji: string },
    _start?: number
  ): void;
  destroy({ index }: { index: number }): void;
  wait(duration: number): Promise<any>;
  dropEquippable({ emoji }: { emoji: string }): void;
  resetLevel: Function;
  completeLevel: Function;
}

export interface EditableMap {
  items: Map<number, string>;
  backgrounds: Map<number, string>;
  objective: string;
  dbg: string;
}

export class EditableMap {
  constructor(items = new Map<number, string>()) {
    this.items = items;
    this.backgrounds = new Map<number, string>();
    this.objective = "";
    this.dbg = DEFAULT_BG;
  }
}

export interface SequenceItem {
  type: keyof Mutations;
  index: number;
  background: string;
  duration: number;
  points: number;
  emoji: string;
}

export class SequenceItem {
  constructor(
    type: keyof Mutations,
    index: number,
    background: string,
    duration: number,
    points: number,
    emoji: string
  ) {
    this.type = type;
    this.index = index;
    this.background = background;
    this.duration = duration;
    this.points = points;
    this.emoji = emoji;
  }
}

export interface Evolve {
  enabled: boolean;
  to: string;
  at: number;
}

export class Evolve {
  constructor(enabled: boolean, to: string, at: number) {
    this.enabled = enabled;
    this.to = to;
    this.at = at;
  }
}

export interface Devolve {
  enabled: boolean;
  to: string;
}

export class Devolve {
  constructor(enabled: boolean, to: string) {
    this.enabled = enabled;
    this.to = to;
  }
}

export interface Interactable {
  emoji: string;
  sequence: Array<SequenceItem>;
  points: number;
  hp: number;
  modifiers: Array<[string, number]>;
  isStatic: boolean;
  evolve: Evolve;
  devolve: Devolve;
}

export class Interactable {
  constructor(
    emoji: string,
    sequence: Array<SequenceItem>,
    hp: number,
    points: number,
    modifiers: Array<[string, number]>,
    isStatic: boolean,
    evolve: Evolve,
    devolve: Devolve
  ) {
    this.emoji = emoji;
    this.sequence = sequence;
    this.hp = hp;
    this.points = points;
    this.modifiers = modifiers;
    this.isStatic = isStatic;
    this.evolve = evolve;
    this.devolve = devolve;
  }
}

export type Wasd = "KeyW" | "KeyA" | "KeyS" | "KeyD";
export type ArrowKey = "ArrowLeft" | "ArrowUp" | "ArrowRight" | "ArrowDown";
