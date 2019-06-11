// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Game from '../game';
import { EPS } from '@maths/const';

export default (game: Game) => {
    game.blockManager.blocks.forEach((block) => {
        block.view.opacity = block.opacity;
        block.view.setSize3d(block.size);
        block.view.setPosition3d(block.pos);
        block.view.setRotation3d(block.rotation);
        block.view.setScale3d(block.scale);
        block.view.setColor(block.color);
        block.view.setAmbientLightOffset(game.lighting.ambientLightOffset);
        block.view.setColorDiff(game.lighting.ambientLightColorDiff);
        block.view.updateView();
    });
    const halfH = game.renderer.size.height * 0.5;
    if (Math.abs(game.stage.root.ty - game.blockManager.topBlock.pos[1] - halfH) > EPS) {
        if (game.tweenManager.contains(game.stage.root)) {
            game.tweenManager.remove(game.stage.root);
        }
        game.tweenManager.animate(game.stage.root, { ty: halfH + game.blockManager.topBlock.pos[1] }, 100, undefined, function(camera) {
            game.tweenManager.remove(game.stage.root);
        });
    }
};