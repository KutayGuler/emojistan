<script>
  import Push from "../rules/Push.svelte";
</script>

<div class="modal pushes">
  <slot />
  <div class="body">
    <h4>Pushes 💨</h4>
    <div class="content">
      <div class="row">
        <div>
          <div class="component">
            <Push id="{0}," rule={["A", "B", ""]} disabled />
          </div>
          <p>A can push B</p>
          <div class="gif" />
        </div>
        <p title="not equal sign" style="font-size: 8rem">≠</p>
        <div>
          <div class="component">
            <Push id="{0}," rule={["B", "A", ""]} disabled />
          </div>
          <p>B can push A</p>
          <div class="gif" />
        </div>
      </div>
      <h4>Cascading</h4>
      <div class="component">
        <Push id="{0}," rule={["A", "B", ""]} disabled />
      </div>
      <div class="component">
        <Push id="{0}," rule={["B", "C", ""]} disabled />
      </div>
      <p>A can push B and B can push C</p>
      <div class="gif" />
    </div>
  </div>
</div>

<style>
  .content {
    padding-top: 0;
  }

  .row {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .row > div {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
