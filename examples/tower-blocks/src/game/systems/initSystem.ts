// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Game from '../game';
import GamePlayingState from '../gamePlayingState';
import Block from '../block';
import randomColorOffset from '../randomColorOffset';

export default (game: Game) => {
    if (game.playingState === GamePlayingState.PREPARE) {
        const placeBlocks = game.blockManager.placedBlocks;
        if (placeBlocks.size <= 0) {
            // Reset color offset
            game.blockConfig.colorOffset = randomColorOffset();
            game.playingState = GamePlayingState.PLAYING;
            game.blockManager.reset();
            game.onLevelChange.emit(0);
        }
        // Dispose placed blocks
        game.blockManager.placedBlocks.forEach((block) => {
            if (!game.tweenManager.contains(block)) {
                game.tweenManager.animate(block, { scale: 0 }, 1000, undefined, function(block: Block) {
                    game.tweenManager.remove(block);
                    game.blockManager.destroyPlacedBlock(block);
                });
            }
        });
    }
};