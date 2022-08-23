<script lang="ts">
  // DATA
  import { fly } from "svelte/transition";
  import { modal } from "../../store";
  import type { ModalType } from "../../store";
  import { clickOutside } from "../../utils/clickOutside";

  // COMPONENTS
  import KeyboardPlay from "./KeyboardPlay.svelte";
  import KeyboardEditor from "./KeyboardEditor.svelte";
  import Pushes from "./Pushes.svelte";
  import Merges from "./Merges.svelte";
  import Conditions from "./Conditions.svelte";
  import Events from "./Events.svelte";
  import Statics from "./Statics.svelte";
  import Palette from "./Palette.svelte";
  import Emojistan from "./Emojistan.svelte";

  const components: { [key in ModalType]: any } = {
    keyboardPlay: KeyboardPlay,
    keyboardEditor: KeyboardEditor,
    pushes: Pushes,
    merges: Merges,
    conditions: Conditions,
    events: Events,
    statics: Statics,
    palette: Palette,
    emojistan: Emojistan,
    weapons: undefined,
    throwables: undefined,
  };
</script>

{#if $modal.open}
  <div transition:fly class="modal-background noselect x-modal">
    <div use:clickOutside on:outsideclick={modal.close}>
      <svelte:component this={components[$modal.type]}>
        <button class="modal-close x-modal" on:click={modal.close}>
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
      </svelte:component>
    </div>
  </div>
{/if}
