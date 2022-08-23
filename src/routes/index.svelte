<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { saves } from "../store";

  // TODO: Add loading screen

  onMount(() => {
    saves.useStorage();
  });

  function openSave(id: string) {
    $saves.current = id;
    goto("/game");
  }
</script>

<main>
  <button on:click={saves.add}>NEW GAME</button>
  <h1>Emojistan 🏝️</h1>
  {#each [...$saves.saves] as [id, title]}
    <button on:click={() => openSave(id)}>{title}</button>
  {/each}
</main>

<style>
</style>
