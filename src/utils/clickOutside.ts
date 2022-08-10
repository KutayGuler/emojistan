export function clickOutside(node: HTMLElement) {
  // the node has been mounted in the DOM

  window.addEventListener("click", handleClick);

  function handleClick(e: any) {
    if (e.target.className.includes("modal-background")) {
      node.dispatchEvent(new CustomEvent("outsideclick"));
    }
  }

  return {
    destroy() {
      // the node has been removed from the DOM
      window.removeEventListener("click", handleClick);
    },
  };
}
