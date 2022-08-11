<script>
  import Merge from "../rules/Merge.svelte";
</script>

<div class="modal merges">
  <slot />
  <div class="body">
    <h4>Merges</h4>
    <div class="content">
      <div class="component">
        <Merge id="{0}," rule={["a", "b", "c"]} disabled />
      </div>
      <p>A + B = C</p>
      <p style="margin: 0;">or</p>
      <p>B + A = C</p>
      <div class="gif" />

      <div class="component">
        <Merge id="{0}," rule={["b", "a", "c"]} disabled />
      </div>
      <p>The card above means that b can push a</p>

      <div class="gif" />
      <h4>Cascading</h4>
    </div>
  </div>
</div>
