import { Assets } from 'pixi.js';
import cannonImg from '../images/cannon.png';
import cannonballsImg from '../images/cannonballs.png';
import invadersImg from '../images/invaders.png';

export async function spaceInvadersPreload() {
    let assets = [
        { alias: 'cannonImg', src: cannonImg },
        { alias: 'cannonballsImg', src: cannonballsImg },
        { alias: 'invadersImg', src: invadersImg },
    ];
    Assets.add(assets);
    await Assets.load(assets.map(asset => asset.alias));
}