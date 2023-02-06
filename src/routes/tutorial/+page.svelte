<script lang="ts">
  import { EditableMap } from "$src/types";
  import Game from "$src/views/Game.svelte";

  const gameProps = {
    map: new EditableMap(new Map<number, string>([[5, "🟢"]])),
    mapClass: "simulation",
    SIZE: 4,
  };

  // TODO: ARROW KEYS | E, Q TO CHANGE PLAYER
</script>

<!-- <Tutorial {...tutorialProps} --header={PUSHER_BORDER} /> -->
<Game {...gameProps} />

<p class="p-4">Pick a section from the menu on the left</p>
