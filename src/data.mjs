import { Area } from "./world/world.mjs";
import { MobBasicParameter } from "./mobs/mob.mjs";
import { Animation } from "./animations/animations.mjs";
import { createImage } from "./helpers/helpers.mjs";
import { Player } from "./player/player.mjs";

export const area = new Area(1024, 768, 540, 1000);

export const player = new Player(
  area,
  181,
  229,
  createImage("./assets/images/animatedNanonaut.png"),
  new Animation(3, 0, 5, 7)
);

export const robot = new MobBasicParameter(
  141,
  139,
  new Animation(5, 0, 3, 9),
  createImage("./assets/images/animatedRobot.png")
);
