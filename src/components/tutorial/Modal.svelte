<script lang="ts">
  // DATA
  import { fly } from "svelte/transition";
  import { modal } from "../../store";
  import type { ModalType } from "../../store";
  import { clickOutside } from "../../utils/clickOutside";

  // COMPONENTS
  import Keyboard from "./Keyboard.svelte";
  import Pushes from "./Pushes.svelte";
  import Merges from "./Merges.svelte";
  import Conditions from "./Conditions.svelte";
  import Events from "./Events.svelte";
  import Statics from "./Statics.svelte";
  import Palette from "./Palette.svelte";

  const components: { [key in ModalType]: any } = {
    keyboard: Keyboard,
    pushes: Pushes,
    merges: Merges,
    conditions: Conditions,
    events: Events,
    statics: Statics,
    palette: Palette,
  };
</script>

{#if $modal.open}
  <div transition:fly class="modal-background">
    <div use:clickOutside on:outsideclick={modal.close}>
      <svelte:component this={components[$modal.type]}>
        <button class="modal-close" on:click={modal.close} />
      </svelte:component>
    </div>
  </div>
{/if}
