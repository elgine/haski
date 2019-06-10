// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vector2d from './vector2d';
import Matrix2d from './matrix2d';
import computed, { getComputedInnerValue } from '@core/computed';
import observable, { setObservableInnerValue } from '@core/observable';
import Emitter from '@core/emitter';

const composeComponents = {
    translation: [0, 0],
    scale: [1, 1],
    rotation: 0,
    skew: [0, 0]
};

const compose = (t: Transform2d) => {
    Vector2d.set(t.skx, t.sky, composeComponents.skew);
    Vector2d.set(t.tx, t.ty, composeComponents.translation);
    Vector2d.set(t.sx, t.sy, composeComponents.scale);
    composeComponents.rotation = t.r;
    let innerMat = getComputedInnerValue(t, 'matrix');
    let innerInvMatrix = getComputedInnerValue(t, 'invMatrix');
    Matrix2d.recompose(composeComponents, [t.px, t.py], innerMat);
    Matrix2d.invert(innerMat, innerInvMatrix);
};

const decompose = (t: Transform2d) => {
    Matrix2d.decompose(t.matrix, composeComponents);
    setObservableInnerValue(t, 'tx', composeComponents.translation[0]);
    setObservableInnerValue(t, 'ty', composeComponents.translation[1]);
    setObservableInnerValue(t, 'sx', composeComponents.scale[0]);
    setObservableInnerValue(t, 'sy', composeComponents.scale[1]);
    setObservableInnerValue(t, 'r', composeComponents.rotation);
    setObservableInnerValue(t, 'skx', composeComponents.skew[0]);
    setObservableInnerValue(t, 'sky', composeComponents.skew[1]);
};

/**
 * Transform in 2d
 * @class
 */
export default class Transform2d extends Emitter {

    public static ON_MATRIX_DIRTY = 'ON_MATRIX_DIRTY';
    public static ON_BEFORE_MATRIX_UPDATE = 'ON_BEFORE_MATRIX_UPDATE';
    public static ON_MATRIX_UPDATED = 'ON_MATRIX_UPDATED';

    @observable({ onDirty: 'setMatrixDirty' })
    tx: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    ty: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    sx: number = 1;

    @observable({ onDirty: 'setMatrixDirty' })
    sy: number = 1;

    @observable({ onDirty: 'setMatrixDirty' })
    r: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    px: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    py: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    skx: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    sky: number = 0;

    @computed({ expression: 'updateMatrix' })
    matrix: Mat2d = Matrix2d.create();

    @computed({ expression: 'updateMatrix' })
    invMatrix: Mat2d = Matrix2d.create();

    /**
     * Flag matrix need to update
     */
    protected _matrixDirty: boolean = false;

    setMatrixDirty(v: boolean = true) {
        if (this._matrixDirty === v) return;
        this._matrixDirty = v;
        if (v) this.emit(Transform2d.ON_MATRIX_DIRTY, this);
    }

    /**
     * Update translation, scale, rotation according to it's matrix
     */
    updateComponents() {
        decompose(this);
    }

    /**
     * Update matrix according to translation, scale, rotation vectors
     */
    updateMatrix() {
        if (!this._matrixDirty) return;
        this.emit(Transform2d.ON_BEFORE_MATRIX_UPDATE, this);
        compose(this);
        this.emit(Transform2d.ON_MATRIX_UPDATED, this);
        this._matrixDirty = false;
        return this.matrix;
    }

    clone(t: Transform2d) {
        this.setMatrix(t.matrix);
        this.px = t.px;
        this.py = t.py;
        this.sx = t.sx;
        this.sy = t.sy;
        this.skx = t.skx;
        this.sky = t.sky;
        this.r = t.r;
        this.tx = t.tx;
        this.ty = t.ty;
    }

    setTransform(translation: Vec2d, scale: Vec2d, rotation: number, skew: Vec2d) {
        this.setTranslation(translation);
        this.setScale(scale);
        this.r = rotation;
        this.setSkew(skew);
    }

    setMatrix(m: Mat2d) {
        if (Matrix2d.equals(this.matrix, m)) return;
        Matrix2d.clone(m, this.matrix);
        Matrix2d.invert(this.matrix, this.invMatrix);
        this.updateComponents();
    }

    setSkew(v: Vec2d) {
        this.skx = v[0];
        this.sky = v[1];
    }

    setTranslation(v: Vec2d) {
        this.tx = v[0];
        this.ty = v[1];
    }

    setScale(v: Vec2d) {
        this.sx = v[0];
        this.sy = v[1];
    }

    setPivot(v: Vec2d) {
        this.px = v[0];
        this.py = v[1];
    }

    translate(x: number|Vec2d, y?: number) {
        if (typeof x === 'number') {
            this.tx += x;
            this.ty += x;
        } else {
            this.tx += x[0];
            this.ty += x[1];
        }
    }

    scale(x: number|Vec2d, y?: number) {
        if (typeof x === 'number') {
            this.sx *= x;
            this.sy *= x;
        } else {
            this.sx *= x[0];
            this.sy *= x[1];
        }
    }

    skew(v: Vec2d) {
        this.skx += v[0];
        this.sky += v[1];
    }

    rotate(v: number) {
        this.r += v;
    }

    reset() {
        this.tx = this.ty = this.r = this.r = this.skx = this.sky = 0;
        this.sx = this.sy = 1;
    }

    flipX() {
        this.sx *= -1;
    }

    flipY() {
        this.sy *= -1;
    }
}