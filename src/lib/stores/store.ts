import { writable, derived, get } from "svelte/store";
import { Node, type Edge, type NodeComponent } from "../types/types";
import { GRAPH_SIZE } from "../../constants";

function createNodes() {
  const arr: Array<Node> = [];
  const { set, subscribe, update } = writable(arr);

  return {
    set,
    subscribe,
    update,
    useStorage: (id: string) => {
      // @ts-expect-error
      const val = JSON.parse(localStorage.getItem(id + "_nodes"));

      set(val || []);
      subscribe((state) => {
        localStorage.setItem(id + "_nodes", JSON.stringify(Array.from(state)));
      });
    },

    spawn(
      component: NodeComponent,
      position: { x: number; y: number }
    ): number {
      let id = 0;

      update((state) => {
        state = state.filter((n) => n.component != "ctxMenu");
        id = Math.max(...state.map((n) => n.id), 0) + 1;
        state.push(new Node(id, component, position));
        return state;
      });

      return id;
    },
    remove: (id: number) =>
      update((state) => {
        state = state.filter((n) => n.id != id);
        return state;
      }),
    removeSpawner: () =>
      update((state) => {
        state = state.filter((n) => n.component != "ctxMenu");
        return state;
      }),
    adjustHeight: (id: number, sequenceLength: number, defaultHeight: number) =>
      update((state) => {
        for (let node of state) {
          if (node.id == id) {
            node.height = defaultHeight + sequenceLength * 56;
            break;
          }
        }
        return state;
      }),
  };
}

export const widthStore = writable(GRAPH_SIZE);
export const heightStore = writable(GRAPH_SIZE);
export const backgroundStore = writable(true);
export const movementStore = writable(true);
export const nodeSelected = writable(false);
export const nodeIdSelected = writable(-1);
export const d3Scale = writable(1);
export const nodesStore = createNodes();

export const onMouseMove = (e: any, nodeID: number) => {
  nodesStore.update((n) => {
    n.forEach((node: Node) => {
      if (node.id === nodeID) {
        //retrieve d3Scale value from store
        const scale = get(d3Scale);
        // divide the movement value by scale to keep it proportional to d3Zoom transformations
        node.position.x += e.movementX / scale;
        node.position.y += e.movementY / scale;
      }
    });
    return [...n];
  });
};

// This is the function handler for the touch event on mobile to select a node.
export const onTouchMove = (e: any, nodeID: number) => {
  nodesStore.update((n) => {
    n.forEach((node: Node) => {
      if (node.id === nodeID) {
        //calculates the location of the selected node
        const { x, y, width, height } = e.target.getBoundingClientRect();
        const offsetX =
          ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
        const offsetY =
          ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;
        // centers the node consistently under the user's touch
        node.position.x += offsetX - node.width / 2;
        node.position.y += offsetY - node.height / 2;
      }
    });
    return [...n];
  });
};
// if the user clicks a node without moving it, this function fires allowing a user to invoke the callback function
export const onNodeClick = (e: any, nodeID: number) => {
  get(nodesStore).forEach((node) => {
    if (node.id === get(nodeIdSelected)) {
      node.clickCallback?.(node);
    }
  });
};
