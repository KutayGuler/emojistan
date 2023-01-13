<script lang="ts">
  import {
    merges,
    pushes,
    interactables,
    Interactable,
  } from "../store";
  import type { NodeComponent } from "$lib/types";
  import { nodesStore } from "$lib/stores/store";

  export let position: { x: number; y: number };

  // CF #4
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
      onClick: () => spawn<Array<string>>("merger", ["", "", ""]),
    },
    {
      name: "Interactable",
      onClick: () =>
        spawn<Interactable>(
          "interactable",
          new Interactable("", [], 1, 1, [["anything", 0]], { to: "", at: 1 })
        ),
    },
  ];
</script>

<ul class="w-full bg-white opacity-90">
  {#each menuItems as { name, onClick }}
    <li
      class="add box-border h-8 w-full pl-2 text-start hover:bg-base-200"
      on:click={onClick}
    >
      {name}
    </li>
  {/each}
</ul>
