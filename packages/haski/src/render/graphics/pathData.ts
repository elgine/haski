// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import SubPath from './subPath';
import PathDrawingStyle from '../base/pathDrawingStyle';
import { FillStyle } from '../base/fillStyle';
import Vector2d from '@maths/vector2d';

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
    public readonly type: PathDataType = PathDataType.FILL;
    public wm: Mat2d;
    public subPaths: SubPath[];
    public drawingStyle!: PathDrawingStyle;
    public fillStyle!: FillStyle;
    protected _glVertices: Vec2d[] = [];
    protected _glWorldVertices: Vec2d[] = [];
    protected _glIndices: number[] = [];
    protected _glDataDirty: boolean = true;
    protected _glWorldVerticesDirty: boolean = true;

    constructor(wm: Mat2d, subPaths: SubPath[]) {
        this.wm = wm;
        this.subPaths = subPaths;
    }

    setWorldVerticesDirty(v: boolean) {
        this._glWorldVerticesDirty = v;
    }

    protected _makesureGLDataNewest() {
        if (this._glDataDirty) {
            this._updateGLData();
            this._glDataDirty = false;
        }
    }

    protected _updateGLData() {
        this._glIndices.length = 0;
        this._glVertices.length = 0;
    }

    protected _updateGLWorldVertices() {
        updateVec2dArray(this.glVertices, this._glWorldVertices, () => [0, 0], (source: Vec2d, dest: Vec2d) => {
            Vector2d.clone(source, dest);
            if (this.wm) {
                Vector2d.transform(dest, this.wm);
            }
        });
    }

    get glIndices() {
        this._makesureGLDataNewest();
        return this._glIndices;
    }

    get glVertices() {
        this._makesureGLDataNewest();
        return this._glVertices;
    }

    get glWorldVertices() {
        if (this._glWorldVerticesDirty) {
            this._updateGLWorldVertices();
            this._glWorldVerticesDirty = false;
        }
        return this._glWorldVertices;
    }
}