<script lang="ts">
  import {
    mergers,
    pushers,
    interactables,
    consumables,
    equippables,
  } from "../store";
  import type { NodeComponent } from "$lib/types";
  import { nodesStore } from "$lib/stores/store";
  import {
    Devolve,
    Evolve,
    Interactable,
    Equippable,
    Consumable,
  } from "$src/types";

  export let position: { x: number; y: number };

  // CF #4
  function spawn(component: NodeComponent, value: any) {
    const id = nodesStore.spawn(component, position);

    switch (component) {
      case "pusher":
        pushers.add(id, value);
        break;
      case "merger":
        mergers.add(id, value);
        break;
      case "consumable":
        consumables.add(id, value);
        break;
      case "equippable":
        equippables.add(id, value);
        break;
      case "interactable":
        interactables.add(id, value);
        break;
      case "ctxMenu":
        break;
    }
  }

  // CF #5
  let menuItems = [
    {
      name: "Pusher",
      onClick: () => spawn("pusher", ["", "", "push"]),
    },
    {
      name: "Merger",
      onClick: () => spawn("merger", ["", "", ""]),
    },
    {
      name: "Consumable",
      onClick: () => spawn("consumable", new Consumable("", 1)),
    },
    {
      name: "Equippable",
      onClick: () => spawn("equippable", new Equippable("", 1)),
    },
    {
      name: "Interactable",
      onClick: () =>
        spawn(
          "interactable",
          new Interactable(
            "",
            [],
            1,
            1,
            [["any", 0]],
            false,
            new Evolve(false, "", 2),
            new Devolve(false, "")
          )
        ),
    },
  ];
</script>

<ul class="w-full bg-white">
  {#each menuItems as { name, onClick }}
    <li
      class="{name} box-border h-8 w-full cursor-pointer p-1 text-start hover:bg-base-200"
      on:click={onClick}
    >
      {name}
    </li>
  {/each}
</ul>

<style>
  .Pusher:hover {
    background-color: var(--pusher);
  }
  .Merger:hover {
    background-color: var(--merger);
  }
  .Interactable:hover {
    background-color: var(--interactable);
  }
  .Equippable:hover {
    background-color: var(--equippable);
  }
  .Consumable:hover {
    background-color: var(--consumable);
  }
</style>
