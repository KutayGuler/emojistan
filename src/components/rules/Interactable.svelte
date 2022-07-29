<script>
  // TODO: Implement this

  import { interactables, events } from "../../store";

  // export let emoji;
  // export let eventID;
  // /*
  //   interacts refers to item that has interacted with it,
  //   not the player, it can be left as = ""
  // */
  // export let interacts;

  let id = "xd";
  let emoji = "🕹️";
  let eventID = "";
  let interacts = "";

  function update() {
    // interactables.updateInteractable(id, {})
  }
</script>

<section class="noselect rule-card">
  <button class="rule-card-close" on:click={() => {}}>❌</button>
  <div class="slot" on:click={update}>{emoji || ""}</div>

  <div class="slot" on:click={update}>{interacts || ""}</div>
  <select bind:value={eventID} on:change={update}>
    {#each [...$events] as [id, { name }]}
      <option value={id}>{name}</option>
    {/each}
  </select>
</section>
