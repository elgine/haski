// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EPS } from './const';

/**
 * Affine matrix in 2d
 * @class
 */
export default class Matrix2d extends Array<number> {

    public static M11: number = 0;
    public static M12: number = 1;
    public static M13: number = 2;
    public static M21: number = 3;
    public static M22: number = 4;
    public static M23: number = 5;
    public static M31: number = 6;
    public static M32: number = 7;
    public static M33: number = 8;

    static create(
        m11: number = 1, m12: number = 0, m13: number = 0,
        m21: number = 0, m22: number = 1, m23: number = 0,
        m31: number = 0, m32: number = 0, m33: number = 1
    ) {
        let m = new Array<number>(9);
        this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33, m);
        return m;
    }

    static set(
        m11: number = 1, m12: number = 0, m13: number = 0,
        m21: number = 0, m22: number = 1, m23: number = 0,
        m31: number = 0, m32: number = 0, m33: number = 1, out: Mat2d
    ) {
        out[Matrix2d.M11] = m11;
        out[Matrix2d.M12] = m12;
        out[Matrix2d.M13] = m13;
        out[Matrix2d.M21] = m21;
        out[Matrix2d.M22] = m22;
        out[Matrix2d.M23] = m23;
        out[Matrix2d.M31] = m31;
        out[Matrix2d.M32] = m32;
        out[Matrix2d.M33] = m33;
        return out;
    }

    static clone(a: Mat2d, out: Mat2d) {
        out[Matrix2d.M11] = a[Matrix2d.M11];
        out[Matrix2d.M12] = a[Matrix2d.M12];
        out[Matrix2d.M13] = a[Matrix2d.M13];
        out[Matrix2d.M21] = a[Matrix2d.M21];
        out[Matrix2d.M22] = a[Matrix2d.M22];
        out[Matrix2d.M23] = a[Matrix2d.M23];
        out[Matrix2d.M31] = a[Matrix2d.M31];
        out[Matrix2d.M32] = a[Matrix2d.M32];
        out[Matrix2d.M33] = a[Matrix2d.M33];
        return out;
    }

    static reset(out: Mat2d) {
        out[Matrix2d.M11] = 1;
        out[Matrix2d.M12] = 0;
        out[Matrix2d.M13] = 0;
        out[Matrix2d.M21] = 0;
        out[Matrix2d.M22] = 1;
        out[Matrix2d.M23] = 0;
        out[Matrix2d.M31] = 0;
        out[Matrix2d.M32] = 0;
        out[Matrix2d.M33] = 1;
        return out;
    }

    static invert(a: Mat2d, out?: Mat2d) {
        out = out || a;
        const det = Matrix2d.determinant(a);
        if (det !== 0) {
            const invDet = 1 / det;
            // Calculate cofactor matrix components
            let m11 = a[Matrix2d.M22] * a[Matrix2d.M33] - a[Matrix2d.M23] * a[Matrix2d.M32];
            let m12 = a[Matrix2d.M13] * a[Matrix2d.M32] - a[Matrix2d.M12] * a[Matrix2d.M33];
            let m13 = a[Matrix2d.M12] * a[Matrix2d.M23] - a[Matrix2d.M22] * a[Matrix2d.M13];

            let m21 = a[Matrix2d.M23] * a[Matrix2d.M31] - a[Matrix2d.M21] * a[Matrix2d.M33];
            let m22 = a[Matrix2d.M11] * a[Matrix2d.M33] - a[Matrix2d.M13] * a[Matrix2d.M31];
            let m23 = a[Matrix2d.M13] * a[Matrix2d.M21] - a[Matrix2d.M11] * a[Matrix2d.M23];

            let m31 = a[Matrix2d.M21] * a[Matrix2d.M32] - a[Matrix2d.M22] * a[Matrix2d.M31];
            let m32 = a[Matrix2d.M12] * a[Matrix2d.M31] - a[Matrix2d.M11] * a[Matrix2d.M32];
            let m33 = a[Matrix2d.M11] * a[Matrix2d.M22] - a[Matrix2d.M12] * a[Matrix2d.M21];
            out[Matrix2d.M11] = m11 * invDet;
            out[Matrix2d.M12] = m12 * invDet;
            out[Matrix2d.M13] = m13 * invDet;
            out[Matrix2d.M21] = m21 * invDet;
            out[Matrix2d.M22] = m22 * invDet;
            out[Matrix2d.M23] = m23 * invDet;
            out[Matrix2d.M31] = m31 * invDet;
            out[Matrix2d.M32] = m32 * invDet;
            out[Matrix2d.M33] = m33 * invDet;
        }
        return out;
    }

    static determinant(a: Mat2d): number {
        return a[Matrix2d.M11] * (a[Matrix2d.M22] * a[Matrix2d.M33] - a[Matrix2d.M23] * a[Matrix2d.M32]) -
            a[Matrix2d.M12] * (a[Matrix2d.M21] * a[Matrix2d.M33] - a[Matrix2d.M23] * a[Matrix2d.M31]) +
            a[Matrix2d.M13] * (a[Matrix2d.M21] * a[Matrix2d.M32] - a[Matrix2d.M22] * a[Matrix2d.M31]);
    }

    static skew(a: Mat2d, v: Vec2d, out?: Mat2d) {
        out = out || a;
        let a11 = a[Matrix2d.M11]; let a12 = a[Matrix2d.M12]; let a13 = a[Matrix2d.M13];
        let a21 = a[Matrix2d.M21]; let a22 = a[Matrix2d.M22]; let a23 = a[Matrix2d.M23];
        let a31 = a[Matrix2d.M31]; let a32 = a[Matrix2d.M32]; let a33 = a[Matrix2d.M33];
        let sx = Math.tan(v[0]);
        let sy = Math.tan(v[1]);
        let b11 = 1;
        let b12 = sx;
        let b21 = sy;
        let b22 = 1;
        out[Matrix2d.M11] = b11 * a11 + b12 * a21;
        out[Matrix2d.M12] = b11 * a12 + b12 * a22;
        out[Matrix2d.M13] = b11 * a13 + b12 * a23;

        out[Matrix2d.M21] = b21 * a11 + b22 * a21;
        out[Matrix2d.M22] = b21 * a12 + b22 * a22;
        out[Matrix2d.M23] = b21 * a13 + b22 * a23;

        out[Matrix2d.M31] = a31;
        out[Matrix2d.M32] = a32;
        out[Matrix2d.M33] = a33;
        return out;
    }

    static rotate(a: Mat2d, rad: number, out?: Mat2d) {
        out = out || a;
        let a11 = a[Matrix2d.M11]; let a12 = a[Matrix2d.M12]; let a13 = a[Matrix2d.M13];
        let a21 = a[Matrix2d.M21]; let a22 = a[Matrix2d.M22]; let a23 = a[Matrix2d.M23];
        let a31 = a[Matrix2d.M31]; let a32 = a[Matrix2d.M32]; let a33 = a[Matrix2d.M33];
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let b11 = c;
        let b12 = -s;
        let b21 = s;
        let b22 = c;
        out[Matrix2d.M11] = b11 * a11 + b12 * a21;
        out[Matrix2d.M12] = b11 * a12 + b12 * a22;
        out[Matrix2d.M13] = b11 * a13 + b12 * a23;

        out[Matrix2d.M21] = b21 * a11 + b22 * a21;
        out[Matrix2d.M22] = b21 * a12 + b22 * a22;
        out[Matrix2d.M23] = b21 * a13 + b22 * a23;

        out[Matrix2d.M31] = a31;
        out[Matrix2d.M32] = a32;
        out[Matrix2d.M33] = a33;
        return out;
    }

    static scale(a: Mat2d, v: Vec2d, out?: Mat2d) {
        out = out || a;
        let a11 = a[Matrix2d.M11]; let a12 = a[Matrix2d.M12]; let a13 = a[Matrix2d.M13];
        let a21 = a[Matrix2d.M21]; let a22 = a[Matrix2d.M22]; let a23 = a[Matrix2d.M23];
        let a31 = a[Matrix2d.M31]; let a32 = a[Matrix2d.M32]; let a33 = a[Matrix2d.M33];
        let v0 = v[0]; let
            v1 = v[1];

        out[Matrix2d.M11] = a11 * v0;
        out[Matrix2d.M12] = a12 * v0;
        out[Matrix2d.M13] = a13 * v0;

        out[Matrix2d.M21] = a21 * v1;
        out[Matrix2d.M22] = a22 * v1;
        out[Matrix2d.M23] = a23 * v1;

        out[Matrix2d.M31] = a31;
        out[Matrix2d.M32] = a32;
        out[Matrix2d.M33] = a33;
        return out;
    }

    static translate(a: Mat2d, v: Vec2d, out?: Mat2d) {
        out = out || a;
        let a11 = a[Matrix2d.M11]; let a12 = a[Matrix2d.M12]; let a13 = a[Matrix2d.M13];
        let a21 = a[Matrix2d.M21]; let a22 = a[Matrix2d.M22]; let a23 = a[Matrix2d.M23];
        let a31 = a[Matrix2d.M31]; let a32 = a[Matrix2d.M32]; let a33 = a[Matrix2d.M33];
        let v0 = v[0]; let
            v1 = v[1];

        out[Matrix2d.M11] = a11;
        out[Matrix2d.M12] = a12;
        out[Matrix2d.M13] = a13 + v0;

        out[Matrix2d.M21] = a21;
        out[Matrix2d.M22] = a22;
        out[Matrix2d.M23] = a23 + v1;

        out[Matrix2d.M31] = a31;
        out[Matrix2d.M32] = a32;
        out[Matrix2d.M33] = a33;
        return out;
    }

    static fromRotation(rad: number, out: Mat2d) {
        let s = Math.sin(rad); let
            c = Math.cos(rad);
        out[Matrix2d.M11] = c;
        out[Matrix2d.M12] = -s;
        out[Matrix2d.M13] = 0;
        out[Matrix2d.M21] = s;
        out[Matrix2d.M22] = c;
        out[Matrix2d.M23] = 0;
        out[Matrix2d.M31] = 0;
        out[Matrix2d.M32] = 0;
        out[Matrix2d.M33] = 1;
        return out;
    }

    static fromScale(v: Vec2d, out: Mat2d) {
        out[Matrix2d.M11] = v[0];
        out[Matrix2d.M12] = 0;
        out[Matrix2d.M13] = 0;
        out[Matrix2d.M21] = 0;
        out[Matrix2d.M22] = v[1];
        out[Matrix2d.M23] = 0;
        out[Matrix2d.M31] = 0;
        out[Matrix2d.M32] = 0;
        out[Matrix2d.M33] = 1;
        return out;
    }

    static fromTranslation(v: Vec2d, out: Mat2d) {
        out[Matrix2d.M11] = 1;
        out[Matrix2d.M12] = 0;
        out[Matrix2d.M13] = v[0];
        out[Matrix2d.M21] = 0;
        out[Matrix2d.M22] = 1;
        out[Matrix2d.M23] = v[1];
        out[Matrix2d.M31] = 0;
        out[Matrix2d.M32] = 0;
        out[Matrix2d.M33] = 1;
        return out;
    }

    static add(a: Mat2d, b: Mat2d, out?: Mat2d) {
        out = out || a;
        out[Matrix2d.M11] = a[Matrix2d.M11] + b[Matrix2d.M11];
        out[Matrix2d.M12] = a[Matrix2d.M12] + b[Matrix2d.M12];
        out[Matrix2d.M13] = a[Matrix2d.M13] + b[Matrix2d.M13];
        out[Matrix2d.M21] = a[Matrix2d.M21] + b[Matrix2d.M21];
        out[Matrix2d.M22] = a[Matrix2d.M22] + b[Matrix2d.M22];
        out[Matrix2d.M23] = a[Matrix2d.M23] + b[Matrix2d.M23];
        out[Matrix2d.M31] = a[Matrix2d.M31] + b[Matrix2d.M31];
        out[Matrix2d.M32] = a[Matrix2d.M32] + b[Matrix2d.M32];
        out[Matrix2d.M33] = a[Matrix2d.M33] + b[Matrix2d.M33];
        return out;
    }

    static sub(a: Mat2d, b: Mat2d, out?: Mat2d) {
        out = out || a;
        out[Matrix2d.M11] = a[Matrix2d.M11] - b[Matrix2d.M11];
        out[Matrix2d.M12] = a[Matrix2d.M12] - b[Matrix2d.M12];
        out[Matrix2d.M13] = a[Matrix2d.M13] - b[Matrix2d.M13];
        out[Matrix2d.M21] = a[Matrix2d.M21] - b[Matrix2d.M21];
        out[Matrix2d.M22] = a[Matrix2d.M22] - b[Matrix2d.M22];
        out[Matrix2d.M23] = a[Matrix2d.M23] - b[Matrix2d.M23];
        out[Matrix2d.M31] = a[Matrix2d.M31] - b[Matrix2d.M31];
        out[Matrix2d.M32] = a[Matrix2d.M32] - b[Matrix2d.M32];
        out[Matrix2d.M33] = a[Matrix2d.M33] - b[Matrix2d.M33];
        return out;
    }

    static mul(a: Mat2d, b: Mat2d|number, out?: Mat2d) {
        out = out || a;
        if (typeof b === 'number') {
            out[Matrix2d.M11] = a[Matrix2d.M11] * b;
            out[Matrix2d.M12] = a[Matrix2d.M12] * b;
            out[Matrix2d.M13] = a[Matrix2d.M13] * b;
            out[Matrix2d.M21] = a[Matrix2d.M21] * b;
            out[Matrix2d.M22] = a[Matrix2d.M22] * b;
            out[Matrix2d.M23] = a[Matrix2d.M23] * b;
            out[Matrix2d.M31] = a[Matrix2d.M31] * b;
            out[Matrix2d.M32] = a[Matrix2d.M32] * b;
            out[Matrix2d.M33] = a[Matrix2d.M33] * b;
        } else {
            let a11 = a[Matrix2d.M11]; let a12 = a[Matrix2d.M12]; let a13 = a[Matrix2d.M13];
            let a21 = a[Matrix2d.M21]; let a22 = a[Matrix2d.M22]; let a23 = a[Matrix2d.M23];
            let a31 = a[Matrix2d.M31]; let a32 = a[Matrix2d.M32]; let a33 = a[Matrix2d.M33];
            let b11 = b[Matrix2d.M11]; let b12 = b[Matrix2d.M12]; let b13 = b[Matrix2d.M13];
            let b21 = b[Matrix2d.M21]; let b22 = b[Matrix2d.M22]; let b23 = b[Matrix2d.M23];
            let b31 = b[Matrix2d.M31]; let b32 = b[Matrix2d.M32]; let
                b33 = b[Matrix2d.M33];

            out[0] = a11 * b11 + a12 * b21 + a13 * b31;
            out[1] = a11 * b12 + a12 * b22 + a13 * b32;
            out[2] = a11 * b13 + a12 * b23 + a13 * b33;

            out[3] = a21 * b11 + a22 * b21 + a23 * b31;
            out[4] = a21 * b12 + a22 * b22 + a23 * b32;
            out[5] = a21 * b13 + a22 * b23 + a23 * b33;

            out[6] = a31 * b11 + a32 * b21 + a33 * b31;
            out[7] = a31 * b12 + a32 * b22 + a33 * b32;
            out[8] = a31 * b13 + a32 * b23 + a33 * b33;
        }
        return out;
    }

    static transpose(m: Mat2d, out: Mat2d) {
        out[Matrix2d.M11] = m[Matrix2d.M11];
        out[Matrix2d.M12] = m[Matrix2d.M21];
        out[Matrix2d.M13] = m[Matrix2d.M31];
        out[Matrix2d.M21] = m[Matrix2d.M12];
        out[Matrix2d.M22] = m[Matrix2d.M22];
        out[Matrix2d.M23] = m[Matrix2d.M32];
        out[Matrix2d.M31] = m[Matrix2d.M13];
        out[Matrix2d.M32] = m[Matrix2d.M23];
        out[Matrix2d.M33] = m[Matrix2d.M33];
        return out;
    }

    static equals(a: Mat2d, b: Mat2d) {
        return Math.abs(a[Matrix2d.M11] - b[Matrix2d.M11]) <= EPS &&
            Math.abs(a[Matrix2d.M12] - b[Matrix2d.M12]) <= EPS &&
            Math.abs(a[Matrix2d.M13] - b[Matrix2d.M13]) <= EPS &&
            Math.abs(a[Matrix2d.M21] - b[Matrix2d.M21]) <= EPS &&
            Math.abs(a[Matrix2d.M22] - b[Matrix2d.M22]) <= EPS &&
            Math.abs(a[Matrix2d.M23] - b[Matrix2d.M23]) <= EPS &&
            Math.abs(a[Matrix2d.M31] - b[Matrix2d.M31]) <= EPS &&
            Math.abs(a[Matrix2d.M32] - b[Matrix2d.M32]) <= EPS &&
            Math.abs(a[Matrix2d.M33] - b[Matrix2d.M33]) <= EPS;
    }

    /**
     * Decomposing a 2d matrix in QR composition
     * @param a
     * @param out
     */
    static decompose(mat: Mat2d, out: ITransform2d) {
        const a = mat[Matrix2d.M11];
        const b = mat[Matrix2d.M12];
        const c = mat[Matrix2d.M21];
        const d = mat[Matrix2d.M22];
        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);
        const delta = Math.abs(skewX + skewY);
        if (delta < EPS || Math.abs(Math.PI * 0.5 - delta) < EPS) {
            out.rotation = skewY;
            if (a < 0 && d >= 0) {
                out.rotation += (out.rotation <= 0) ? Math.PI : -Math.PI;
            }
            out.skew[0] = out.skew[1] = 0;
        } else {
            out.rotation = 0;
            out.skew[0] = skewX;
            out.skew[1] = skewY;
        }
        out.scale[0] = Math.sqrt((a * a) + (b * b));
        out.scale[1] = Math.sqrt((c * c) + (d * d));
        out.translation[0] = mat[Matrix2d.M13];
        out.translation[1] = mat[Matrix2d.M23];
        return out;
    }

    /**
     * Recomposing a 2d matrix
     * @param c
     * @param out
     */
    static recompose(com: ITransform2d, pivot: Vec2d, out: Mat2d) {
        Matrix2d.reset(out);
        Matrix2d.translate(out, [-pivot[0], -pivot[1]]);
        Matrix2d.rotate(out, com.rotation);
        Matrix2d.skew(out, com.skew);
        Matrix2d.scale(out, com.scale);
        Matrix2d.translate(out, pivot);
        Matrix2d.translate(out, com.translation);
        // Matrix2d.translate(out, pivot);
        return out;
    }
}