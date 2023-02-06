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
  } from "../store";
  import { navigating } from "$app/stores";
  import { nodesStore } from "$lib/stores/store";

  // FIXME: Save file overriding problem

  onMount(() => {
    if ($saves.currentSaveID == "") saves.useStorage();
  });

  let gameName = "";
  let creating = false;

  function newGame() {
    if (creating) return;
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
            objective: $map.objective,
          },
          palette: Array.from($palette),
          nodes: Array.from($nodesStore),
          pushers: Object.fromEntries($pushers),
          mergers: Object.fromEntries($mergers),
          interactables: Object.fromEntries($interactables),
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
<input type="checkbox" id="new-game" class="modal-toggle" />
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

{#if !$navigating}
  <main class="noselect">
    <p class="py-8 text-9xl">Emojistan 🏝️</p>
    <div />
    {#if $saves.loaded}
      <div class="flex w-1/3 flex-col gap-8 py-8 ">
        <a class="link" href="/tutorial">TUTORIAL</a>
        <!-- <button class="btn h-16 w-full hover:bg-primary" on:click={newGame}
          >New Game</button
        > -->
        <label for="new-game" class="btn">NEW GAME</label>
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
              for="my-modal-4"
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

            <!-- Put this part before </body> tag -->
            <input type="checkbox" id="my-modal-4" class="modal-toggle" />
            <label for="my-modal-4" class="modal cursor-pointer">
              <label class="modal-box relative" for="">
                <p class="text-2xl font-bold">
                  Are you sure you want to delete {title}?
                </p>

                <div class="modal-action">
                  <label for="my-modal-4" class="btn">Cancel</label>
                  <label
                    for="my-modal-4"
                    class="btn btn-error"
                    on:click={() => {
                      saves.delete(id);
                      location.reload(); // REQUIRED FOR DELETING SAVES PROPERLY
                    }}>Delete</label
                  >
                </div>
              </label>
            </label>
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
