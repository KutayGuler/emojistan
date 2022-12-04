<script lang="ts">
  import {
    conditions,
    events,
    loopEvents,
    SequenceItem,
    type Condition as ICondition,
    type TLoopEvent,
  } from "../../../store";
  import { findOrCreateStore } from "$lib/stores/store";
  import { _key as key } from "$lib/stores/store";
  import { Node, type NodeComponent } from "$lib/types";

  const svelvetStore = findOrCreateStore($key);
  const { nodesStore } = svelvetStore;

  function id() {
    return Math.max(...$nodesStore.map((n) => n.id), 0) + 1;
  }

  function spawn<T>(
    component: NodeComponent,
    store: any,
    value: T,
    receiver = false
  ) {
    let _id = id();
    store.add(_id, value);
    $nodesStore.push(new Node(_id, component, { x: 190, y: 80 }, receiver));
    $nodesStore = $nodesStore; // NECESSARY FOR REACTIVITY
    console.log($nodesStore);
  }

  function spawnContainer() {
    $nodesStore.push(new Node(id(), "container", { x: 190, y: 80 }, false));
    $nodesStore = $nodesStore; // NECESSARY FOR REACTIVITY
  }
  function spawnMerger() {}

  let menuItems = [
    {
      name: "Container",
      onClick: spawnContainer,
    },
    {
      name: "Merger",
      onClick: spawnMerger,
    },
    {
      name: "Condition",
      onClick: () =>
        spawn<ICondition>("condition", conditions, {
          a: "playerBackground",
          b: "",
          eventID: 0,
        }),
    },
    {
      name: "Event",
      onClick: () => spawn<Array<SequenceItem>>("event", events, [], true),
    },
    {
      name: "Loop Event",
      onClick: () =>
        spawn<TLoopEvent>(
          "event",
          loopEvents,
          {
            sequence: [],
            loop: {
              start: 0,
              end: 16,
              iterationNumber: 1,
              iterationType: "increment",
              timeGap: 50,
              reverse: false,
            },
          },
          true
        ),
    },
  ];
</script>

<ul>
  {#each menuItems as { name, onClick }}
    <li class="add h-8 hover:bg-base-200" on:click={onClick}>
      {name}
    </li>
  {/each}
</ul>
