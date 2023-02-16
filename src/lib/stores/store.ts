import { writable, get } from "svelte/store";
import { Rulebox, type RuleboxType } from "../types/types";

function createRuleboxes() {
  const arr: Array<Rulebox> = [];
  const { set, subscribe, update } = writable(arr);

  return {
    set,
    subscribe,
    update,
    useStorage: (id: string) => {
      const val = JSON.parse(localStorage.getItem(id + "_rbxs") as string);

      set(val || []);
      subscribe((state) => {
        localStorage.setItem(id + "_rbxs", JSON.stringify(Array.from(state)));
      });
    },

    spawn(component: RuleboxType, position: { x: number; y: number }): number {
      let id = 0;

      update((state) => {
        state = state.filter((rbx) => rbx.type != "ctxMenu");
        id = Math.max(...state.map((rbx) => rbx.id), 0) + 1;
        state.push(new Rulebox(id, component, position));
        return state;
      });

      return id;
    },
    remove: (id: number) =>
      update((state) => {
        state = state.filter((rbx) => rbx.id != id);
        return state;
      }),
    removeCtxMenu: () =>
      update((state) => {
        state = state.filter((rbx) => rbx.type != "ctxMenu");
        return state;
      }),
    adjustHeight: (id: number, sequenceLength: number, defaultHeight: number) =>
      update((state) => {
        for (let rbx of state) {
          if (rbx.id == id) {
            rbx.height = defaultHeight + sequenceLength * 56;
            break;
          }
        }
        return state;
      }),
  };
}

export const backgroundStore = writable(true);
export const movementStore = writable(true);
export const rbxSelected = writable(false);
export const rbxIdSelected = writable(-1);
export const d3Scale = writable(1);
export const rbxStore = createRuleboxes();

export const onMouseMove = (e: any, rbxID: number) => {
  rbxStore.update((rbx) => {
    rbx.forEach((rbx: Rulebox) => {
      if (rbx.id === rbxID) {
        //retrieve d3Scale value from store
        const scale = get(d3Scale);
        // divide the movement value by scale to keep it proportional to d3Zoom transformations
        rbx.position.x += e.movementX / scale;
        rbx.position.y += e.movementY / scale;
      }
    });
    return [...rbx];
  });
};

// This is the function handler for the touch event on mobile to select a rbx.
export const onTouchMove = (e: any, rbxID: number) => {
  rbxStore.update((rbx) => {
    rbx.forEach((rbx: Rulebox) => {
      if (rbx.id === rbxID) {
        //calculates the location of the selected rbx
        const { x, y, width, height } = e.target.getBoundingClientRect();
        const offsetX =
          ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
        const offsetY =
          ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;
        // centers the rbx consistently under the user's touch
        rbx.position.x += offsetX - rbx.width / 2;
        rbx.position.y += offsetY - rbx.height / 2;
      }
    });
    return [...rbx];
  });
};
// if the user clicks a rbx without moving it, this function fires allowing a user to invoke the callback function
export const onRuleboxClick = (e: any, rbxID: number) => {
  get(rbxStore).forEach((rbx) => {
    if (rbx.id === get(rbxIdSelected)) {
      rbx.clickCallback?.(rbx);
    }
  });
};
