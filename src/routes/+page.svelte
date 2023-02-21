<script lang="ts">
  import supabase from "../supabase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import {
    saves,
    map,
    palette,
    pushers,
    mergers,
    interactables,
    equippables,
    consumables,
    dialogueTree,
  } from "../store";
  import { navigating } from "$app/stores";
  import { rbxStore } from "$lib/stores/store";

  onMount(() => {
    if ($saves.currentSaveID == "") saves.useStorage();
  });

  let gameName = "";
  let deletedGameName = "";
  let deletedGameID = "";
  let creating = false;
  let showModal = false;

  function newGame() {
    if (creating) return;
    showModal = false;
    saves.add(gameName);
    goto("/editor");
    creating = true;
  }

  function openSave(id: string) {
    $saves.currentSaveID = id;
    goto("/editor");
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function addIsland() {
    let owner = await supabase.auth.getUser();
    if (!owner.data.user) {
      return;
    }

    // CF #8
    const { data, error } = await supabase.from("islands").insert([
      {
        data: {
          map: {
            items: Object.fromEntries($map.items),
            backgrounds: Object.fromEntries($map.backgrounds),
          },
          palette: Array.from($palette),
          rbxs: Array.from($rbxStore),
          pushers: Object.fromEntries($pushers),
          mergers: Object.fromEntries($mergers),
          equippables: Object.fromEntries($equippables),
          consumables: Object.fromEntries($consumables),
          interactables: Object.fromEntries($interactables),
          dialogueTree: Object.fromEntries($dialogueTree),
        },
        owner: owner.data.user.id,
      },
    ]);
  }

  async function getIslands() {
    let user = await supabase.auth.getUser();
    let { data: islands, error } = await supabase
      .from("islands")
      .select("data")
      .eq("owner", user.data.user?.id);
  }
</script>

<svelte:head>
  <title>Emojistan</title>
</svelte:head>

<!-- Put this part before </body> tag -->
<input
  type="checkbox"
  id="new-game"
  class="modal-toggle"
  bind:checked={showModal}
/>
<label for="new-game" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold">What's the name of the game?</h3>
    <span class="inline">
      <input
        type="text"
        class="input input-bordered my-4"
        bind:value={gameName}
      />
      <button class="btn" disabled={gameName.length < 3} on:click={newGame}
        >CREATE</button
      >
    </span>
  </label>
</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete-save" class="modal-toggle" />
<label for="delete-save" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <p class="text-2xl font-bold">
      Are you sure you want to delete {deletedGameName}?
    </p>

    <div class="modal-action">
      <label for="delete-save" class="btn">Cancel</label>
      <label
        for="delete-save"
        class="btn btn-error"
        on:click={() => {
          saves.delete(deletedGameID);
          location.reload(); // REQUIRED FOR DELETING SAVES PROPERLY
        }}>Delete</label
      >
    </div>
  </label>
</label>

<div class="drawer-mobile drawer">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-start justify-start">
    <!-- Page content here -->
    {#if !$navigating}
      <h1 class="pt-4 text-2xl">Saves</h1>
      {#if $saves.loaded}
        <div class="flex w-1/3 flex-col gap-2 py-8 ">
          {#each [...$saves.saves] as [id, title]}
            <div class="relative text-lg shadow-lg">
              <button
                class="my-0 flex h-20 w-full flex-row items-center justify-start rounded-md border-r-2 p-4 duration-200 ease-out hover:bg-secondary hover:text-white"
                on:click={() => openSave(id)}
              >
                <div>{title}</div>
              </button>

              <!-- The button to open modal -->
              <label
                on:click={() => {
                  deletedGameID = id;
                  deletedGameName = title;
                }}
                for="delete-save"
                class="absolute top-2 right-2 cursor-pointer"
              >
                <svg
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg></label
              >
            </div>
          {:else}
            <p>You do not have any saved games.</p>
          {/each}
        </div>
      {:else}
        <p>Loading...</p>
      {/if}
    {/if}
    <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden"
      >Open drawer</label
    >
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" class="drawer-overlay" />

    <ul class="menu m-4 w-80 rounded bg-base-200 text-base-content">
      <p class="select-none p-4 text-2xl">Emojistan 🏝️</p>
      <div class="mx-4 mt-2 box-border ">
        <button class="btn w-full" on:click={() => goto("/tutorial/controls")}
          >TUTORIAL</button
        >
      </div>
      <div class="mx-4 mt-2 box-border ">
        <label for="new-game" class="btn w-full">NEW GAME</label>
      </div>
    </ul>
  </div>
</div>

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
