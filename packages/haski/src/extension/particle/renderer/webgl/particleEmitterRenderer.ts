// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ObjectRenderer from '../../../../renderer/objectRenderer';
import ParticleEmitter, { Particle } from '../../particleEmitter';
import GLRenderer from '../../../../renderer/webgl/glRenderer';
import Color from '@maths/color';
import Vector2d from '@maths/vector2d';
import Texture from '../../../../core/texture';
import { WHITE } from '../../../../core/renderTarget';

const staticIndices = [0, 1, 2, 0, 2, 3];
const staticTexIndices = [[0, 0], [1, 0], [1, 1], [0, 1]];

export default class ParticleEmitterRenderer implements ObjectRenderer<ParticleEmitter> {

    public readonly name: string = 'particleEmitter';

    private _vertexData: number[] = new Array<number>(14);

    private _tempLocalVertices: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    private _tempWorldVertices: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    private _tempNormalizeColor: RGBA = [0, 0, 0, 0];

    render(renderer: GLRenderer, emitter: ParticleEmitter) {
        const shader = renderer.switchShader('sprite');
        const texture = emitter.params.texture || WHITE;
        const { glTexture, rawData } = texture;
        if (glTexture.dirty || glTexture.id < 0) {
            if (!renderer.textureManager.upload(glTexture, rawData)) return [];
        }
        if (glTexture.id < 0 || emitter.particles.length <= 0) return [];
        if (emitter.params.additive) {
            renderer.setCompositionBlend('lighter');
        }
        emitter.particles.forEach((particle) => {
            this._fillVertexData(particle, emitter.worldMatrix, texture, emitter.globalOpacity);
            shader.vao.push(this._vertexData, staticIndices, 56);
        });
        renderer.setCompositionBlend('source-over');
    }

    private _fillVertexData(particle: Particle, wm: Mat2d, texture: Texture, opacity: number) {
        Vector2d.set(0, 0, this._tempLocalVertices[0]);
        Vector2d.set(particle.width, 0, this._tempLocalVertices[1]);
        Vector2d.set(particle.width, particle.height, this._tempLocalVertices[2]);
        Vector2d.set(0, particle.height, this._tempLocalVertices[3]);
        this._tempLocalVertices.forEach((v, i) => {
            Vector2d.transform(v, particle.matrix);
            Vector2d.transform(v, wm, this._tempWorldVertices[i]);
        });

        Color.normalize(particle.color, this._tempNormalizeColor);

        let c = 0;
        this._tempWorldVertices.forEach((v, i) => {
            this._vertexData[c++] = v[0];
            this._vertexData[c++] = v[1];
            this._vertexData[c++] = this._tempLocalVertices[i][0];
            this._vertexData[c++] = this._tempLocalVertices[i][1];
            this._vertexData[c++] = texture.glTexture.id;
            this._vertexData[c++] = staticTexIndices[i][0];
            this._vertexData[c++] = staticTexIndices[i][1];
            this._vertexData[c++] = texture.rawData.width;
            this._vertexData[c++] = texture.rawData.height;
            this._vertexData[c++] = this._tempNormalizeColor[0];
            this._vertexData[c++] = this._tempNormalizeColor[1];
            this._vertexData[c++] = this._tempNormalizeColor[2];
            this._vertexData[c++] = this._tempNormalizeColor[3];
            this._vertexData[c++] = opacity;
        });
    }
}