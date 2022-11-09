import Dexie, { type Table } from "dexie";
import type { TCollision, TCondition, TEvent, TLoopEvent } from "./store";

export interface Save {
  id: number;
  items: Map<number, any>;
  backgrounds: Map<number, string>;
  objective: string;
  statics: Set<string>;
  palette: Set<string>;
  merges: Map<number, TCollision>;
  pushes: Map<number, TCollision>;
  events: Map<number, TEvent>;
  loopEvents: Map<number, TLoopEvent>;
  conditions: Map<number, TCondition>;
}

export class MySubClassedDexie extends Dexie {
  saves!: Table<Save>;

  constructor() {
    super("emojistan");
    this.version(1).stores({
      saves:
        "&id, statics, merges, pushes, backgrounds, objective, events, loopEvents, items, palette",
    });
  }
}

export const db = new MySubClassedDexie();

// TODO: save stores on local state and storage
// TODO: Experiment on dexiejs
