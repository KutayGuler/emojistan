import Dexie from "dexie";

export const db = new Dexie("emojistan");
db.version(4).stores({
  saves:
    "&id, statics, merges, pushes, backgrounds, objective, events, loopEvents, items, cp",
});
