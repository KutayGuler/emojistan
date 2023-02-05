<script>
  import Equippable from "$components/Equippable.svelte";
</script>

<main class="flex flex-row">
  <div class="drawer drawer-mobile">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-start">
      <slot />
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay" />
      <ul class="menu w-80 bg-base-100 p-4 text-base-content">
        {#each ["Editor", "Pusher", "Merger", "Equippable", "Consumable", "Interactable"] as link}
          <li><a href="../tutorial/{link.toLowerCase()}">{link}</a></li>
        {/each}
      </ul>
    </div>
  </div>
</main>
