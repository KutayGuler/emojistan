// @ts-nocheck

export const invertColor = (bg) => {
  bg = parseInt(Number(bg.replace("#", "0x")), 10);
  bg = ~bg;
  bg = bg >>> 0;
  bg = bg & 0x00ffffff;
  bg = "#" + bg.toString(16).padStart(6, "0");

  return bg;
};
