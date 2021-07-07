import { createImage } from "./helpers/helpers";
import Engine from "./world/Engine";
import "./settingParamas";
import { player, world } from "./settingParamas";

const spriteSheetPlayerRun = createImage("./assets/ninja/run.png");
const spriteSheetPlayerJump = createImage("./assets/ninja/jump.png");
const forest = createImage("./assets/background/1/background.png");
console.log(forest, spriteSheetPlayerRun);
const ctx = world.context;

let single = false;

const singleAnimation = (...conditions: boolean[]): void => {
  for (const condition of conditions) {
    if (!condition) {
      single = false;
      break;
    }
    if (condition) {
      single = true;
    }
  }
};

const update = () => {
  singleAnimation(player.isAir);
  player.updateGravitation();
  player.updateRun();
  player.updateAnimation(10, single);
  player.activeWorld.cameraObserveY(player.y);
  player.activeWorld.cameraObserveX(player.x, -150);
};

const draw = () => {
  ctx.clearRect(0, 0, player.activeWorld.width, player.activeWorld.height);
  world.draw(forest, 1920, 1080);
  if (!player.isAir) {
    player.drawAnimation(
      ctx,
      spriteSheetPlayerRun,
      10,
      player.x - player.activeWorld.camera.x,
      player.activeWorld.camera.y
    );
  }
  if (player.isAir) {
    player.drawAnimation(
      ctx,
      spriteSheetPlayerJump,
      10,
      player.x - player.activeWorld.camera.x,
      player.activeWorld.camera.y
    );
  }
};

const engine = new Engine(update, draw);

enum keys {
  SPACE = " ",
  ENTER = "Enter",
}

engine.setEventsKeyDown([
  {
    key: keys.SPACE,
    fn: () => {
      player.updateJump(true);
    },
  },
  {
    key: keys.ENTER,
    fn: () => {
      engine.pause();
    },
  },
]);
