<script lang="ts">
  import { merges, pushes, interactables, Interactable } from "../store";
  import type { NodeComponent } from "$lib/types";
  import { nodesStore } from "$lib/stores/store";

  export let position: { x: number; y: number };

  // CF #4
  function spawn(component: NodeComponent, value: any, receiver = false) {
    const id = nodesStore.spawn(component, position, receiver);

    switch (component) {
      case "pusher":
        pushes.add(id, value);
      case "merger":
        merges.add(id, value);
        break;
      case "spawner":
        break;
      case "interactable":
        interactables.add(id, value);
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
            { to: "", at: 2 },
            { to: "" }
          )
        ),
    },
  ];
</script>

<ul class="w-full bg-white">
  {#each menuItems as { name, onClick }}
    <li
      class="{name} box-border h-8 w-full pl-2 text-start hover:bg-base-200"
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
</style>
