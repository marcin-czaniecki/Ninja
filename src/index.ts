import { createImage } from "./helpers/helpers";
import Engine from "./world/Engine";
import "./settingParams";
import { player, world } from "./settingParams";

const spriteSheetPlayerRun = createImage("./assets/ninja/run.png");
const spriteSheetPlayerJump = createImage("./assets/ninja/jump.png");
const forest = createImage("./assets/background/6/background.png");
const ground = createImage("./assets/background/6/ground.png");

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

  //looking for a better solution or returning to the lack of adaptation of the game view to the window
  const equalWorldWithWindow = world.width !== window.innerWidth || world.height !== window.innerHeight;
  if (equalWorldWithWindow) {
    world.updateSize(window.innerWidth, window.innerHeight);
  }
};

const draw = () => {
  ctx.clearRect(0, 0, player.activeWorld.width, player.activeWorld.height);
  world.drawBackground(forest, 1920, 1080);
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
  world.drawBackground(ground, 1920, 1080);
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
