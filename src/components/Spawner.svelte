<script lang="ts">
  import {
    type SequenceItem,
    type Condition as ICondition,
    type TLoopEvent,
    conditions,
    events,
    loopEvents,
    merges,
    pushes,
  } from "../store";
  import type { NodeComponent } from "$lib/types";
  import { nodesStore } from "$lib/stores/store";

  export let position: { x: number; y: number };

  function spawn<T>(component: NodeComponent, value: T, receiver = false) {
    const id = nodesStore.spawn(component, position, receiver);

    switch (component) {
      case "pusher":
        pushes.add(id, value);
      case "merger":
        merges.add(id, value);
        break;
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
      name: "Pusher",
      onClick: () => spawn("pusher", ["", "", "push"]),
    },
    {
      name: "Merger",
      onClick: () => spawn<Array<string>>("merger", ["", "", ""]),
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
              end: SIZE,
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
