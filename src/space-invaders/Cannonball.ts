import { Assets, Rectangle, Sprite, Texture, Ticker } from "pixi.js";
import { SpaceInvadersGame } from "./SpaceInvadersGame";
import { Invader } from "./Invader";
import { EarthShield } from "./EarthShield";

export class Cannonball {
    // 砲彈的圖
    sprite = new Sprite();

    constructor(
        public game: SpaceInvadersGame,
        x: number,
        y: number
    ) {
        // 載入圖片、建立材質、設定精靈圖
        let baseTexture = Assets.get('cannonballsImg');
        let textureFrame = this.getSpriteTextureFrame();
        let texture = new Texture({
            source: baseTexture,
            frame: textureFrame,
        });
        this.sprite.texture = texture;
        // 調整圖片軸心
        this.sprite.pivot.set(
            textureFrame.width / 2,
            textureFrame.height / 2
        );
        // 把精靈圖放到舞台上的初始位置
        game.app.stage.addChildAt(this.sprite, 0);
        this.sprite.position.set(x, y);
        // 把移動更新函式加到Ticker
        game.app.ticker.add(this.moveUpdate, this);
    }
    protected getSpriteTextureFrame(): Rectangle {
        return new Rectangle(1, 0, 4, 14);
    }

    destroy() {
        this.sprite.destroy();
        this.game.app.ticker.remove(this.moveUpdate, this);
    }
    get destroyed(): boolean {
        return this.sprite.destroyed;
    }
    /**
     * 移動更新函式
     */
    moveUpdate(ticker: Ticker) {
        let speed = 4;
        this.sprite.y -= ticker.deltaTime * speed;
        // 往上超出舞台範圍時，刪掉自己
        if (this.sprite.y < -this.sprite.height) {
            this.destroy();
        } else {
            // 取得被撞到的外星人
            let hitInvader = this.hittestInvaders();
            // 如果有找到被撞到的外星人
            if (hitInvader) {
                // 呼叫game裏處理毀滅外星人的函式
                this.game.hitAndRemoveInvader(hitInvader);
                // 再把自己也銷毀
                this.destroy();
            } else {
                // 尋找被撞到的護盾
                let shield = this.hittestShields();
                if (shield) {
                    // 讓shield進行被擊中的處理
                    shield.onHit();
                    // 再把自己也清掉
                    this.destroy();
                }
            }
        }
    }
    /**
     * 砲彈的碰撞檢測函式
     * 回傳被打到的外星人
     */
    hittestInvaders(): Invader | undefined {
        let bounds = this.sprite.getBounds();
        return this.game.invaders.find((invader) => {
            return invader.sprite.getBounds().rectangle.intersects(bounds.rectangle);
        });
    }
    /**
     * 砲彈的碰撞檢測函式
     * 回傳被打到的地球護盾
     */
    hittestShields(): EarthShield | undefined {
        let bounds = this.sprite.getBounds();
        return this.game.shields.find((shield) => {
            return shield.getBounds().rectangle.intersects(bounds.rectangle);
        });
    }
}
