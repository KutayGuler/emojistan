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
      position: { x: number; y: number },
      receiver: boolean = false
    ): number {
      let id = 0;

      update((state) => {
        state = state.filter((n) => n.component != "spawner");
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
        state = state.filter((n) => n.component != "spawner");
        return state;
      }),
    adjustHeight: (id: number, sequenceLength: number, defaultHeight: number) =>
      update((state) => {
        for (let node of state) {
          if (node.id == id) {
            node.height = defaultHeight + sequenceLength * 64;
            break;
          }
        }
        return state;
      }),
  };
}

function createEdges() {
  const arr: Array<Edge> = [];
  const { set, subscribe, update } = writable(arr);

  return {
    set,
    subscribe,
    update,
    useStorage: (id: string) => {
      // @ts-expect-error
      const val = JSON.parse(localStorage.getItem(id + "_edges"));

      set(val || []);
      subscribe((state) => {
        localStorage.setItem(id + "_edges", JSON.stringify(Array.from(state)));
      });
    },
    add: (sourceID: number, targetID: number) =>
      update((state) => {
        state.push({
          id: `e${sourceID}-${targetID}`,
          source: sourceID,
          target: targetID,
        });
        return state;
      }),
    remove: (edgeID: string) =>
      update((state) => {
        state = state.filter((e) => e.id != edgeID);
        return state;
      }),
    filter: (nodeID: number) =>
      update((state) => {
        state = state.filter((e) => !e.id.includes(nodeID.toString()));
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
export const edgesStore = createEdges();
export const derivedEdges = derived(
  [nodesStore, edgesStore],
  ([$nodesStore, $edgesStore]) => {
    $edgesStore.forEach((edge: any) => {
      // any -> edge should follow type DerivedEdge, but we are assigning to any so the typing meshes together

      // These are dummy nodes to resolve a typescripting issue. They are overwritten in the following forEach loop
      // @ts-expect-error
      let sourceNode: Node = {
        id: 0,
        position: { x: 25, y: 475 },
        data: { label: "9" },
        width: 175,
        height: 40,
        targetPosition: "right",
        sourcePosition: "left",
      };

      // @ts-expect-error
      let targetNode: Node = {
        id: 10,
        position: { x: 750, y: 475 },
        data: { label: "10" },
        width: 175,
        height: 40,
        targetPosition: "right",
        sourcePosition: "left",
      };

      $nodesStore.forEach((node: Node) => {
        if (edge.source === node.id) sourceNode = node;
        if (edge.target === node.id) targetNode = node;
      });

      if (sourceNode) {
        //left side of the node selected
        let left = sourceNode.position.x;
        //top of the node selected
        let top = sourceNode.position.y;
        //declaring the middle point of the node
        let middle = sourceNode.width / 2;

        //Default sourcePosition to bottom if sourcePosition not defined
        if (
          sourceNode.sourcePosition === "bottom" ||
          sourceNode.sourcePosition === undefined
        ) {
          //the x coordinate of the middle of the node
          edge.sourceX = left + middle;
          //the y coordinate of the bottom of the node
          edge.sourceY = top + sourceNode.height;
          //assign sourcePosition to the edge for usage in the various edge components
          edge.sourcePosition = "bottom";
        } else if (sourceNode.sourcePosition === "top") {
          edge.sourceX = left + middle;
          edge.sourceY = top;
          edge.sourcePosition = sourceNode.sourcePosition;
        } else if (sourceNode.sourcePosition === "left") {
          edge.sourceX = left;
          edge.sourceY = top + sourceNode.height / 2;
          edge.sourcePosition = sourceNode.sourcePosition;
        } else if (sourceNode.sourcePosition === "right") {
          edge.sourceX = left + sourceNode.width;
          edge.sourceY = top + sourceNode.height / 2;
          edge.sourcePosition = sourceNode.sourcePosition;
        }
      }
      if (targetNode) {
        //left side of the node selected
        let left = targetNode.position.x;
        //top of the node selected
        let top = targetNode.position.y;
        //declaring the middle point of the node
        let middle = targetNode.width / 2;

        //Default to top targetPosition if targetPosition undefined
        if (
          targetNode.targetPosition === "top" ||
          targetNode.targetPosition === undefined
        ) {
          //the x coordinate of the middle of the node
          edge.targetX = left + middle;
          //the y coordinate of the bottom of the node
          edge.targetY = top;
          //assign sourcePosition to the edge for usage in the various edge components
          edge.targetPosition = "top";
        } else if (targetNode.targetPosition === "bottom") {
          edge.targetX = left + middle;
          edge.targetY = top + targetNode.height;
          edge.targetPosition = targetNode.targetPosition;
        } else if (targetNode.targetPosition === "left") {
          edge.targetX = left;
          edge.targetY = top + targetNode.height / 2;
          edge.targetPosition = targetNode.targetPosition;
        } else if (targetNode.targetPosition === "right") {
          edge.targetX = left + targetNode.width;
          edge.targetY = top + targetNode.height / 2;
          edge.targetPosition = targetNode.targetPosition;
        }
      }
    });
    return [...$edgesStore];
  }
);

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
