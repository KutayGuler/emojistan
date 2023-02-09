<script lang="ts">
  import {
    Interactable as TInteractable,
    Equippable,
    EditableMap,
    Evolve,
    Devolve,
    SequenceItem,
    Consumable,
  } from "$src/types";
  import {
    INTERACTABLE_BG,
    INTERACTABLE_BORDER,
    INTERACTABLE_H,
    INTERACTABLE_W,
  } from "$src/constants";
  import Tutorial from "../../Tutorial.svelte";
  import { goto } from "$app/navigation";

  const veilHeight = 440;

  const tutorialProps = {
    header: "Interactable",
    subheader: "(Devolve)",
    description:
      "Interactables are the most complex ruleboxes. We will explain each feature with examples.",

    rbx: {
      id: 0,
      type: "interactable",
      position: { x: 0, y: 0 },
      width: INTERACTABLE_W,
      height: INTERACTABLE_H,
      bgColor: INTERACTABLE_BG,
      borderColor: INTERACTABLE_BORDER,
    },
    props: {
      id: -4,
      emoji: "🚶",
      evolve: new Evolve(false, "", 2),
      devolve: new Devolve(true, "🧟"),
      hp: 4,
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [0, "🚶"],
          [10, "🧪"],
          [11, "🧪"],
          [14, "🧪"],
          [15, "🧪"],
        ])
      ),
      statics: new Set<string>(["🧪"]),
      consumables: new Map<number, Consumable>([
        [-2, { emoji: "🧪", hp: -1, mutateConsumerTo: "" }],
      ]),
      interactables: new Map<number, TInteractable>([
        [
          -4,
          new TInteractable(
            "🚶",
            [],
            4,
            1,
            [],
            true,
            new Evolve(false, "", 2),
            new Devolve(true, "🧟")
          ),
        ],
      ]),

      mapClass: "simulation",
      SIZE: 4,
    },
  };
</script>

<Tutorial {...tutorialProps} {veilHeight} --header={INTERACTABLE_BORDER} />

<div class="flex">
  <button
    class="btn"
    on:click={() => goto("/tutorial/interactable/side-effects")}>NEXT</button
  >
</div>
