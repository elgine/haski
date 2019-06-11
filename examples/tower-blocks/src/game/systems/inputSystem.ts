// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Game from '../game';
import GamePlayingState from '../gamePlayingState';
import { ACTION_PLACE } from '../control';
import { BlockState } from '../block';

export default (game: Game) => {
    game.input.update();
    if (game.playingState !== GamePlayingState.PLAYING) return;
    if (game.input.isActive(ACTION_PLACE) && game.control.cooldownTime === 0 && game.blockManager.targetBlock) {
        game.blockManager.targetBlock.state = BlockState.RELEASED;
        game.control.cooldownTime = game.control.cooldown;
    } else if (game.control.cooldownTime > 0) {
        game.control.cooldownTime -= game.ticker.dt;
        if (game.control.cooldownTime < 0)game.control.cooldownTime = 0;
    }
};