<script lang="ts">
  import { editableMap as map, colorPalette } from "../../store";

  const props = ["self", ""];
  const subprops = ["background", ""];
  const triggers = [() => map.updateBackground(0, "#ff00ff")];

  let trigger: Function;
  let [propIndex, subPropIndex] = [0, 0];
  let prop: string, subprop: string;
  let value: any;

  let colors = ["red", "green", "blue"];
</script>

<section class="noselect rule-card">
  <button class="rule-card-close" on:click={() => {}}>❌</button>
  <div class="if">
    <h4>if</h4>
    <select bind:value={prop} on:change={() => {}}>
      {#each props as _prop}
        <option value={_prop}>{_prop}</option>
      {/each}
    </select>
    <select bind:value={subprop}>
      {#each subprops as sub}
        <option value={sub}>{sub}</option>
      {/each}
    </select>
    <h4>is</h4>
    <select bind:value style:background={value}>
      {#each $colorPalette as color}
        <option value={color} style:background={color} />
      {/each}
    </select>
  </div>
  <div class="then">
    <h4>then trigger</h4>
    <select>
      {#each triggers as t}
        <option value={t.toString()} />
      {/each}
    </select>
  </div>
</section>

<style>
  .if,
  .then {
    gap: 5%;
  }

  .if,
  .then {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: clamp(200px, 25vw, 400px);
  }

  h4 {
    padding: 0;
    margin: 0;
  }
</style>
