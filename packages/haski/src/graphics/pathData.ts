// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import Vector2d from '@maths/vector2d';
import computed, { getComputedInnerValue } from '@core/computed';
import SubPath from './subPath';
import PathDrawingStyle from './pathDrawingStyle';
import { FillStyle } from './fillStyle';

function updateVec2dArray<T, V>(source: T[], dest: V[], creator: Function, updator: Function, removor?: Function) {
    const sourceLen = source.length;
    const destLen = dest.length;
    for (let i = 0; i < sourceLen; i++) {
        let vec: V;
        if (i >= destLen) {
            vec = creator();
            dest.push(vec);
        } else {
            vec = dest[i];
        }
        updator(source[i], vec);
    }
    if (destLen > sourceLen) {
        let items = dest.splice(sourceLen, destLen - sourceLen);
        removor && removor(items);
    }
}

export enum PathDataType{
    FILL,
    STROKE
}

export default class PathData {

    readonly type: PathDataType = PathDataType.FILL;
    readonly matrix: Mat2d;
    subPaths: SubPath[];
    drawingStyle!: PathDrawingStyle;
    fillStyle!: FillStyle;

    @computed({ expression: 'computeGLData' })
    glVertices: Vec2d[] = [];

    @computed({ expression: 'computeGLData' })
    glIndices: number[] = [];

    @computed({ expression: 'computeGLWorldVertices' })
    glWorldVertices: Vec2d[] = [];

    protected _glDataDirty: boolean = true;
    protected _glWorldVerticesDirty: boolean = true;

    constructor(mat: Mat2d, subPaths: SubPath[], fillStyle?: FillStyle, drawingStyle?: PathDrawingStyle) {
        this.matrix = mat;
        this.subPaths = subPaths;
        if (fillStyle) this.fillStyle = fillStyle;
        if (drawingStyle) this.drawingStyle = drawingStyle;
    }

    setWorldVerticesDirty(v: boolean) {
        this._glWorldVerticesDirty = v;
    }

    computeGLData() {
        if (!this._glDataDirty) return;
        this._glDataDirty = false;
        const innerGLIndices = getComputedInnerValue(this, 'glIndices');
        const innerGLVertices = getComputedInnerValue(this, 'glVertices');
        innerGLVertices.length = 0;
        innerGLIndices.length = 0;
        this._doComputeGLData(innerGLVertices, innerGLIndices);
    }

    computeGLWorldVertices() {
        if (!this._glWorldVerticesDirty) return;
        this._glWorldVerticesDirty = false;
        const innerGLWorldVertices = getComputedInnerValue(this, 'glWorldVertices');
        updateVec2dArray(this.glVertices, innerGLWorldVertices, () => [0, 0], (source: Vec2d, dest: Vec2d) => {
            Vector2d.clone(source, dest);
            Vector2d.transform(dest, this.matrix);
        });
    }

    protected _doComputeGLData(vertices: Vec2d[], indices: number[]) {

    }
}