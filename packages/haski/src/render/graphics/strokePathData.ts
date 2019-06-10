// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import PathData, { PathDataType } from './pathData';
import stroke from '@maths/stroke';

export default class StrokePathData extends PathData {
    public readonly type: PathDataType = PathDataType.STROKE;

    protected _updateGLData() {
        super._updateGLData();
        const { lineWidth, lineCap, lineJoin, miterLimit } = this.drawingStyle;
        let lastIndice = 0;
        this.subPaths.forEach((subPath) => {
            const indices: number[] = [];
            const coords: Vec2d[] = [];
            stroke(subPath.vertices, coords, indices, lineWidth, lineCap, lineJoin, miterLimit);
            Array.prototype.push.apply(this._glVertices, coords);
            Array.prototype.push.apply(this._glIndices, indices.map((i) => {
                return lastIndice + i;
            }));
            lastIndice += coords.length;
        });
    }
}