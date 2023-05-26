function generateID() {
  return (Math.random() + 1).toString(36).substring(7);
}
export {
  generateID as g
};
