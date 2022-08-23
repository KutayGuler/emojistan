<div class="modal keyboard">
  <slot />
  <div>
    <h1>Change direction</h1>
    <div>
      <kbd>W</kbd>
    </div>
    <div>
      <kbd>A</kbd>
      <kbd>S</kbd>
      <kbd>D</kbd>
    </div>
  </div>
  <div>
    <h1>Move</h1>
    <div>
      <kbd>↑</kbd>
    </div>
    <div>
      <kbd>←</kbd>
      <kbd>↓</kbd>
      <kbd>→</kbd>
    </div>
  </div>
  <div>
    <h1>Change Character</h1>
    <span>
      <kbd>Q</kbd>
      <kbd>E</kbd>
    </span>
  </div>
  <div>
    <h1>Interact</h1>
    <kbd id="space">Space</kbd>
  </div>
</div>

<style>
  h1 {
    font-size: 2rem;
    padding-bottom: 1rem;
  }

  .keyboard {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  .keyboard > div,
  .keyboard > div > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .keyboard > div > div {
    flex-direction: row;
    width: 100%;
  }

  #space {
    width: 40%;
    text-align: center;
  }
</style>
