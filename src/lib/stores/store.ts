import { writable, derived, get } from "svelte/store";
import type { Readable, Writable } from "svelte/store";
import { Node, type Edge, type NodeComponent } from "../types/types";
import { GRAPH_SIZE } from "../../constants";
import { conditions } from "$src/store";

// interface NodesStore<T> extends Writable<T> {
//   remove: (id: number) => void;
//   spawn: (
//     component: NodeComponent,
//     position: { x: number; y: number },
//     receiver?: boolean
//   ) => number;
//   removeSpawner: () => void;
//   removeTracker: () => void;
//   hasTracker: () => boolean;
//   useStorage: Function;
//   adjustHeight: Function;
// }

// interface EdgesStore<T> extends Writable<T> {
//   filter: Function;
//   remove: (id: number) => void;
//   add: (sourceID: number, targetID: number) => void;
//   useStorage: Function;
// }

// interface CoreSvelvetStore {
//   nodesStore: NodesStore<Node[]>;
//   edgesStore: EdgesStore<Edge[]>;
//   widthStore: Writable<number>;
//   heightStore: Writable<number>;
//   backgroundStore: Writable<boolean>;
//   movementStore: Writable<boolean>;
//   nodeIdSelected: Writable<number>;
//   nodeSelected: Writable<boolean>;
//   d3Scale: Writable<number>;
// }

// interface SvelvetStore extends CoreSvelvetStore {
//   onMouseMove: (e: any, nodeID: number) => void;
//   onNodeClick: (e: any, nodeID: number) => void;
//   onTouchMove: (e: any, nodeID: number) => void;
//   derivedEdges: Readable<Edge[]>;
// }

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

    spawn: (
      component: NodeComponent,
      position: { x: number; y: number },
      receiver: boolean = false
    ) => {
      let id;

      update((state) => {
        state = state.filter((n) => n.component != "spawner");
        id = Math.max(...state.map((n) => n.id), 0) + 1;
        state.push(new Node(id, component, position, receiver));
        return state;
      });

      return id;
    },
    remove: (id: number) =>
      update((state) => {
        // FIXME
        // There is a bug in event components
        // if first spawned is removed then second transforms
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
            node.height = defaultHeight + sequenceLength * 32;
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

// refer to Svelvet/index, if store does not exist, then create one.
// Creates one Svelvet component store using the unique key
// function createStore(): SvelvetStore {
//   // const existing = svelvetStores[key];
//   // if (existing) {
//   //   return existing;
//   // }
//   //Setting defaults of core svelvet store and making them a store using writable
//   const coreSvelvetStore: CoreSvelvetStore = {
//     // nodesStore: writable([]),
//     nodesStore: createNodes(),
//     edgesStore: createEdges(),
//     widthStore: writable(GRAPH_SIZE),
//     heightStore: writable(GRAPH_SIZE),
//     backgroundStore: writable(true),
//     movementStore: writable(true),
//     nodeSelected: writable(false),
//     nodeIdSelected: writable(-1),
//     d3Scale: writable(1),
//   };

//   // This is the function handler for the mouseMove event to update the position of the selected node.
//   const onMouseMove = (e: any, nodeID: number) => {
//     coreSvelvetStore.nodesStore.update((n) => {
//       n.forEach((node: Node) => {
//         if (node.id === nodeID) {
//           //retrieve d3Scale value from store
//           const scale = get(coreSvelvetStore.d3Scale);
//           // divide the movement value by scale to keep it proportional to d3Zoom transformations
//           node.position.x += e.movementX / scale;
//           node.position.y += e.movementY / scale;
//         }
//       });
//       return [...n];
//     });
//   };

//   // This is the function handler for the touch event on mobile to select a node.
//   const onTouchMove = (e: any, nodeID: number) => {
//     coreSvelvetStore.nodesStore.update((n) => {
//       n.forEach((node: Node) => {
//         if (node.id === nodeID) {
//           //calculates the location of the selected node
//           const { x, y, width, height } = e.target.getBoundingClientRect();
//           const offsetX =
//             ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
//           const offsetY =
//             ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;
//           // centers the node consistently under the user's touch
//           node.position.x += offsetX - node.width / 2;
//           node.position.y += offsetY - node.height / 2;
//         }
//       });
//       return [...n];
//     });
//   };
//   const nodeIdSelected = coreSvelvetStore.nodeIdSelected;
//   // if the user clicks a node without moving it, this function fires allowing a user to invoke the callback function
//   const onNodeClick = (e: any, nodeID: number) => {
//     get(nodesStore).forEach((node) => {
//       if (node.id === get(nodeIdSelected)) {
//         node.clickCallback?.(node);
//       }
//     });
//   };

//   const edgesStore = coreSvelvetStore.edgesStore;
//   const nodesStore = coreSvelvetStore.nodesStore;

//   // derive from nodesStore and edgesStore, pass in array value from each store
//   // updates edgesStore with new object properties (edge,sourceX, edge.targetY, etc) for edgesArray
//   // $nodesStore and its individual object properties are reactive to node.position.x and node.position.y
//   // so derivedEdges has access to node.position.x and node.position.y changes inside of this function
//   const derivedEdges = derived(
//     [nodesStore, edgesStore],
//     ([$nodesStore, $edgesStore]) => {
//       $edgesStore.forEach((edge: any) => {
//         // any -> edge should follow type DerivedEdge, but we are assigning to any so the typing meshes together

//         // These are dummy nodes to resolve a typescripting issue. They are overwritten in the following forEach loop
//         let sourceNode: Node = {
//           id: 0,
//           position: { x: 25, y: 475 },
//           data: { label: "9" },
//           width: 175,
//           height: 40,
//           targetPosition: "right",
//           sourcePosition: "left",
//         };

//         let targetNode: Node = {
//           id: 10,
//           position: { x: 750, y: 475 },
//           data: { label: "10" },
//           width: 175,
//           height: 40,
//           targetPosition: "right",
//           sourcePosition: "left",
//         };

//         $nodesStore.forEach((node: Node) => {
//           if (edge.source === node.id) sourceNode = node;
//           if (edge.target === node.id) targetNode = node;
//         });

//         if (sourceNode) {
//           //left side of the node selected
//           let left = sourceNode.position.x;
//           //top of the node selected
//           let top = sourceNode.position.y;
//           //declaring the middle point of the node
//           let middle = sourceNode.width / 2;

//           //Default sourcePosition to bottom if sourcePosition not defined
//           if (
//             sourceNode.sourcePosition === "bottom" ||
//             sourceNode.sourcePosition === undefined
//           ) {
//             //the x coordinate of the middle of the node
//             edge.sourceX = left + middle;
//             //the y coordinate of the bottom of the node
//             edge.sourceY = top + sourceNode.height;
//             //assign sourcePosition to the edge for usage in the various edge components
//             edge.sourcePosition = "bottom";
//           } else if (sourceNode.sourcePosition === "top") {
//             edge.sourceX = left + middle;
//             edge.sourceY = top;
//             edge.sourcePosition = sourceNode.sourcePosition;
//           } else if (sourceNode.sourcePosition === "left") {
//             edge.sourceX = left;
//             edge.sourceY = top + sourceNode.height / 2;
//             edge.sourcePosition = sourceNode.sourcePosition;
//           } else if (sourceNode.sourcePosition === "right") {
//             edge.sourceX = left + sourceNode.width;
//             edge.sourceY = top + sourceNode.height / 2;
//             edge.sourcePosition = sourceNode.sourcePosition;
//           }
//         }
//         if (targetNode) {
//           //left side of the node selected
//           let left = targetNode.position.x;
//           //top of the node selected
//           let top = targetNode.position.y;
//           //declaring the middle point of the node
//           let middle = targetNode.width / 2;

//           //Default to top targetPosition if targetPosition undefined
//           if (
//             targetNode.targetPosition === "top" ||
//             targetNode.targetPosition === undefined
//           ) {
//             //the x coordinate of the middle of the node
//             edge.targetX = left + middle;
//             //the y coordinate of the bottom of the node
//             edge.targetY = top;
//             //assign sourcePosition to the edge for usage in the various edge components
//             edge.targetPosition = "top";
//           } else if (targetNode.targetPosition === "bottom") {
//             edge.targetX = left + middle;
//             edge.targetY = top + targetNode.height;
//             edge.targetPosition = targetNode.targetPosition;
//           } else if (targetNode.targetPosition === "left") {
//             edge.targetX = left;
//             edge.targetY = top + targetNode.height / 2;
//             edge.targetPosition = targetNode.targetPosition;
//           } else if (targetNode.targetPosition === "right") {
//             edge.targetX = left + targetNode.width;
//             edge.targetY = top + targetNode.height / 2;
//             edge.targetPosition = targetNode.targetPosition;
//           }
//         }
//       });
//       return [...$edgesStore];
//     }
//   );

//   //Puts everything together as the svelvet store and use the key so that it can be used.
//   const svelvetStore = {
//     ...coreSvelvetStore,
//     onTouchMove,
//     onMouseMove,
//     onNodeClick,
//     derivedEdges,
//   };

//   return svelvetStore;
// }

export const widthStore = writable(GRAPH_SIZE);
export const heightStore = writable(GRAPH_SIZE);
export const backgroundStore = writable(true);
export const movementStore = writable(true);
export const nodeSelected = writable(false);
export const nodeIdSelected = writable(-1);
export const d3Scale = writable(1);
// export const svelvetStore = createStore();
export const nodesStore = createNodes();
export const edgesStore = createEdges();
export const derivedEdges = derived(
  [nodesStore, edgesStore],
  ([$nodesStore, $edgesStore]) => {
    $edgesStore.forEach((edge: any) => {
      // any -> edge should follow type DerivedEdge, but we are assigning to any so the typing meshes together

      // These are dummy nodes to resolve a typescripting issue. They are overwritten in the following forEach loop
      let sourceNode: Node = {
        id: 0,
        position: { x: 25, y: 475 },
        data: { label: "9" },
        width: 175,
        height: 40,
        targetPosition: "right",
        sourcePosition: "left",
      };

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

interface LinkerElement {
  id: number;
  component: NodeComponent | "";
}

class LinkerElement {
  constructor() {
    this.id = -1;
    this.component = "";
  }
}

interface Linker {
  current: LinkerElement;
  prev: LinkerElement;
}

class Linker {
  constructor(source: LinkerElement, target: LinkerElement) {
    this.current = source;
    this.prev = target;
  }
  reset() {
    this.current = { id: -1, component: "" };
    this.prev = { id: -1, component: "" };
  }
}

import { notifications } from "$src/routes/notifications";

function createLinker() {
  const { subscribe, update } = writable(
    new Linker(new LinkerElement(), new LinkerElement())
  );

  return {
    subscribe,
    link: (
      id: number,
      component: NodeComponent,
      position: { x: number; y: number }
    ) => {
      let linkSuccess = false;

      update((state) => {
        state.prev.id = state.current.id;
        state.prev.component = state.current.component;
        state.current.id = id;
        state.current.component = component;

        if (state.current.id != -1 && state.current.id == state.prev.id) {
          notifications.warning("Can't link components with themselves");
          state.reset();
          return state;
        }

        if (state.current.id != -1 && state.prev.id != -1) {
          let [currentComp, prevComp] = [
            state.current.component,
            state.prev.component,
          ];

          // UNLINKABLE COMPONENT RELATIONS
          if (
            // condition <-> condition
            (currentComp == "condition" && prevComp == currentComp) ||
            // event || loopEvent <-> event || loopEvent
            ((currentComp == "event" || currentComp == "loopEvent") &&
              (prevComp == "event" || prevComp == "loopEvent"))
          ) {
            notifications.warning(
              `Cannot link ${currentComp}s with ${prevComp}s.`
            );

            state.reset();
            linkSuccess = false;
            return state;
          }

          let conditionID = state.prev.id;
          let eventID = state.current.id;

          if (prevComp == "condition") {
            conditionID = state.prev.id;
            eventID = state.current.id;
          }

          let condition = get(conditions).get(conditionID);
          if (!condition) return state;
          if (condition.eventID) {
            notifications.warning("Conditions can't trigger multiple events");
            state.reset();
            return state;
          }

          condition.eventID = eventID;
          conditions.update(conditionID, condition);
          edgesStore.add(conditionID, eventID);
          state.reset();
          linkSuccess = true;
        }
        return state;
      });

      return linkSuccess;
    },
    reset: () =>
      update((state) => {
        state.reset();
        return state;
      }),
  };
}

export const linker = createLinker();
