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
  import Event from "$components/Event.svelte";
  import Condition from "$components/Condition.svelte";
  import LoopEvent from "$components/LoopEvent.svelte";
  import Container from "$components/Container.svelte";
  import { _key as key } from "$lib/stores/store";
  import { Node } from "$lib/types";

  const svelvetStore = findOrCreateStore($key);
  const { nodesStore } = svelvetStore;

  const colors = {
    condition: ["#cfc0e3", "#644292"],
    event: ["#f6fafd", "#ffc83d"],
  };

  function id() {
    return Math.max(...$nodesStore.map((n) => n.id), 0) + 1;
  }

  function spawn<T>(
    name: string,
    component: any, // what is the proper component type?
    store: any,
    value: T,
    receiver = false
  ) {
    let _id = id();
    store.add(_id, value);
    $nodesStore.push(
      new Node(
        _id,
        component,
        { x: 190, y: 80 },
        250,
        180,
        colors[name][0],
        colors[name][1],
        receiver
      )
    );
    $nodesStore = $nodesStore; // NECESSARY FOR REACTIVITY
  }

  function spawnContainer() {
    $nodesStore.push(
      new Node(id(), Container, { x: 190, y: 80 }, 50, 50, "#40b3ff", "", false)
    );
    $nodesStore = $nodesStore; // NECESSARY FOR REACTIVITY
  }
  function spawnMerger() {}

  let menuItems = [
    {
      id: "ec",
      name: "Container",
      onClick: spawnContainer,
    },
    {
      id: "dec",
      name: "Merger",
      onClick: spawnMerger,
    },
    {
      id: "c",

      name: "Condition",
      onClick: () =>
        spawn<ICondition>("condition", Condition, conditions, {
          a: "playerBackground",
          b: "",
          eventID: 0,
        }),
    },
    {
      id: "e",

      name: "Event",
      onClick: () =>
        spawn<Array<SequenceItem>>("event", Event, events, [], true),
    },
    {
      id: "le",

      name: "Loop Event",
      onClick: () =>
        spawn<TLoopEvent>(
          "event",
          LoopEvent,
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
  {#each menuItems as { name, onClick }, i}
    <li class="add h-8 hover:bg-base-200" on:click={onClick}>
      {name}
    </li>
  {/each}
</ul>
