// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vector3d from './vector3d';
import Matrix3d from './matrix3d';
import Quaternions from './quaternions';
import Emitter from '@core/emitter';
import observable from '@core/observable';
import computed from '@core/computed';

const composeComponents = {
    translation: [0, 0, 0],
    scale: [1, 1, 1],
    skew: [0, 0, 0],
    rotation: [0, 0, 0, 0]
};
const quat = [0, 0, 0, 0];

const compose = (t: Transform3d) => {
    Vector3d.set(t.tx, t.ty, t.tz, composeComponents.translation);
    Vector3d.set(t.sx, t.sy, t.sz, composeComponents.scale);
    Quaternions.clone(t.r, composeComponents.rotation);
    Vector3d.set(t.skyz, t.skxz, t.skxy, composeComponents.skew);
    Matrix3d.recompose(composeComponents, [t.px, t.py, t.pz], t.matrix);
};

const decompose = (t: Transform3d) => {
    Matrix3d.decompose(t.matrix, composeComponents);
    t.tx = composeComponents.translation[0];
    t.ty = composeComponents.translation[1];
    t.tz = composeComponents.translation[2];
    t.sx = composeComponents.scale[0];
    t.sy = composeComponents.scale[1];
    t.sz = composeComponents.scale[2];
    t.r = composeComponents.rotation;
    t.skyz = composeComponents.skew[0];
    t.skxz = composeComponents.skew[1];
    t.skxy = composeComponents.skew[2];
};

/**
 * Transform in 3d coordinate
 * @class
 */
export default class Transform3d extends Emitter {

    public static ON_MATRIX_DIRTY = 'ON_MATRIX_DIRTY';
    public static ON_BEFORE_MATRIX_UPDATE = 'ON_BEFORE_MATRIX_UPDATE';
    public static ON_MATRIX_UPDATED = 'ON_MATRIX_UPDATED';

    @observable({ onDirty: 'setMatrixDirty' })
    tx: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    ty: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    tz: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    sx: number = 1;

    @observable({ onDirty: 'setMatrixDirty' })
    sy: number = 1;

    @observable({ onDirty: 'setMatrixDirty' })
    sz: number = 1;

    @observable({ equals: Quaternions.equals, setter: Quaternions.clone, onDirty: 'setMatrixDirty' })
    r: Quaternions = [0, 0, 0, 0];

    @observable({ onDirty: 'setMatrixDirty' })
    px: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    py: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    pz: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    skxy: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    skyz: number = 0;

    @observable({ onDirty: 'setMatrixDirty' })
    skxz: number = 0;

    @computed({ expression: 'updateMatrix' })
    matrix: Mat3d = Matrix3d.create();

    @computed({ expression: 'updateMatrix' })
    invMatrix: Mat3d = Matrix3d.create();

    protected _locked: boolean = false;

    /**
     * Flag matrix need to update
     */
    protected _matrixDirty: boolean = false;

    setMatrixDirty(v: boolean = true) {
        if (this._locked || this._matrixDirty === v) return;
        this._matrixDirty = v;
        if (v) this.emit(Transform3d.ON_MATRIX_DIRTY, this);
    }

    lock() {
        this._locked = true;
    }

    unlock() {
        this._locked = false;
    }

    /**
     * Update translation, scale, rotation according to it's matrix
     */
    updateComponents() {
        this.lock();
        decompose(this);
        this.unlock();
    }

    /**
     * Update matrix according to translation, scale, rotation vectors
     */
    updateMatrix() {
        this.emit(Transform3d.ON_BEFORE_MATRIX_UPDATE, this);
        compose(this);
        this.emit(Transform3d.ON_MATRIX_UPDATED, this);
    }

    setMatrix(m: Mat3d) {
        Matrix3d.clone(m, this.matrix);
        this.updateComponents();
        return this;
    }

    setSkew(v: Vec3d) {
        this.skxy = v[2];
        this.skxz = v[1];
        this.skyz = v[0];
        return this;
    }

    setTranslation(v: Vec3d) {
        this.tx = v[0];
        this.ty = v[1];
        this.tz = v[2];
        return this;
    }

    setScale(v: Vec3d) {
        this.sx = v[0];
        this.sy = v[1];
        this.sz = v[2];
        return this;
    }

    setRotation(q: Quat) {
        this.r = q;
        return this;
    }

    setRotationAxisRad(v: AxisRad) {
        Quaternions.fromAxisRotation(v, quat);
        this.setRotation(quat);
        return this;
    }

    setPivot(v: Vec3d) {
        this.px = v[0];
        this.py = v[1];
        this.pz = v[2];
        return this;
    }

    translate(v: number|Vec3d) {
        if (typeof v === 'number') {
            this.tx += v;
            this.ty += v;
            this.tz += v;
        } else {
            this.tx += v[0];
            this.ty += v[1];
            this.tz += v[2];
        }
        return this;
    }

    scale(v: number|Vec3d) {
        if (typeof v === 'number') {
            this.sx *= v;
            this.sy *= v;
            this.sz *= v;
        } else {
            this.sx *= v[0];
            this.sy *= v[1];
            this.sz *= v[2];
        }
        return this;
    }

    rotate(q: Quat) {
        Vector3d.add(this.r, q, quat);
        this.setRotation(quat);
        return this;
    }

    rotateAxis(a: AxisRad) {
        Quaternions.addAxis(this.r, a, quat);
        this.setRotation(quat);
        return this;
    }

    skew(v: Vec3d) {
        this.skyz += v[0];
        this.skxz += v[1];
        this.skxy += v[2];
        return this;
    }

    reset() {
        this.tx = this.ty = this.tz = 0;
        this.px = this.py = this.pz = 0;
        this.skxy = this.skxz = this.skyz = 0;
        this.sx = this.sy = this.sz = 1;
        Quaternions.reset(this.r);
        return this;
    }
}