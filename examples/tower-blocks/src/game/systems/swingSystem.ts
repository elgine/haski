// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Game from '../game';
import { BlockState } from '../block';

export default (game: Game) => {
    const targetBlock = game.blockManager.targetBlock;
    if (!targetBlock || targetBlock.state !== BlockState.FREE) return;
    const topBlock = game.blockManager.topBlock;
    const swing = game.swing;
    if (topBlock) {
        let tripLength = 0; let
            swingSpeed = 0;
        if (swing.swingDirection[0] !== 0) {
            tripLength = swing.swingTripLengthRatio * game.blockConfig.defaultSize.width;
            swingSpeed = tripLength / swing.swingTripDuration * 2;
            if ((swing.swingDirection[0] > 0 && (targetBlock.pos[0] > topBlock.pos[0] + tripLength)) ||
                (swing.swingDirection[0] <= 0 && (targetBlock.pos[0] < topBlock.pos[0] - tripLength))) {
                swing.swingDirection[0] *= -1;
            }
            targetBlock.pos[0] += swing.swingDirection[0] * swingSpeed;
        } else {
            tripLength = swing.swingTripLengthRatio * game.blockConfig.defaultSize.depth;
            swingSpeed = tripLength / swing.swingTripDuration * 2;
            if ((swing.swingDirection[2] > 0 && (targetBlock.pos[2] > topBlock.pos[2] + tripLength)) ||
                (swing.swingDirection[2] <= 0 && (targetBlock.pos[2] < topBlock.pos[2] - tripLength))) {
                swing.swingDirection[2] *= -1;
            }
            targetBlock.pos[2] += swing.swingDirection[2] * swingSpeed;
        }
    }
};