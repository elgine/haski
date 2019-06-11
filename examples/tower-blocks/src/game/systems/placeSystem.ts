// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Game from '../game';
import { BlockState } from '../block';
import GamePlayingState from '../gamePlayingState';

export default (game: Game) => {
    if (game.blockManager.targetBlock && game.blockManager.targetBlock.state === BlockState.RELEASED) {
        const targetBlock = game.blockManager.targetBlock;
        const topBlock = game.blockManager.topBlock;
        if (Math.abs(targetBlock.pos[0] - topBlock.pos[0]) >= targetBlock.size.width ||
            Math.abs(targetBlock.pos[2] - topBlock.pos[2]) >= targetBlock.size.depth) {
            game.playingState = GamePlayingState.END;
            game.blockManager.discardTargetBlock();
            game.onEnd.emit(-1);
        } else {
            let delta = 0; let
                diff = 0;
            let data = {
                size: { width: 0, height: targetBlock.size.height, depth: 0 },
                pos: [0, targetBlock.pos[1], 0],
                color: targetBlock.color
            };
            // x axis
            if (targetBlock.pos[0] !== topBlock.pos[0]) {
                delta = targetBlock.pos[0] - topBlock.pos[0];
                diff = Math.abs(delta);
                data.size.width = diff;
                data.size.depth = targetBlock.size.depth;
                data.pos[2] = targetBlock.pos[2];
                targetBlock.size.width -= diff;
                if (delta < 0) {
                    data.pos[0] = targetBlock.pos[0];
                    targetBlock.pos[0] += diff;
                } else {
                    data.pos[0] = topBlock.pos[0] + topBlock.size.width;
                }
            }
            // z axis
            else if (targetBlock.pos[2] !== topBlock.pos[2]) {
                delta = targetBlock.pos[2] - topBlock.pos[2];
                diff = Math.abs(delta);
                data.size.depth = diff;
                data.size.width = targetBlock.size.width;
                data.pos[0] = targetBlock.pos[0];
                targetBlock.size.depth -= diff;
                if (delta < 0) {
                    data.pos[2] = targetBlock.pos[2];
                    targetBlock.pos[2] += diff;
                } else {
                    data.pos[2] = topBlock.pos[2] + topBlock.size.depth;
                }
            }
            let discard = game.blockManager.newDiscardBlock(data);
            discard.rotationSpeed = game.fall.rotationSpeed;
            if (game.swing.swingDirection[0] !== 0) { discard.rotation[2] = 1 }
            else
            { discard.rotation[0] = 1 }
            if (delta > 0) {
                discard.view.localZIndex = 0;
            }
            game.onLevelChange.emit(game.blockManager.placeTargetBlock());
        }
    }
};