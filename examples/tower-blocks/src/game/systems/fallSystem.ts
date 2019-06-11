// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Game from '../game';

const fallMap: {[id: number]: number} = {};

export default (game: Game) => {
    game.blockManager.discardBlocks.forEach((block) => {
        if (!fallMap[block.id]) {
            fallMap[block.id] = 0;
        }
        if (fallMap[block.id] < game.fall.height) {
            let fallHeight = game.physics.gravity * game.ticker.dt * 0.001;
            fallMap[block.id] += fallHeight;
            block.pos[1] -= fallHeight;
            block.rotation[3] += block.rotationSpeed;
            block.opacity = 1 - fallMap[block.id] / game.fall.height;
        } else {
            delete fallMap[block.id];
            game.blockManager.destroyDiscardBlock(block);
        }
    });
};