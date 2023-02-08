<script lang="ts">
  import {
    PUSHER_BORDER,
    MERGER_BORDER,
    EQUIPPABLE_BORDER,
    CONSUMABLE_BORDER,
    INTERACTABLE_BORDER,
  } from "../../constants";
  import { page } from "$app/stores";

  const ruleboxes = [
    "Ruleboxes",
    "Pusher",
    "Merger",
    "Consumable",
    "Equippable",
    "Interactable",
  ];

  const colors: { [key: string]: string } = {
    Pusher: PUSHER_BORDER,
    Merger: MERGER_BORDER,
    Equippable: EQUIPPABLE_BORDER,
    Consumable: CONSUMABLE_BORDER,
    Interactable: INTERACTABLE_BORDER,
  };
</script>

<main class="flex flex-row">
  <div class="drawer drawer-mobile">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-start">
      <slot />
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay" />
      <ul class="menu m-4 w-80 rounded-md bg-base-200 text-base-content">
        <li
          class={$page.url.pathname.includes("controls") ? "bg-base-300" : ""}
        >
          <a href="../tutorial/controls">Controls</a>
        </li>
        {#each ruleboxes as link}
          <li
            class={link}
            style={$page.url.pathname.includes(link.toLowerCase())
              ? `background-color: ${colors[link]}; color: var(--primary);`
              : ""}
          >
            <a href="../tutorial/{link.toLowerCase()}">{link}</a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</main>
