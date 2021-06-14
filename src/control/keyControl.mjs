import { useNitro } from "./nitro.mjs";

const enumKeyName = {
  Space: " ",
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowRight: "ArrowRight",
};

export const onKeyDown = (player) => (target) => {
  switch (target.key) {
    case enumKeyName.Space:
      player.jump.active = true;
      break;
    case enumKeyName.ArrowRight:
      useNitro(player);
      break;
    case enumKeyName.ArrowUp:
      player.jump.active = true;
      break;
    default:
      break;
  }
};

export const onKeyUp = (player) => (target) => {
  switch (target.key) {
    case enumKeyName.Space:
      player.jump.active = false;
      break;
    case enumKeyName.ArrowRight:
      player.activeNitro = false;
      break;
    case enumKeyName.ArrowUp:
      player.jump.active = false;
      break;
    default:
      break;
  }
};
