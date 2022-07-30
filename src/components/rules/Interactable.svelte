<script lang="ts">
  import { onDestroy } from "svelte";
  import { currentEmoji, interactables, events } from "../../store";

  export let id: string;
  export let emoji: string;
  export let eventID: string;
  /*
    interacts refers to item that has interacted with it,
    not the player, it can be left as = ""
  */
  export let interacts: string;

  function update() {
    interactables.update(id, { emoji, interacts, eventID });
  }

  function updateEmoji() {
    emoji = $currentEmoji;
    update();
  }

  function updateInteract() {
    interacts = $currentEmoji;
    update();
  }

  onDestroy(() => {
    if (emoji == "" || eventID == "") {
      interactables.remove(id);
    } else if (!$events.has(eventID)) {
      interactables.remove(id);
    }
  });
</script>

<section class="noselect rule-card">
  <button class="rule-card-close" on:click={() => interactables.remove(id)}
    >❌</button
  >
  <label>
    <div class="slot" on:click={updateEmoji}>{emoji || ""}</div>
    <div class="slot" on:click={updateInteract}>{interacts || ""}</div>
    <select bind:value={eventID} on:change={update}>
      {#each [...$events] as [id, { name }]}
        <option value={id}>{name}</option>
      {/each}
    </select>
  </label>
</section>
