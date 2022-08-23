<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { saves, modal } from "../store";
  import { scale, fly } from "svelte/transition";
  import { clickOutside } from "../utils/clickOutside";
  import Modal from "../components/tutorial/Modal.svelte";

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

  let popup = false;
  let id = "";
  let title = "";

  function showPopup(_id: string, _title: string) {
    popup = true;
    id = _id;
    title = _title;
  }

  function deleteSave() {
    saves.delete(id);
    popup = false;
  }
</script>

<Modal />
{#if popup}
  <div transition:fly class="modal-background x-modal">
    <div
      use:clickOutside
      on:outsideclick={() => (popup = false)}
      class="relative flex h-1/4 w-1/2 flex-col items-center justify-center bg-white"
    >
      <button class="modal-close x-modal" on:click={() => (popup = false)}>
        <svg
          class="x"
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            class="x-modal"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <p>Are you sure you want to delete save {title}?</p>
      <div class="flex">
        <div
          on:click={deleteSave}
          class="btn border-none shadow-none hover:scale-150"
        >
          ✔️
        </div>
        <div
          on:click={() => (popup = false)}
          class="btn border-none shadow-none hover:scale-150"
        >
          ❌
        </div>
      </div>
    </div>
  </div>
{/if}

{#if !navigating}
  <main class="noselect">
    <div
      class="absolute top-16 flex cursor-help flex-col items-end duration-200 hover:scale-125"
      out:scale
    >
      <h1 class="text-9xl" on:click={() => modal.show("emojistan")}>
        Emojistan 🏝️
      </h1>
      <p class="pt-4 pr-4">v0.0.1</p>
    </div>
    <div class="w-1/4" out:scale>
      <button class="btn hover:bg-green-400" on:click={openNewSave}
        >NEW GAME</button
      >
      {#each [...$saves.saves] as [id, title]}
        <div class="flex ">
          <button class="btn hover:bg-blue-400" on:click={() => openSave(id)}
            >{title}</button
          >
          <button
            class="duration-200 ease-out hover:scale-150"
            on:click={() => showPopup(id, title)}>❌</button
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
