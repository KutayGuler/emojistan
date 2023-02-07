<script lang="ts">
  import { EditableMap, Equippable } from "$src/types";
  import Game from "$src/views/Game.svelte";

  const gameProps = {
    map: new EditableMap(
      new Map<number, string>([
        [5, "🚶‍♀️"],
        [6, "🐕"],
        [11, "🦴"],
      ])
    ),
    equippables: new Map<number, Equippable>([[1, new Equippable("🦴", 1)]]),
    mapClass: "simulation",
    SIZE: 4,
  };
</script>

<!-- <Tutorial {...tutorialProps} --header={PUSHER_BORDER} /> -->
<div class="flex h-full flex-col items-center justify-center gap-16">
  <Game {...gameProps} />
  <div class="flex flex-row gap-12">
    <div class="flex flex-col items-center justify-center">
      <p>Movement</p>
      <div class="flex w-full justify-center">
        <kbd class="kbd">▲</kbd>
      </div>
      <div class="flex w-full justify-center">
        <kbd class="kbd">◀︎</kbd>
        <kbd class="kbd">▼</kbd>
        <kbd class="kbd">▶︎</kbd>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <p>Change Direction</p>
      <div class="flex w-full justify-center">
        <kbd class="kbd">W</kbd>
      </div>
      <div class="flex w-full justify-center">
        <kbd class="kbd">A</kbd>
        <kbd class="kbd">S</kbd>
        <kbd class="kbd">D</kbd>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <p>Change Player</p>
      <div class="flex w-full justify-center gap-2">
        <kbd class="kbd">Q</kbd>
        <kbd class="kbd">E</kbd>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <p>Interact</p>
      <kbd class="kbd px-12">Space</kbd>
    </div>
    <div class="flex flex-col items-center justify-center">
      <p>Drop Item</p>
      <kbd class="kbd">Ctrl</kbd>
    </div>
  </div>
</div>
