<script lang="ts">
  import {
    PUSHER_BORDER,
    MERGER_BORDER,
    EQUIPPABLE_BORDER,
    CONSUMABLE_BORDER,
    INTERACTABLE_BORDER,
  } from "../../constants";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  interface Rulebox {
    link: string;
    next?: string;
    color?: string;
  }

  const ruleboxes: { [key: string]: Rulebox } = {
    ruleboxes: {
      link: "ruleboxes",
      next: "pusher",
    },
    pusher: {
      link: "pusher",
      color: PUSHER_BORDER,
      next: "merger",
    },
    merger: {
      link: "merger",
      color: MERGER_BORDER,
      next: "consumable",
    },
    consumable: {
      link: "consumable",
      color: CONSUMABLE_BORDER,
      next: "equippable",
    },
    equippable: {
      link: "equippable",
      color: EQUIPPABLE_BORDER,
      next: "interactable",
    },
    interactable: {
      link: "interactable",
      color: INTERACTABLE_BORDER,
      next: "",
    },
  };

  let rulebox = ruleboxes[$page.url.pathname.split("/")[2]];
  $: rulebox = ruleboxes[$page.url.pathname.split("/")[2]];
</script>

<main class="flex flex-row">
  <div class="drawer-mobile drawer">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-start">
      <slot />
    </div>
    {#if rulebox?.next}
      <button
        class="btn absolute bottom-2 right-2"
        on:click={() => goto("/tutorial/" + rulebox.next)}
        >{rulebox.next} ></button
      >
    {/if}
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay" />
      <ul class="menu m-4 w-80 rounded-md bg-base-200 text-base-content">
        <li
          class={$page.url.pathname.includes("controls") ? "bg-base-300" : ""}
        >
          <a href="../tutorial/controls">Controls</a>
        </li>
        {#each Object.values(ruleboxes) as { link, color }}
          <li
            class={capitalizeFirst(link)}
            style={$page.url.pathname.includes(link)
              ? `background-color: ${color}; color: var(--primary);`
              : ""}
          >
            <a href="../tutorial/{link}">{capitalizeFirst(link)}</a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</main>
