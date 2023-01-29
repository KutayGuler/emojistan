<script>
</script>

<main class="flex flex-row">
  <div class="drawer-mobile drawer">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-start">
      <!-- Page content here -->
      <slot />
      <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden"
        >Open drawer</label
      >
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay" />
      <ul class="menu w-80 bg-base-100 p-4 text-base-content">
        {#each ["Pusher", "Merger", "Interactable"] as link}
          <li><a href={link.toLowerCase()}>{link}</a></li>
        {/each}
      </ul>
    </div>
  </div>
</main>
