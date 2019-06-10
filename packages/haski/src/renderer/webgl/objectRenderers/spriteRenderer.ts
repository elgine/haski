// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ObjectRenderer from '../../objectRenderer';
import Sprite from '../../../sprite/sprite';
import GLRenderer from '../glRenderer';
import Color from '@maths/color';
import Texture from '../../../core/texture';

export default class SpriteRenderer implements ObjectRenderer<Sprite> {

    public readonly name: string = 'sprite';

    private _nc: RGBA = [0, 0, 0, 0];
    private _vertexData: number[] = new Array(56);

    render(renderer: GLRenderer, sprite: Sprite) {
        if (!sprite.texture) return;
        const curShader = renderer.switchShader('sprite');
        const { glVertices, glWorldVertices, texture, glTexCoords, glIndices, tint, globalOpacity } = sprite;
        curShader.vao.push(this._fillVertexData(renderer, glWorldVertices, glVertices, glTexCoords, texture, tint, globalOpacity), glIndices);
    }

    private _fillVertexData(renderer: GLRenderer, wv: Vec2d[], lvs: Vec2d[], texCoords: Vec2d[], texture: Texture, tint: RGBA, opacity: number) {
        const { glTexture, rawData } = texture;
        if (glTexture.dirty || glTexture.id < 0) {
            if (!renderer.textureManager.upload(glTexture, rawData)) return [];
        }
        if (glTexture.id < 0) return [];
        Color.normalize(tint, this._nc);
        let offset = 0;
        wv.forEach((v, i) => {
            this._vertexData[offset + 0] = v[0];
            this._vertexData[offset + 1] = v[1];
            this._vertexData[offset + 2] = lvs[i][0];
            this._vertexData[offset + 3] = lvs[i][1];
            this._vertexData[offset + 4] = glTexture.id;
            this._vertexData[offset + 5] = texCoords[i][0];
            this._vertexData[offset + 6] = texCoords[i][1];
            this._vertexData[offset + 7] = rawData.width;
            this._vertexData[offset + 8] = rawData.height;
            this._vertexData[offset + 9] = this._nc[0];
            this._vertexData[offset + 10] = this._nc[1];
            this._vertexData[offset + 11] = this._nc[2];
            this._vertexData[offset + 12] = this._nc[3];
            this._vertexData[offset + 13] = opacity;
            offset += 14;
        });
        return this._vertexData;
    }
}