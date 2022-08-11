<script>
  import Push from "../rules/Push.svelte";
</script>

<div class="modal pushes">
  <slot />
  <div class="body">
    <h4>Pushes</h4>
    <div class="content">
      <div class="component">
        <Push id="{0}," rule={["A", "B", ""]} disabled />
      </div>
      <p>A can push B</p>
      <div class="gif" />

      <div class="component">
        <Push id="{0}," rule={["B", "A", ""]} disabled />
      </div>
      <p>B can push A</p>

      <div class="gif" />
      <h4>Cascading</h4>
    </div>
  </div>
</div>
