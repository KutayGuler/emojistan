<script>
  import Merge from "../rules/Merge.svelte";
</script>

<div class="modal merges">
  <slot />
  <div class="body">
    <h4>Merges 💫</h4>
    <div class="content">
      <div class="row">
        <div>
          <div class="component">
            <Merge id="{0}," rule={["A", "B", "C"]} disabled />
          </div>
          <p>A + B = C</p>
          <div class="gif" />
        </div>
        <p title="not equal sign" style="font-size: 8rem">=</p>
        <div>
          <div class="component">
            <Merge id="{0}," rule={["B", "A", "C"]} disabled />
          </div>
          <p>B + A = C</p>
          <div class="gif" />
        </div>
      </div>
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
