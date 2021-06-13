import { createImage, Area, Animation, MobBasicParameter } from "./helpers.mjs";

export const area = new Area(1024, 768, 540, 1000);

export const player = {
  width: 181,
  height: 229,
  position: { x: area.width / 2, y: area.groundY - 229 },
  canNitro: true,
  activeNitro: false,
  jump: { active: false, height: 20, isInTheAir: false },
  image: createImage("../assets/images/animatedNanonaut.png"),
  animation: { speed: 3, frameNr: 0, framesPerRow: 5, frames: 7 },
  horizontal: { acceleration: 1, speed: 5 },
  vertical: { acceleration: 1, speed: 0 },
};

/* 
{
        x: newMobX,
        y: area.groundY - mobBasicParameter.height,
        frameNr: 0,
      }
*/
export const robot = new MobBasicParameter(
  141,
  139,
  new Animation(5, 0, 3, 9),
  createImage("../assets/images/animatedRobot.png")
);

/* {
  width: 141,
  height: 139,
  animation: { speed: 5, frameNr: 0, framesPerRow: 3, frames: 9 },
  image: createImage("../assets/images/animatedRobot.png"),
  horizontal: { acceleration: 1, speed: 5 },
  vertical: { acceleration: 1, speed: 0 },
  spawn: {
    maxMobs: 3,
    distance: {
      max: 1200,
      min: 400,
    },
  },
};
 */
