// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Game from '../game';
import GamePlayingState from '../gamePlayingState';
import { swingDirection, swingForward } from '../swing';

const calcColor = (level: number, colorOffset: number) => {
    let offset = level + colorOffset;
    let r = ~~(Math.sin(0.3 * offset) * 55 + 200);
    let g = ~~(Math.sin(0.3 * offset + 2) * 55 + 200);
    let b = ~~(Math.sin(0.3 * offset + 4) * 55 + 200);
    return `rgb(${r}, ${g}, ${b})`;
};

export default (game: Game) => {
    if (game.playingState === GamePlayingState.PLAYING && !game.blockManager.targetBlock) {
        let top = game.blockManager.topBlock;
        if (!top) return;
        let level = game.blockManager.placedBlocks.size;
        let dir = swingDirection(level);
        let forward = swingForward(level);
        let pos = [0, (level + 1) * top.size.height, 0];
        if (dir === 0) {
            pos[0] = top.pos[0] + forward * game.swing.swingTripLengthRatio * game.blockConfig.defaultSize.width;
            pos[2] = top.pos[2];
        } else {
            pos[0] = top.pos[0];
            pos[2] = top.pos[2] + forward * game.swing.swingTripLengthRatio * game.blockConfig.defaultSize.depth;
        }
        game.swing.swingDirection = [0, 0, 0];
        game.swing.swingDirection[dir] = forward;
        game.blockManager.newTargetBlock({
            size: { width: top.size.width, height: top.size.height, depth: top.size.depth },
            color: calcColor(level, game.blockConfig.colorOffset),
            pos
        });
    }
};