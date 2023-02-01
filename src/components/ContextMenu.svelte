<script lang="ts">
  import { merges, pushes, interactables, consumables } from "../store";
  import type { NodeComponent } from "$lib/types";
  import { nodesStore } from "$lib/stores/store";
  import { Devolve, Evolve, Interactable, Consumable } from "$src/types";

  export let position: { x: number; y: number };

  // CF #4
  function spawn(component: NodeComponent, value: any) {
    const id = nodesStore.spawn(component, position);

    switch (component) {
      case "pusher":
        pushes.add(id, value);
      case "merger":
        merges.add(id, value);
        break;
      case "consumable":
        consumables.add(id, value);
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
      class="{name} box-border h-8 w-full p-1 text-start hover:bg-base-200"
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
  .Consumable:hover {
    background-color: var(--consumable);
  }
</style>
