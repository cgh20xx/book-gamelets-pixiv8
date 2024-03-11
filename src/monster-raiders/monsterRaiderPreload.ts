import astroidImg from '../images/astroid.png';
import monsterImg from '../images/space-monster.png';
import explosionImg from "../images/explosion-spritesheet.png";
import musicNotesImg from "../images/music-notes.png";
import missileImg from "../images/missile.png";
import starrySpaceImg from "../images/starry-space.png";
import starsImg from "../images/stars.png";

import { Assets } from 'pixi.js';

export async function monsterRaiderPreload() {
    let assets = [
        { alias: 'astroidImg', src: astroidImg },
        { alias: 'monsterImg', src: monsterImg },
        { alias: 'explosionImg', src: explosionImg },
        { alias: 'musicNotesImg', src: musicNotesImg },
        { alias: 'missileImg', src: missileImg },
        { alias: 'starrySpaceImg', src: starrySpaceImg },
        { alias: 'starsImg', src: starsImg },
    ];
    Assets.add(assets);
    await Assets.load(assets.map(asset => asset.alias));
}
