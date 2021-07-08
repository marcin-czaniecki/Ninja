import { getRoot } from "./helpers/helpers";
import Player from "./player/Player";
import { World } from "./world/World";

export const world = new World(getRoot(), window.innerWidth, window.innerHeight);

export const player = new Player(world, 363, 458);

player.setScale(0.5, 0.5);
player.y = player.activeWorld.height - player.activeWorld.ground;
