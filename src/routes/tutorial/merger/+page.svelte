<script lang="ts">
  import { type Merger as TMerger, EditableMap } from "$src/types";
  import { MERGER_BG, MERGER_BORDER, MERGER_H, MERGER_W } from "$src/constants";
  import Tutorial from "../Tutorial.svelte";
  import Merger from "$components/Merger.svelte";

  const tutorialProps = {
    header: "Merger",
    description:
      "Merger takes three emoji inputs. To put it simply, ☁️ + ❄️ = 🌨️. Alternatively, ❄️ + ☁️ = 🌨️",
    component: Merger,
    node: {
      id: 0,
      component: "merger",
      position: { x: 0, y: 0 },
      width: MERGER_W,
      height: MERGER_H,
      bgColor: MERGER_BG,
      borderColor: MERGER_BORDER,
    },
    props: {
      id: -1,
      slots: ["☁️", "❄️", "🌨️"],
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [5, "☁️"],
          [6, "❄️"],
        ])
      ),
      mergers: new Map<number, TMerger>([[0, ["☁️", "❄️", "🌨️"]]]),
      mapClass: "simulation",
      SIZE: 4,
      showHP: false,
      showInventory: false,
    },
  };
</script>

<Tutorial {...tutorialProps} --header={MERGER_BORDER} />
