<script>
  import Condition from "../rules/Condition.svelte";
  import Event from "../rules/Event.svelte";
</script>

<div class="modal conditions">
  <slot />
  <div class="body">
    <h4>Conditions ❓</h4>
    <div class="content">
      <div class="component">
        <Condition disabled id="" a="" b="" _b="" eventID="" />
      </div>
      <div class="component">
        <Event disabled id="" name="" sequence={[]} />
      </div>
    </div>
  </div>
</div>
