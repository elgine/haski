// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import earcut from 'earcut';
import PathData from './pathData';
import SubPath from './subPath';
import Vector2d from '@maths/vector2d';
import flatArr from '@utils/flatArr';

interface PolyData{
    vertices: Vec2d[];
    area: number;
    children: PolyData[];
}

export default class FillPathData extends PathData {

    protected _updateGLData() {
        super._updateGLData();
        // Wrap subPath
        const polys: PolyData[] = this.subPaths.map((subPath) => {
            return {
                vertices: subPath.vertices,
                children: [],
                area: this._calculateSubPathArea(subPath)
            };
        });
        polys.sort((a, b) => Math.abs(b.area) - Math.abs(a.area));

        // Find holes
        const root: PolyData[] = [];
        const subPathCount = polys.length;
        for (let i = 0; i < subPathCount; i++) {
            let parent: PolyData|null = null;
            for (let j = i - 1; j >= 0; --j) {
                // a contour is a hole if it is inside its parent and has different winding
                if (Vector2d.insidePolygon(polys[i].vertices[0], polys[j].vertices) &&
                    polys[i].area * polys[j].area < 0) {
                    parent = polys[j];
                    break;
                }
            }
            if (parent) {
                parent.children.push(polys[i]);
            } else {
                root.push(polys[i]);
            }
        }

        // Generate glData recursively
        let vertexCount = 0;
        const process = (poly: PolyData) => {
            const coords: Vec2d[] = poly.vertices.slice();
            const holes: number[] = [];
            poly.children.forEach((child) => {
                child.children.forEach(process);
                holes.push(coords.length);
                Array.prototype.push.apply(coords, child.vertices);
            });
            Array.prototype.push.apply(this._glVertices, coords);
            earcut(flatArr(coords).map(Number), holes).forEach((i) => {
                this._glIndices.push(i + vertexCount);
            });
            vertexCount += coords.length;
        };
        root.forEach(process);
    }

    private _calculateSubPathArea(subPath: SubPath) {
        let area = 0;
        let last = subPath.vertices[subPath.vertices.length - 1];
        subPath.vertices.forEach((next) => {
            area += 0.5 * Vector2d.cross(last, next);
            last = next;
        });
        return area;
    }
}