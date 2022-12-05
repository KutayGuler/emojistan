<script lang="ts">
  import type {
    SequenceItem,
    Condition as ICondition,
    TLoopEvent,
  } from "../store";
  import type { NodeComponent } from "$lib/types";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let position: { x: number; y: number };

  function spawn<T>(component: NodeComponent, value: T, receiver = false) {
    dispatch("spawnNode", {
      component,
      position: { x: position.x, y: position.y },
      receiver,
      value,
    });
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

<ul>
  {#each menuItems as { name, onClick }}
    <li class="add h-8 hover:bg-base-200" on:click={onClick}>
      {name}
    </li>
  {/each}
</ul>
