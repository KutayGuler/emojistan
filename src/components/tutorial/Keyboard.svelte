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
    <h1>Change Movement Mode</h1>
    <kbd>Ctrl</kbd>
  </div>
  <div>
    <h1>Interact</h1>
    <kbd id="space">Space</kbd>
  </div>
</div>

<style>
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

  kbd {
    background-color: #eee;
    border-radius: 4px;
    font-size: 2rem;
    padding: 0.2em 0.5em;
    border-top: 5px solid rgba(255, 255, 255, 0.5);
    border-left: 5px solid rgba(255, 255, 255, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.2);
    border-bottom: 5px solid rgba(0, 0, 0, 0.2);
    color: #555;
  }

  #space {
    width: 40%;
    text-align: center;
  }
</style>
