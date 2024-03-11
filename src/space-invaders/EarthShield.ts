import { Graphics } from "pixi.js";
import { ArrayUtils } from "../lib/ArrayUtils";
import { SpaceInvadersGame } from "./SpaceInvadersGame";

export class EarthShield extends Graphics {

    constructor(public game: SpaceInvadersGame, x: number, y: number) {
        super();
        this.rect(-10, -10, 20, 20);
        this.fill(0x00FF00);
        this.position.set(x, y);
    }
    onHit() {
        this.alpha -= 0.1;
        if (this.alpha <= 0.2) {
            this.destroy();
            ArrayUtils.removeItem(this.game.shields, this);
        }
    }
}
