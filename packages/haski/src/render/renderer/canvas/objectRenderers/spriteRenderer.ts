// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ObjectRenderer from '../../objectRenderer';
import Sprite from '../../../../renderObject/sprite';
import CanvasRenderer from '../canvasRenderer';

export default class SpriteRenderer implements ObjectRenderer<Sprite> {

    public readonly name: string = 'sprite';

    render(renderer: CanvasRenderer, sprite: Sprite) {
        if (!sprite.texture) return;
        const ctx = renderer.curCtx;
        let { texture, textureRegion, size } = sprite;
        if (sprite.tint[0] < 255 || sprite.tint[1] < 255 || sprite.tint[2] < 255) {
            texture = sprite.tintTexture;
            ctx.globalAlpha = sprite.globalOpacity * sprite.tint[3];
        }
        ctx.drawImage(texture.rawData, textureRegion.x, textureRegion.y, textureRegion.width, textureRegion.height, 0, 0, size.width, size.height);
    }
}