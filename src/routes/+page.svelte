<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { saves, modal } from "../store";
  import { fly } from "svelte/transition";
  import { clickOutside } from "../utils/clickOutside";
  import { navigating } from "$app/stores";
  import Simulator from "$components/Simulator.svelte";

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
  let view: "PROFILE" | "SAVES" = "SAVES";

  function showPopup(_id: string, _title: string, _mode: "edit" | "delete") {
    popup = true;
    mode = _mode;
    id = _id;
    title = _title;
    prevTitle = _title;
  }

  let items = new Map<number, string>();
  items.set(0, "X");
  items.set(1, "Y");
  let collisions = new Map<string, Map<string, string>>();

  // let col = new Map();
  // col.set("Y", "bump");
  // collisions.set("X", col);

  const rotations = [
    "rotate-1",
    "rotate-2",
    "rotate-3",
    "-rotate-1",
    "-rotate-2",
    "-rotate-3",
  ];

  function random() {
    return rotations[Math.floor(Math.random() * 5)];
  }
</script>

<!-- TODO: Add friends on right side -->

<!-- <Simulator {items} {collisions} /> -->

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
    <!-- TODO: revise ui -->
    <!-- TODO: Add coconut physics -->
    <p class="text-9xl">🏝️</p>
    <p>Welcome back, username!</p>
    <input type="text" placeholder="Search" class="input w-full max-w-xs" />
    {#if $saves.loaded}
      <div class="grid w-auto grid-cols-3 grid-rows-3 gap-8">
        <button
          class="btn my-0 h-32 w-32 border-dashed hover:scale-125 hover:bg-green-400"
          on:click={() => openSave()}>New World</button
        >
        {#each [...$saves.saves] as [id, title]}
          <div class="relative h-32 w-32 duration-200 ease-out hover:scale-125">
            <button
              class="btn my-0 h-32 w-32 hover:bg-blue-400"
              on:click={() => openSave(id)}>{title}</button
            >
            <button class=" absolute top-2 right-2"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </div>
        {/each}
      </div>
    {:else}
      <p>Loading...</p>
    {/if}
  </main>
{/if}

<style>
  svg:hover {
    fill: red;
    stroke: red;
  }

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
