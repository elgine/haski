// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Color from '@maths/color';
import Vector2d from '@maths/vector2d';
import ObjectRenderer from '../../objectRenderer';
import Graphics from '../../../graphics/graphics';
import GLRenderer from '../glRenderer';
import { isPattern, isGradient } from '../../../graphics/fillStyle';
import { WHITE } from '../../../core/renderTarget';
import Pattern from '../../../graphics/pattern';
import { Gradient, isLinearGradient, LinearGradient, RadialGradient } from '../../../graphics/gradient';
import PathData from '../../../graphics/pathData';

const normMat = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export default class GraphicsRenderer implements ObjectRenderer<Graphics> {

    public readonly name: string = 'graphics';

    private _nc: RGBA = [0, 0, 0, 0];
    private _vertexData: number[] = new Array(9000);

    private _patternTexRegion: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];

    render(renderer: GLRenderer, graphics: Graphics) {
        if (graphics.globalOpacity <= 0) return;
        const opacity = graphics.globalOpacity;
        graphics.pathDatas.forEach((path) => {
            let { fillStyle } = path;
            if (isPattern(fillStyle)) {
                this._pushPatternVertexDataArray(renderer, path, fillStyle as Pattern, opacity);
            } else if (isGradient(fillStyle)) {
                this._pushGradientVertexDataArray(renderer, path, fillStyle as Gradient, opacity);
            } else {
                this._pushColorVertexDataArray(renderer, path, fillStyle as ColorRawData, opacity);
            }
        });
    }

    private _pushPatternVertexDataArray(renderer: GLRenderer, path: PathData, pattern: Pattern, opacity: number) {
        const shader = renderer.switchShader('pattern');
        const { texture, matrix, repeat } = pattern;
        const rx = repeat === 'repeat' || repeat === 'repeat-x' ? 1 : 0;
        const ry = repeat === 'repeat' || repeat === 'repeat-y' ? 1 : 0;
        const gt = texture.glTexture;
        if (gt.dirty || gt.id < 0) {
            renderer.textureManager.upload(gt, texture.rawData);
        }
        if (gt.id < 0) return;
        const tw = texture.rawData.width; const
            th = texture.rawData.height;
        const m = matrix || normMat;
        Vector2d.set(0, 0, this._patternTexRegion[0]);
        Vector2d.set(tw, 0, this._patternTexRegion[1]);
        Vector2d.set(tw, th, this._patternTexRegion[2]);
        Vector2d.set(0, th, this._patternTexRegion[3]);
        this._patternTexRegion.forEach((v) => Vector2d.transform(v, m));
        let { glVertices, glWorldVertices, glIndices } = path;
        let count = 0;
        glVertices.forEach((v, i) => {
            this._vertexData[count + 0] = glWorldVertices[i][0];
            this._vertexData[count + 1] = glWorldVertices[i][1];
            this._vertexData[count + 2] = v[0];
            this._vertexData[count + 3] = v[1];
            this._vertexData[count + 4] = gt.id;
            this._vertexData[count + 5] = tw;
            this._vertexData[count + 6] = th;
            this._vertexData[count + 7] = rx;
            this._vertexData[count + 8] = ry;

            this._vertexData[count + 9] = this._patternTexRegion[0][0];
            this._vertexData[count + 10] = this._patternTexRegion[0][1];
            this._vertexData[count + 11] = this._patternTexRegion[1][0];
            this._vertexData[count + 12] = this._patternTexRegion[1][1];
            this._vertexData[count + 13] = this._patternTexRegion[2][0];
            this._vertexData[count + 14] = this._patternTexRegion[2][1];
            this._vertexData[count + 15] = opacity;
            count += 16;
        });
        shader.vao.push(this._vertexData, glIndices, count);
    }

    private _pushGradientVertexDataArray(renderer: GLRenderer, path: PathData, gradient: Gradient, opacity: number) {
        const shader = renderer.switchShader('gradient');
        const isLinear = isLinearGradient(gradient);
        let start: Vec3d = [0, 0, 0]; let
            end: Vec3d = [0, 0, 0];
        let { colors, stops } = gradient;
        let stopCount = stops.length;
        if (isLinear) {
            let linearGradient = gradient as LinearGradient;
            Vector2d.clone(linearGradient.s, start);
            Vector2d.clone(linearGradient.e, end);
        } else {
            let radialGradient = gradient as RadialGradient;
            Vector2d.clone(radialGradient.sc, start);
            start[2] = radialGradient.sr;
            Vector2d.clone(radialGradient.ec, end);
            end[2] = radialGradient.er;
        }
        let count = 0;
        let { glVertices, glWorldVertices, glIndices } = path;
        glVertices.forEach((v, i) => {
            this._vertexData[count + 0] = glWorldVertices[i][0];
            this._vertexData[count + 1] = glWorldVertices[i][1];
            this._vertexData[count + 2] = v[0];
            this._vertexData[count + 3] = v[1];
            this._vertexData[count + 4] = start[0];
            this._vertexData[count + 5] = start[1];
            this._vertexData[count + 6] = start[2];
            this._vertexData[count + 7] = end[0];
            this._vertexData[count + 8] = end[1];
            this._vertexData[count + 9] = end[2];
            for (let i = 0; i < 4; i++) {
                this._vertexData[count + 10 + i] = i < stopCount ? stops[i] : 0;
                if (stopCount > i) {
                    Color.normalize(Color.set(colors[i], this._nc));
                }
                this._vertexData[count + 14 + i * 4] = this._nc[0];
                this._vertexData[count + 14 + i * 4 + 1] = this._nc[1];
                this._vertexData[count + 14 + i * 4 + 2] = this._nc[2];
                this._vertexData[count + 14 + i * 4 + 3] = this._nc[3];
            }
            this._vertexData[count + 30] = opacity;
            count += 31;
        });
        shader.vao.push(this._vertexData, glIndices, count);
    }

    private _pushColorVertexDataArray(renderer: GLRenderer, path: PathData, color: ColorRawData, opacity: number) {
        Color.normalize(Color.set(color, this._nc));
        if (this._nc[3] <= 0) return;
        const shader = renderer.switchShader('sprite');
        const texture = WHITE;
        const gt = texture.glTexture;
        if (gt.dirty || gt.id < 0) {
            renderer.textureManager.upload(gt, texture.rawData);
        }
        if (gt.id < 0) return;
        let count = 0;
        let { glVertices, glWorldVertices, glIndices } = path;
        glVertices.forEach((v, i) => {
            this._vertexData[count + 0] = glWorldVertices[i][0];
            this._vertexData[count + 1] = glWorldVertices[i][1];
            this._vertexData[count + 2] = v[0];
            this._vertexData[count + 3] = v[1];
            this._vertexData[count + 4] = gt.id;
            this._vertexData[count + 5] = 0;
            this._vertexData[count + 6] = 0;
            this._vertexData[count + 7] = 16;
            this._vertexData[count + 8] = 16;
            this._vertexData[count + 9] = this._nc[0];
            this._vertexData[count + 10] = this._nc[1];
            this._vertexData[count + 11] = this._nc[2];
            this._vertexData[count + 12] = this._nc[3];
            this._vertexData[count + 13] = opacity;
            count += 14;
        });
        shader.vao.push(this._vertexData, glIndices, count);
    }
}