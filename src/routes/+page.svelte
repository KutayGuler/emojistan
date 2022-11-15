<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { saves, modal } from "../store";
  import { scale, fly } from "svelte/transition";
  import { clickOutside } from "../utils/clickOutside";
  import { browser } from "$app/environment";
  import { navigating } from "$app/stores";

  onMount(() => {
    if ($saves.current == "") saves.useStorage();
  });

  function openSave(id?: string) {
    if (id) {
      $saves.current = id;
    } else {
      saves.add();
    }
    goto("/game");
  }

  async function deleteSave() {
    saves.delete(id);
    popup = false;
    location.reload();
  }

  function renameSave() {
    prevTitle = title;
    saves.rename(id, title);
  }

  let popup = false;
  let id = "";
  let title = "";
  let prevTitle = "";
  let mode = "";
  let view: "PROFILE" | "SAVES" | "FEED" = "SAVES";

  function showPopup(_id: string, _title: string, _mode: "edit" | "delete") {
    popup = true;
    mode = _mode;
    id = _id;
    title = _title;
    prevTitle = _title;
  }
</script>

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
      {#if mode == "edit"}
        <div class="flex flex-row">
          <input
            class="rounded border-2 border-black pl-1 text-start text-2xl"
            type="text"
            bind:value={title}
          />
          <span
            class:saved={prevTitle == title}
            on:click={renameSave}
            class="btn my-0 ml-4 h-0 w-0 cursor-pointer border-none opacity-50 shadow-none hover:scale-150"
          >
            💾
          </span>
        </div>
      {:else}
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
      {/if}
    </div>
  </div>
{/if}

{#if !$navigating}
  <main class="noselect">
    <div class="flex flex-col items-end py-16 " out:scale|local>
      <h1 class="text-9xl" on:click={() => modal.show("emojistan")}>
        Emojistan 🏝️
      </h1>
      <p class="pt-4 pr-4">v0.0.1</p>
    </div>

    <div class="flex flex-row items-center justify-center gap-4">
      <button
        class:current={view == "PROFILE"}
        class="opacity-50 duration-200 hover:scale-150"
        on:click={() => (view = "PROFILE")}>👽</button
      >
      <button
        class:current={view == "SAVES"}
        class="opacity-50 duration-200 hover:scale-150"
        on:click={() => (view = "SAVES")}>💾</button
      >
      <button
        class:current={view == "FEED"}
        class="opacity-50 duration-200 hover:scale-150"
        on:click={() => (view = "FEED")}>🌍</button
      >
    </div>
    <p class="py-8 text-3xl">{view}</p>
    {#if view == "PROFILE"}
      <p>profile</p>
    {:else if view == "SAVES"}
      <div class="w-1/4">
        <!-- <button class="btn hover:bg-green-400" on:click={() => openSave()}
          >LOGIN</button
          > -->
        <button class="btn hover:bg-green-400" on:click={() => openSave()}
          >New World</button
        >
        {#if $saves.loaded}
          {#each [...$saves.saves] as [id, title]}
            <div class="relative flex">
              <button
                class="btn hover:bg-blue-400"
                on:click={() => openSave(id)}>{title}</button
              >
              <div class="absolute -right-24 top-8 flex gap-2">
                <button
                  class="duration-200 ease-out hover:scale-150"
                  on:click={() => showPopup(id, title, "edit")}>✏️</button
                >
                <button
                  class="duration-200 ease-out hover:scale-150"
                  on:click={() => showPopup(id, title, "delete")}>🗑️</button
                >
                <button
                  class="duration-200 ease-out hover:scale-150"
                  on:click={() => showPopup(id, title, "delete")}>☁️</button
                >
              </div>
            </div>
          {/each}
        {:else}
          <p>Loading...</p>
        {/if}
      </div>
    {:else if view == "FEED"}
      <div>feed</div>
    {/if}
  </main>
{/if}

<style>
  .saved {
    opacity: 100%;
  }

  .current {
    opacity: 100%;
    transform: scale(150%);
  }

  main {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }
</style>
