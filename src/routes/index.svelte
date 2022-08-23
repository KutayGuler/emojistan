<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { saves } from "../store";
  import { scale } from "svelte/transition";

  let navigating = false;

  onMount(() => {
    saves.useStorage();
  });

  function openSave(id: string, newSave = false) {
    navigating = true;
    $saves.current = id;
    goto("/game");
  }

  function openNewSave() {
    navigating = true;
    saves.add();
    goto("/game");
  }

  function showPopup(id: string) {
    // TODO: implement this
  }
</script>

{#if !navigating}
  <main>
    <h1
      class="absolute top-16 cursor-help text-9xl duration-200 hover:scale-125"
      out:scale
    >
      Emojistan 🏝️
    </h1>
    <div class="w-1/2" out:scale>
      <button class="menu-btn hover:bg-green-400" on:click={openNewSave}
        >NEW GAME</button
      >
      {#each [...$saves.saves] as [id, title]}
        <div class="flex ">
          <button
            class="menu-btn hover:bg-blue-400"
            on:click={() => openSave(id)}>{title}</button
          >
          <button
            class="duration-50 ease-out hover:scale-150"
            on:click={() => showPopup(id)}>❌</button
          >
        </div>
      {/each}
    </div>
  </main>
{/if}

<style>
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }
</style>
