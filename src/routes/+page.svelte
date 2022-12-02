<script lang="ts">
  import supabase from "../supabase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import {
    saves,
    map,
    statics,
    palette,
    pushes,
    merges,
    loopEvents,
    events,
    conditions,
  } from "../store";
  import { fly } from "svelte/transition";
  import { navigating } from "$app/stores";
  import { dataset_dev } from "svelte/internal";

  onMount(() => {
    if ($saves.current == "") saves.useStorage();
  });

  function openSave(id?: string) {
    if (id) {
      $saves.current = id;
    } else {
      saves.add();
    }
    goto("/editor");
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

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  console.log(supabase.auth.getUser());

  function showData() {
    let data = {
      map: $map,
      statics: $statics,
      palette: $palette,
      pushes: $pushes,
      merges: $merges,
      loopEvents: $loopEvents,
      events: $events,
      conditions: $conditions,
    };
    console.log(data);
  }

  async function addIsland() {
    let owner = await supabase.auth.getUser();
    if (!owner.data.user) {
      return;
    }
    const { data, error } = await supabase.from("islands").insert([
      {
        data: {
          map: {
            items: Object.fromEntries($map.items),
            backgrounds: Object.fromEntries($map.backgrounds),
            objective: $map.objective,
          },
          statics: Array.from($statics),
          palette: Array.from($palette),
          pushes: Object.fromEntries($pushes),
          merges: Object.fromEntries($merges),
          loopEvents: Object.fromEntries($loopEvents),
          events: Object.fromEntries($events),
          conditions: Object.fromEntries($conditions),
        },
        owner: owner.data.user.id,
      },
    ]);
    console.log(data, error);
  }

  async function getIslands() {
    let user = await supabase.auth.getUser();
    let { data: islands, error } = await supabase
      .from("islands")
      .select("data")
      .eq("owner", user.data.user?.id);
    console.log(islands, error);
  }
</script>

<div class="flex flex-col">
  <button on:click={getIslands}>GET ISLANDS</button>
  <button on:click={showData}>show data</button>
  <button on:click={addIsland}>add island</button>
  <button on:click={signInWithGoogle}>SIGN IN</button>
</div>

<!-- {#await supabase.auth.getUser() then { data, error }}
  <p>{JSON.stringify(data)}</p>
{/await} -->

<!-- The button to open modal -->
<!-- <label for="my-modal-4" class="btn">open modal</label> -->

<!-- Put this part before </body> tag -->
<!-- <input type="checkbox" id="my-modal-4" class="modal-toggle" />
<label for="my-modal-4" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <label for="my-modal-4" class="btn btn-circle btn-sm absolute right-2 top-2"
      >✕</label
    >
    <h3 class="text-lg font-bold">Congratulations random Internet user!</h3>
    <p class="py-4">
      You've been selected for a chance to get one year of subscription to use
      Wikipedia for free!
    </p>
  </label>
</label> -->

{#if popup}
  <div transition:fly class="modal-background x-modal">
    <div
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
    <div class="dropdown-end dropdown-bottom dropdown absolute right-4 top-4">
      <label tabindex="0">
        <div class="avatar placeholder">
          <div class="w-12 rounded-full bg-neutral-focus text-neutral-content">
            <span class="text-3xl">K</span>
          </div>
        </div>
      </label>
      <ul
        tabindex="0"
        class="dropdown-content menu rounded-box mt-2 w-52 bg-base-100 p-2 shadow"
      >
        <li><a>Friends</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
    <p class="py-8 text-9xl">Emojistan 🏝️</p>
    <!-- <div class="tabs">
      <a class="tab tab-bordered">Home</a>
      <a class="tab tab-active tab-bordered">Favorites</a>
    </div> -->
    <div />
    {#if $saves.loaded}
      <div class="flex w-1/3 flex-col gap-8 py-8">
        <button
          class="btn my-0 h-16 w-full  hover:bg-primary"
          on:click={() => openSave()}>New Island</button
        >
        {#each [...$saves.saves] as [id, title]}
          <div class="relative text-lg">
            <button
              class="my-0 flex h-20 w-full flex-row items-center justify-start rounded-md border-r-2 p-4 duration-200 ease-out hover:bg-secondary hover:text-white"
              on:click={() => openSave(id)}
            >
              <div>{title}</div>
            </button>
            <!-- <div class="absolute bottom-1 right-2">username</div> -->
            <button class=" absolute top-2 right-2 flex flex-row"
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
