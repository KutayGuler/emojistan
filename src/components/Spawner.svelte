<script lang="ts">
  import {
    type SequenceItem,
    type Condition as ICondition,
    type TLoopEvent,
    conditions,
    events,
    loopEvents,
  } from "../store";
  import type { NodeComponent } from "$lib/types";
  import { svelvetStore } from "$lib/stores/store";
  const { nodesStore } = svelvetStore;

  export let position: { x: number; y: number };

  function spawn<T>(component: NodeComponent, value: T, receiver = false) {
    const id = nodesStore.spawn(component, position, receiver);

    // TODO: add merger
    // TODO: add container

    switch (component) {
      case "container":
      case "spawner":
        break;
      case "condition":
        conditions.add(id, value);
        break;
      case "event":
        events.add(id, value);
        break;
      case "loopEvent":
        loopEvents.add(id, value);
        break;
    }
  }

  let menuItems = [
    {
      name: "Container",
      onClick: () => {},
    },
    {
      name: "Merger",
      onClick: () => {},
    },
    {
      name: "Condition",
      onClick: () =>
        spawn<ICondition>("condition", {
          a: "playerBackground",
          b: "",
          eventID: 0,
        }),
    },
    {
      name: "Event",
      onClick: () => spawn<Array<SequenceItem>>("event", [], true),
    },
    {
      name: "Loop Event",
      onClick: () =>
        spawn<TLoopEvent>(
          "loopEvent",
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

<ul class="w-full">
  {#each menuItems as { name, onClick }}
    <li
      class="add box-border h-8 w-full pl-2 text-start hover:bg-base-200"
      on:click={onClick}
    >
      {name}
    </li>
  {/each}
</ul>
