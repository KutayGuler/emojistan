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
        <button class="close" on:click={modal.close} />
      </svelte:component>
    </div>
  </div>
{/if}

<style>
  :global(.modal) {
    position: relative;
    width: 75vw;
    height: 75vh;
    background-color: var(--primary);
  }

  .modal-background {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.24);
    width: 100vw;
    height: 100vh;
    z-index: 100;
  }

  .close {
    position: absolute;
    width: 50px;
    height: 50px;
    top: 0;
    right: 0;
  }
</style>
