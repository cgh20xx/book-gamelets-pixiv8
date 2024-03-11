import gameBgImg from "../images/castle-gamebg.png";
import castleBgImg from "../images/castle-bg.jpg";
import groundImg from "../images/castle-ground.png";
import brickImg from "../images/castle-brick.png";
import woodImg from "../images/castle-wood.png";
import bossImg from "../images/castle-boss.png";
import rockImg from "../images/castle-rock.png";
import slingshotImg from "../images/slingshot.png";
import slingshotFrontImg from "../images/slingshot_front.png";
import { Assets } from "pixi.js";

export async function castleFallsPreload() {

	let assets = [
        { alias: 'gameBgImg', src: gameBgImg },
        { alias: 'castleBgImg', src: castleBgImg },
        { alias: 'groundImg', src: groundImg },
        { alias: 'brickImg', src: brickImg },
        { alias: 'woodImg', src: woodImg },
        { alias: 'bossImg', src: bossImg },
        { alias: 'rockImg', src: rockImg },
        { alias: 'slingshotImg', src: slingshotImg },
        { alias: 'slingshotFrontImg', src: slingshotFrontImg },
    ];
    Assets.add(assets);
    await Assets.load(assets.map(asset => asset.alias));
}
