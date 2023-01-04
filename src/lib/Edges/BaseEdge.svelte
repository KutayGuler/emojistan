<script lang="ts">
  // import EdgeText from "$lib/Edges/EdgeText.svelte";
  import type { EdgeProps } from "$lib/types/types";
  import { conditions } from "$src/store";
  import { edgesStore } from "../stores/store";

  export let baseEdgeProps: EdgeProps;

  // destructuring the props passed in from the parent component
  $: ({
    id,
    path,
    label,
    labelBgColor,
    labelTextColor,
    edgeColor,
    centerX,
    centerY,
  } = baseEdgeProps);

  // setting edge text props
  $: edgeTextProps = {
    label: label,
    labelBgColor: labelBgColor,
    labelTextColor: labelTextColor,
    centerX: centerX,
    centerY: centerY,
  };
</script>

<path
  on:click={() => {
    let i = $edgesStore.findIndex((e) => e.id == id);
    let conditionID = $edgesStore[i].source;
    let condition = $conditions.get(conditionID);
    if (condition) {
      // @ts-expect-error
      condition.eventID = undefined;
      conditions.update(conditionID, condition);
    }
    edgesStore.remove(id);
    console.log($edgesStore);
    console.log($conditions);
  }}
  d={path}
  fill="transparent"
  stroke={edgeColor ? edgeColor : "gray"}
  aria-label="svg-path"
/>

<!-- {#if edgeTextProps.label}
  <EdgeText {edgeTextProps} />
{/if} -->
<style>
  path:hover {
    stroke: red;
    stroke-width: 3px;
  }
</style>
