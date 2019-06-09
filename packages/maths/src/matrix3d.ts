// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EPS } from './const';
import Vector3d from './vector3d';
import Quaternions from './quaternions';

export default class Matrix3d extends Array<number> {
    public static M11: number = 0;
    public static M12: number = 1;
    public static M13: number = 2;
    public static M14: number = 3;
    public static M21: number = 4;
    public static M22: number = 5;
    public static M23: number = 6;
    public static M24: number = 7;
    public static M31: number = 8;
    public static M32: number = 9;
    public static M33: number = 10;
    public static M34: number = 11;
    public static M41: number = 12;
    public static M42: number = 13;
    public static M43: number = 14;
    public static M44: number = 15;

    static create(
        m11: number = 1, m12: number = 0, m13: number = 0, m14: number = 0,
        m21: number = 0, m22: number = 1, m23: number = 0, m24: number = 0,
        m31: number = 0, m32: number = 0, m33: number = 1, m34: number = 0,
        m41: number = 0, m42: number = 0, m43: number = 0, m44: number = 1
    ) {
        let m = new Array<number>(16);
        this.set(
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44, m
        );
        return m;
    }

    static set(
        m11: number = 1, m12: number = 0, m13: number = 0, m14: number = 0,
        m21: number = 0, m22: number = 1, m23: number = 0, m24: number = 0,
        m31: number = 0, m32: number = 0, m33: number = 1, m34: number = 0,
        m41: number = 0, m42: number = 0, m43: number = 0, m44: number = 1, out: Mat3d
    ) {
        out[Matrix3d.M11] = m11;
        out[Matrix3d.M12] = m12;
        out[Matrix3d.M13] = m13;
        out[Matrix3d.M14] = m14;
        out[Matrix3d.M21] = m21;
        out[Matrix3d.M22] = m22;
        out[Matrix3d.M23] = m23;
        out[Matrix3d.M24] = m24;
        out[Matrix3d.M31] = m31;
        out[Matrix3d.M32] = m32;
        out[Matrix3d.M33] = m33;
        out[Matrix3d.M34] = m34;
        out[Matrix3d.M41] = m41;
        out[Matrix3d.M42] = m42;
        out[Matrix3d.M43] = m43;
        out[Matrix3d.M44] = m44;
        return out;
    }

    static clone(m: Mat3d, out: Mat3d) {
        if (m === out) return out;
        out[Matrix3d.M11] = m[Matrix3d.M11]; out[Matrix3d.M12] = m[Matrix3d.M12]; out[Matrix3d.M13] = m[Matrix3d.M13]; out[Matrix3d.M14] = m[Matrix3d.M14];
        out[Matrix3d.M21] = m[Matrix3d.M21]; out[Matrix3d.M22] = m[Matrix3d.M22]; out[Matrix3d.M23] = m[Matrix3d.M23]; out[Matrix3d.M24] = m[Matrix3d.M24];
        out[Matrix3d.M31] = m[Matrix3d.M31]; out[Matrix3d.M32] = m[Matrix3d.M32]; out[Matrix3d.M33] = m[Matrix3d.M33]; out[Matrix3d.M34] = m[Matrix3d.M34];
        out[Matrix3d.M41] = m[Matrix3d.M41]; out[Matrix3d.M42] = m[Matrix3d.M42]; out[Matrix3d.M43] = m[Matrix3d.M43]; out[Matrix3d.M44] = m[Matrix3d.M44];
        return out;
    }

    static reset(m: Mat3d) {
        m[Matrix3d.M11] = m[Matrix3d.M22] = m[Matrix3d.M33] = m[Matrix3d.M44] = 1;
        m[Matrix3d.M12] = m[Matrix3d.M13] = m[Matrix3d.M14] = 0;
        m[Matrix3d.M21] = m[Matrix3d.M23] = m[Matrix3d.M24] = 0;
        m[Matrix3d.M31] = m[Matrix3d.M32] = m[Matrix3d.M34] = 0;
        m[Matrix3d.M41] = m[Matrix3d.M42] = m[Matrix3d.M43] = 0;
        return m;
    }

    static add(m1: Mat3d, m2: Mat3d|number, out?: Mat3d) {
        out = out || m1;
        if (typeof m2 === 'number') {
            out[Matrix3d.M11] = m1[Matrix3d.M11] + m2;
            out[Matrix3d.M12] = m1[Matrix3d.M12] + m2;
            out[Matrix3d.M13] = m1[Matrix3d.M13] + m2;

            out[Matrix3d.M21] = m1[Matrix3d.M21] + m2;
            out[Matrix3d.M22] = m1[Matrix3d.M22] + m2;
            out[Matrix3d.M23] = m1[Matrix3d.M23] + m2;

            out[Matrix3d.M31] = m1[Matrix3d.M31] + m2;
            out[Matrix3d.M32] = m1[Matrix3d.M32] + m2;
            out[Matrix3d.M33] = m1[Matrix3d.M33] + m2;

            out[Matrix3d.M41] = m1[Matrix3d.M41] + m2;
            out[Matrix3d.M42] = m1[Matrix3d.M42] + m2;
            out[Matrix3d.M43] = m1[Matrix3d.M43] + m2;
        } else {
            out[Matrix3d.M41] = m1[Matrix3d.M41] + m2[Matrix3d.M41];
            out[Matrix3d.M42] = m1[Matrix3d.M42] + m2[Matrix3d.M42];
            out[Matrix3d.M43] = m1[Matrix3d.M43] + m2[Matrix3d.M43];

            out[Matrix3d.M11] = m1[Matrix3d.M11] + m2[Matrix3d.M11];
            out[Matrix3d.M12] = m1[Matrix3d.M12] + m2[Matrix3d.M12];
            out[Matrix3d.M13] = m1[Matrix3d.M13] + m2[Matrix3d.M13];

            out[Matrix3d.M21] = m1[Matrix3d.M21] + m2[Matrix3d.M21];
            out[Matrix3d.M22] = m1[Matrix3d.M22] + m2[Matrix3d.M22];
            out[Matrix3d.M23] = m1[Matrix3d.M23] + m2[Matrix3d.M23];

            out[Matrix3d.M31] = m1[Matrix3d.M31] + m2[Matrix3d.M31];
            out[Matrix3d.M32] = m1[Matrix3d.M32] + m2[Matrix3d.M32];
            out[Matrix3d.M33] = m1[Matrix3d.M33] + m2[Matrix3d.M33];
        }
        return out;
    }

    static sub(m1: Mat3d, m2: Mat3d|number, out?: Mat3d) {
        out = out || m1;
        if (typeof m2 === 'number') {
            out[Matrix3d.M44] = m1[Matrix3d.M44] - m2;
            out[Matrix3d.M41] = m1[Matrix3d.M41] - m2;
            out[Matrix3d.M42] = m1[Matrix3d.M42] - m2;
            out[Matrix3d.M43] = m1[Matrix3d.M43] - m2;
            out[Matrix3d.M14] = m1[Matrix3d.M14] - m2;
            out[Matrix3d.M11] = m1[Matrix3d.M11] - m2;
            out[Matrix3d.M12] = m1[Matrix3d.M12] - m2;
            out[Matrix3d.M13] = m1[Matrix3d.M13] - m2;
            out[Matrix3d.M24] = m1[Matrix3d.M24] - m2;
            out[Matrix3d.M21] = m1[Matrix3d.M21] - m2;
            out[Matrix3d.M22] = m1[Matrix3d.M22] - m2;
            out[Matrix3d.M23] = m1[Matrix3d.M23] - m2;
            out[Matrix3d.M34] = m1[Matrix3d.M34] - m2;
            out[Matrix3d.M31] = m1[Matrix3d.M31] - m2;
            out[Matrix3d.M32] = m1[Matrix3d.M32] - m2;
            out[Matrix3d.M33] = m1[Matrix3d.M33] - m2;
        } else {
            out[Matrix3d.M41] = m1[Matrix3d.M41] - m2[Matrix3d.M41];
            out[Matrix3d.M42] = m1[Matrix3d.M42] - m2[Matrix3d.M42];
            out[Matrix3d.M43] = m1[Matrix3d.M43] - m2[Matrix3d.M43];
            out[Matrix3d.M11] = m1[Matrix3d.M11] - m2[Matrix3d.M11];
            out[Matrix3d.M12] = m1[Matrix3d.M12] - m2[Matrix3d.M12];
            out[Matrix3d.M13] = m1[Matrix3d.M13] - m2[Matrix3d.M13];
            out[Matrix3d.M21] = m1[Matrix3d.M21] - m2[Matrix3d.M21];
            out[Matrix3d.M22] = m1[Matrix3d.M22] - m2[Matrix3d.M22];
            out[Matrix3d.M23] = m1[Matrix3d.M23] - m2[Matrix3d.M23];
            out[Matrix3d.M31] = m1[Matrix3d.M31] - m2[Matrix3d.M31];
            out[Matrix3d.M32] = m1[Matrix3d.M32] - m2[Matrix3d.M32];
            out[Matrix3d.M33] = m1[Matrix3d.M33] - m2[Matrix3d.M33];
        }
        return out;
    }

    static mul(m1: Mat3d, m2: Mat3d|number, out?: Mat3d) {
        out = out || m1;
        if (typeof m2 === 'number') {
            out[Matrix3d.M41] = m1[Matrix3d.M41] * m2;
            out[Matrix3d.M42] = m1[Matrix3d.M42] * m2;
            out[Matrix3d.M43] = m1[Matrix3d.M43] * m2;
            out[Matrix3d.M14] = m1[Matrix3d.M14] * m2;
            out[Matrix3d.M11] = m1[Matrix3d.M11] * m2;
            out[Matrix3d.M12] = m1[Matrix3d.M12] * m2;
            out[Matrix3d.M13] = m1[Matrix3d.M13] * m2;
            out[Matrix3d.M24] = m1[Matrix3d.M24] * m2;
            out[Matrix3d.M21] = m1[Matrix3d.M21] * m2;
            out[Matrix3d.M22] = m1[Matrix3d.M22] * m2;
            out[Matrix3d.M23] = m1[Matrix3d.M23] * m2;
            out[Matrix3d.M34] = m1[Matrix3d.M34] * m2;
            out[Matrix3d.M31] = m1[Matrix3d.M31] * m2;
            out[Matrix3d.M32] = m1[Matrix3d.M32] * m2;
            out[Matrix3d.M33] = m1[Matrix3d.M33] * m2;
        } else {
            let a11 = m1[Matrix3d.M11]; let a12 = m1[Matrix3d.M12]; let a13 = m1[Matrix3d.M13]; let a14 = m1[Matrix3d.M14];
            let a21 = m1[Matrix3d.M21]; let a22 = m1[Matrix3d.M22]; let a23 = m1[Matrix3d.M23]; let a24 = m1[Matrix3d.M24];
            let a31 = m1[Matrix3d.M31]; let a32 = m1[Matrix3d.M32]; let a33 = m1[Matrix3d.M33]; let a34 = m1[Matrix3d.M34];
            let a41 = m1[Matrix3d.M41]; let a42 = m1[Matrix3d.M42]; let a43 = m1[Matrix3d.M43]; let a44 = m1[Matrix3d.M44];
            let b11 = m2[Matrix3d.M11]; let b12 = m2[Matrix3d.M12]; let b13 = m2[Matrix3d.M13]; let b14 = m2[Matrix3d.M14];
            let b21 = m2[Matrix3d.M21]; let b22 = m2[Matrix3d.M22]; let b23 = m2[Matrix3d.M23]; let b24 = m2[Matrix3d.M24];
            let b31 = m2[Matrix3d.M31]; let b32 = m2[Matrix3d.M32]; let b33 = m2[Matrix3d.M33]; let b34 = m2[Matrix3d.M34];
            let b41 = m2[Matrix3d.M41]; let b42 = m2[Matrix3d.M42]; let b43 = m2[Matrix3d.M43]; let
                b44 = m2[Matrix3d.M44];

            out[Matrix3d.M11] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            out[Matrix3d.M12] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            out[Matrix3d.M13] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            out[Matrix3d.M14] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

            out[Matrix3d.M21] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            out[Matrix3d.M22] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            out[Matrix3d.M23] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            out[Matrix3d.M24] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

            out[Matrix3d.M31] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            out[Matrix3d.M32] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            out[Matrix3d.M33] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            out[Matrix3d.M34] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

            out[Matrix3d.M41] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            out[Matrix3d.M42] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            out[Matrix3d.M43] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            out[Matrix3d.M44] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        }
        return out;
    }

    static equals(m1: Mat3d, m2: Mat3d) {
        return Math.abs(m1[Matrix3d.M44] - m2[Matrix3d.M44]) <= EPS &&
            Math.abs(m1[Matrix3d.M41] - m2[Matrix3d.M41]) <= EPS &&
            Math.abs(m1[Matrix3d.M42] - m2[Matrix3d.M42]) <= EPS &&
            Math.abs(m1[Matrix3d.M43] - m2[Matrix3d.M43]) <= EPS &&
            Math.abs(m1[Matrix3d.M14] - m2[Matrix3d.M14]) <= EPS &&
            Math.abs(m1[Matrix3d.M11] - m2[Matrix3d.M11]) <= EPS &&
            Math.abs(m1[Matrix3d.M12] - m2[Matrix3d.M12]) <= EPS &&
            Math.abs(m1[Matrix3d.M13] - m2[Matrix3d.M13]) <= EPS &&
            Math.abs(m1[Matrix3d.M24] - m2[Matrix3d.M24]) <= EPS &&
            Math.abs(m1[Matrix3d.M21] - m2[Matrix3d.M21]) <= EPS &&
            Math.abs(m1[Matrix3d.M22] - m2[Matrix3d.M22]) <= EPS &&
            Math.abs(m1[Matrix3d.M23] - m2[Matrix3d.M23]) <= EPS &&
            Math.abs(m1[Matrix3d.M34] - m2[Matrix3d.M34]) <= EPS &&
            Math.abs(m1[Matrix3d.M31] - m2[Matrix3d.M31]) <= EPS &&
            Math.abs(m1[Matrix3d.M32] - m2[Matrix3d.M32]) <= EPS &&
            Math.abs(m1[Matrix3d.M33] - m2[Matrix3d.M33]) <= EPS;
    }

    static translate(m: Mat3d, v: Vec3d, out?: Mat3d) {
        out = out || m;
        let a11 = m[Matrix3d.M11]; let a12 = m[Matrix3d.M12]; let a13 = m[Matrix3d.M13]; let a14 = m[Matrix3d.M14];
        let a21 = m[Matrix3d.M21]; let a22 = m[Matrix3d.M22]; let a23 = m[Matrix3d.M23]; let a24 = m[Matrix3d.M24];
        let a31 = m[Matrix3d.M31]; let a32 = m[Matrix3d.M32]; let a33 = m[Matrix3d.M33]; let a34 = m[Matrix3d.M34];
        let a41 = m[Matrix3d.M41]; let a42 = m[Matrix3d.M42]; let a43 = m[Matrix3d.M43]; let
            a44 = m[Matrix3d.M44];
        if (m !== out) {
            out[Matrix3d.M11] = a11;
            out[Matrix3d.M12] = a12;
            out[Matrix3d.M13] = a13;

            out[Matrix3d.M21] = a21;
            out[Matrix3d.M22] = a22;
            out[Matrix3d.M23] = a23;

            out[Matrix3d.M31] = a31;
            out[Matrix3d.M32] = a32;
            out[Matrix3d.M33] = a33;

            out[Matrix3d.M41] = a41;
            out[Matrix3d.M42] = a42;
            out[Matrix3d.M43] = a43;
            out[Matrix3d.M44] = a44;
        }
        out[Matrix3d.M14] = a14 + v[0];
        out[Matrix3d.M24] = a24 + v[1];
        out[Matrix3d.M34] = a34 + v[2];
        return out;
    }

    static scale(m: Mat3d, v: Vec3d, out?: Mat3d) {
        out = out || m;

        out[Matrix3d.M11] = m[Matrix3d.M11] * v[0];
        out[Matrix3d.M12] = m[Matrix3d.M12] * v[0];
        out[Matrix3d.M13] = m[Matrix3d.M13] * v[0];
        out[Matrix3d.M14] = m[Matrix3d.M14] * v[0];

        out[Matrix3d.M21] = m[Matrix3d.M21] * v[1];
        out[Matrix3d.M22] = m[Matrix3d.M22] * v[1];
        out[Matrix3d.M23] = m[Matrix3d.M23] * v[1];
        out[Matrix3d.M24] = m[Matrix3d.M24] * v[1];

        out[Matrix3d.M31] = m[Matrix3d.M31] * v[2];
        out[Matrix3d.M32] = m[Matrix3d.M32] * v[2];
        out[Matrix3d.M33] = m[Matrix3d.M33] * v[2];
        out[Matrix3d.M34] = m[Matrix3d.M34] * v[2];

        out[Matrix3d.M41] = m[Matrix3d.M41];
        out[Matrix3d.M42] = m[Matrix3d.M42];
        out[Matrix3d.M43] = m[Matrix3d.M43];
        out[Matrix3d.M44] = m[Matrix3d.M44];
        return out;
    }

    static rotate(m: Mat3d, ar: AxisRad, out?: Mat3d) {
        out = out || m;
        let len = Vector3d.len(ar);
        if (!len) { return out }
        let c = Math.cos(ar[3]); let s = Math.sin(ar[3]); let
            t = 1 - c;
        let x = ar[0] / len; let y = ar[1] / len; let
            z = ar[2] / len;
        let a11 = m[Matrix3d.M11]; let a12 = m[Matrix3d.M12]; let a13 = m[Matrix3d.M13]; let a14 = m[Matrix3d.M14];
        let a21 = m[Matrix3d.M21]; let a22 = m[Matrix3d.M22]; let a23 = m[Matrix3d.M23]; let a24 = m[Matrix3d.M24];
        let a31 = m[Matrix3d.M31]; let a32 = m[Matrix3d.M32]; let a33 = m[Matrix3d.M33]; let a34 = m[Matrix3d.M34];
        let a41 = m[Matrix3d.M41]; let a42 = m[Matrix3d.M42]; let a43 = m[Matrix3d.M43]; let
            a44 = m[Matrix3d.M44];
        let b11 = c + x * x * t; let b12 = x * y * t - z * s; let b13 = x * z * t + y * s;
        let b21 = y * x * t + z * s; let b22 = c + y * y * t; let b23 = y * z * t - x * s;
        let b31 = z * x * t - y * s; let b32 = z * y * c + x * s; let
            b33 = c + z * z * t;
        out[Matrix3d.M11] = a11 * b11 + a21 * b12 + a31 * b13;
        out[Matrix3d.M12] = a12 * b11 + a22 * b12 + a32 * b13;
        out[Matrix3d.M13] = a13 * b11 + a23 * b12 + a33 * b13;
        out[Matrix3d.M14] = a14 * b11 + a24 * b12 + a34 * b13;

        out[Matrix3d.M21] = a11 * b21 + a21 * b22 + a31 * b23;
        out[Matrix3d.M22] = a12 * b21 + a22 * b22 + a32 * b23;
        out[Matrix3d.M23] = a13 * b21 + a23 * b22 + a33 * b23;
        out[Matrix3d.M24] = a14 * b21 + a24 * b22 + a34 * b23;

        out[Matrix3d.M31] = a11 * b31 + a21 * b32 + a31 * b33;
        out[Matrix3d.M32] = a12 * b31 + a22 * b32 + a32 * b33;
        out[Matrix3d.M33] = a13 * b31 + a23 * b32 + a33 * b33;
        out[Matrix3d.M34] = a14 * b31 + a24 * b32 + a34 * b33;
        if (m !== out) {
            out[Matrix3d.M41] = a41;
            out[Matrix3d.M42] = a42;
            out[Matrix3d.M43] = a43;
            out[Matrix3d.M44] = a44;
        }
        return out;
    }

    static rotateX(m: Mat3d, rad: number, out?: Mat3d) {
        return Matrix3d.rotate(m, [1, 0, 0, rad], out);
    }

    static rotateY(m: Mat3d, rad: number, out?: Mat3d) {
        return Matrix3d.rotate(m, [0, 1, 0, rad], out);
    }

    static rotateZ(m: Mat3d, rad: number, out?: Mat3d) {
        return Matrix3d.rotate(m, [0, 0, 1, rad], out);
    }

    static fromTranslation(v: Vec3d, out: Mat3d) {
        Matrix3d.reset(out);
        out[Matrix3d.M14] = v[0];
        out[Matrix3d.M24] = v[1];
        out[Matrix3d.M34] = v[2];
        return out;
    }

    static fromScale(v: Vec3d, out: Mat3d) {
        Matrix3d.reset(out);
        out[Matrix3d.M11] = v[0];
        out[Matrix3d.M22] = v[1];
        out[Matrix3d.M33] = v[2];
        return out;
    }

    static fromRotation(e: AxisRad, out: Mat3d) {
        const c = Math.cos(e[3]); const s = Math.sin(e[3]); const
            t = 1 - c;
        const len = Vector3d.len(e);
        if (!len) return out;
        const x = e[0] / len; const y = e[1] / len; const
            z = e[2] / len;
        out[0] = x * x * t + c;
        out[1] = y * x * t - z * s;
        out[2] = z * x * t + y * s;
        out[3] = 0;
        out[4] = x * y * t + z * s;
        out[5] = y * y * t + c;
        out[6] = z * y * t - x * s;
        out[7] = 0;
        out[8] = x * z * t - y * s;
        out[9] = y * z * t + x * s;
        out[10] = z * z * t + c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    }

    static fromQuaternions(q: Quat, out: Mat3d) {
        return Quaternions.toMatrix(q, out);
    }

    static fromSkew(skew: Vec3d, out: Mat3d) {
        const sxy = Math.tan(skew[0]);
        const syz = Math.tan(skew[1]);
        const sxz = Math.tan(skew[2]);
        out[Matrix3d.M12] = sxy;
        out[Matrix3d.M13] = sxz;
        out[Matrix3d.M23] = syz;
        return out;
    }

    static rotateQuaternions(m: Mat3d, q: Quat, out?: Mat3d) {
        out = out || m;
        let m11 = m[Matrix3d.M11];
        let m12 = m[Matrix3d.M12];
        let m13 = m[Matrix3d.M13];
        let m14 = m[Matrix3d.M14];

        let m21 = m[Matrix3d.M21];
        let m22 = m[Matrix3d.M22];
        let m23 = m[Matrix3d.M23];
        let m24 = m[Matrix3d.M24];

        let m31 = m[Matrix3d.M31];
        let m32 = m[Matrix3d.M32];
        let m33 = m[Matrix3d.M33];
        let m34 = m[Matrix3d.M34];

        let m41 = m[Matrix3d.M41];
        let m42 = m[Matrix3d.M42];
        let m43 = m[Matrix3d.M43];
        let m44 = m[Matrix3d.M44];
        let qm11 = 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2];
        let qm12 = 2 * q[0] * q[1] - 2 * q[2] * q[3];
        let qm13 = 2 * q[0] * q[2] + 2 * q[1] * q[3];
        let qm21 = 2 * q[0] * q[1] + 2 * q[2] * q[3];
        let qm22 = 1 - 2 * q[0] * q[0] - 2 * q[2] * q[2];
        let qm23 = 2 * q[1] * q[2] - 2 * q[0] * q[3];
        let qm31 = 2 * q[0] * q[2] - 2 * q[1] * q[3];
        let qm32 = 2 * q[1] * q[2] + 2 * q[0] * q[3];
        let qm33 = 1 - 2 * q[0] * q[0] - 2 * q[1] * q[1];

        out[Matrix3d.M11] = qm11 * m11 + qm12 * m21 + qm13 * m31;
        out[Matrix3d.M12] = qm11 * m12 + qm12 * m22 + qm13 * m32;
        out[Matrix3d.M13] = qm11 * m13 + qm12 * m23 + qm13 * m33;
        out[Matrix3d.M14] = qm11 * m14 + qm12 * m24 + qm13 * m34;

        out[Matrix3d.M21] = qm21 * m11 + qm22 * m21 + qm23 * m31;
        out[Matrix3d.M22] = qm21 * m12 + qm22 * m22 + qm23 * m32;
        out[Matrix3d.M23] = qm21 * m13 + qm22 * m23 + qm23 * m33;
        out[Matrix3d.M24] = qm21 * m14 + qm22 * m24 + qm23 * m34;

        out[Matrix3d.M31] = qm31 * m11 + qm32 * m21 + qm33 * m31;
        out[Matrix3d.M32] = qm31 * m12 + qm32 * m22 + qm33 * m32;
        out[Matrix3d.M33] = qm31 * m13 + qm32 * m23 + qm33 * m33;
        out[Matrix3d.M34] = qm31 * m14 + qm32 * m24 + qm33 * m34;

        out[Matrix3d.M41] = m41;
        out[Matrix3d.M42] = m42;
        out[Matrix3d.M43] = m43;
        out[Matrix3d.M44] = m44;
        return out;
    }

    static determinant(m: Mat3d) {
        return m[Matrix3d.M11] * (
            m[Matrix3d.M22] * (m[Matrix3d.M33] * m[Matrix3d.M44] - m[Matrix3d.M34] * m[Matrix3d.M43]) -
                m[Matrix3d.M23] * (m[Matrix3d.M32] * m[Matrix3d.M44] - m[Matrix3d.M34] * m[Matrix3d.M42]) +
                m[Matrix3d.M24] * (m[Matrix3d.M32] * m[Matrix3d.M43] - m[Matrix3d.M33] * m[Matrix3d.M42])
        ) -
            m[Matrix3d.M12] * (
                m[Matrix3d.M21] * (m[Matrix3d.M33] * m[Matrix3d.M44] - m[Matrix3d.M34] * m[Matrix3d.M43]) -
                m[Matrix3d.M23] * (m[Matrix3d.M31] * m[Matrix3d.M44] - m[Matrix3d.M34] * m[Matrix3d.M41]) +
                m[Matrix3d.M24] * (m[Matrix3d.M31] * m[Matrix3d.M43] - m[Matrix3d.M33] * m[Matrix3d.M41])
            ) +
            m[Matrix3d.M13] * (
                m[Matrix3d.M21] * (m[Matrix3d.M32] * m[Matrix3d.M44] - m[Matrix3d.M34] * m[Matrix3d.M42]) -
                m[Matrix3d.M22] * (m[Matrix3d.M31] * m[Matrix3d.M44] - m[Matrix3d.M34] * m[Matrix3d.M41]) +
                m[Matrix3d.M24] * (m[Matrix3d.M31] * m[Matrix3d.M42] - m[Matrix3d.M32] * m[Matrix3d.M41])
            ) -
            m[Matrix3d.M14] * (
                m[Matrix3d.M21] * (m[Matrix3d.M32] * m[Matrix3d.M43] - m[Matrix3d.M33] * m[Matrix3d.M42]) -
                m[Matrix3d.M22] * (m[Matrix3d.M31] * m[Matrix3d.M43] - m[Matrix3d.M33] * m[Matrix3d.M41]) +
                m[Matrix3d.M23] * (m[Matrix3d.M31] * m[Matrix3d.M42] - m[Matrix3d.M32] * m[Matrix3d.M41])
            );
    }

    static invert(mat: Mat3d, out?: Mat3d) {
        out = out || mat;
        let a = mat[Matrix3d.M11]; let b = mat[Matrix3d.M12]; let c = mat[Matrix3d.M13]; let d = mat[Matrix3d.M14];
        let e = mat[Matrix3d.M21]; let f = mat[Matrix3d.M22]; let g = mat[Matrix3d.M23]; let h = mat[Matrix3d.M24];
        let i = mat[Matrix3d.M31]; let j = mat[Matrix3d.M32]; let k = mat[Matrix3d.M33]; let l = mat[Matrix3d.M34];
        let m = mat[Matrix3d.M41]; let n = mat[Matrix3d.M42]; let o = mat[Matrix3d.M43]; let p = mat[Matrix3d.M44];
        let q = a * f - b * e; let r = a * g - c * e;
        let s = a * h - d * e; let t = b * g - c * f;
        let u = b * h - d * f; let v = c * h - d * g;
        let w = i * n - j * m; let x = i * o - k * m;
        let y = i * p - l * m; let z = j * o - k * n;
        let A = j * p - l * n; let B = k * p - l * o;
        let ivd = 1 / this.determinant(mat);
        // (q * B - r * A + s * z + t * y - u * x + v * w);
        out[Matrix3d.M11] = (f * B - g * A + h * z) * ivd;
        out[Matrix3d.M12] = (-b * B + c * A - d * z) * ivd;
        out[Matrix3d.M13] = (n * v - o * u + p * t) * ivd;
        out[Matrix3d.M14] = (-j * v + k * u - l * t) * ivd;
        out[Matrix3d.M21] = (-e * B + g * y - h * x) * ivd;
        out[Matrix3d.M22] = (a * B - c * y + d * x) * ivd;
        out[Matrix3d.M23] = (-m * v + o * s - p * r) * ivd;
        out[Matrix3d.M24] = (i * v - k * s + l * r) * ivd;
        out[Matrix3d.M31] = (e * A - f * y + h * w) * ivd;
        out[Matrix3d.M32] = (-a * A + b * y - d * w) * ivd;
        out[Matrix3d.M33] = (m * u - n * s + p * q) * ivd;
        out[Matrix3d.M34] = (-i * u + j * s - l * q) * ivd;
        out[Matrix3d.M41] = (-e * z + f * x - g * w) * ivd;
        out[Matrix3d.M42] = (a * z - b * x + c * w) * ivd;
        out[Matrix3d.M43] = (-m * t + n * r - o * q) * ivd;
        out[Matrix3d.M44] = (i * t - j * r + k * q) * ivd;
        return out;
    }

    static skew(m: Mat3d, skew: Vec3d, out?: Mat3d) {
        out = out || m;
        const
            sm11 = 1;
        const sm12 = Math.tan(skew[0]);
        const sm13 = Math.tan(skew[1]);
        const sm21 = 0;
        const sm22 = 1;
        const sm23 = Math.tan(skew[2]);
        const sm31 = 0;
        const sm32 = 0;
        const sm33 = 1;
        const m11 = m[Matrix3d.M11];
        const m12 = m[Matrix3d.M12];
        const m13 = m[Matrix3d.M13];
        const m14 = m[Matrix3d.M14];
        const m21 = m[Matrix3d.M21];
        const m22 = m[Matrix3d.M22];
        const m23 = m[Matrix3d.M23];
        const m24 = m[Matrix3d.M24];
        const m31 = m[Matrix3d.M31];
        const m32 = m[Matrix3d.M32];
        const m33 = m[Matrix3d.M33];
        const m34 = m[Matrix3d.M34];
        const m41 = m[Matrix3d.M41];
        const m42 = m[Matrix3d.M42];
        const m43 = m[Matrix3d.M43];
        const m44 = m[Matrix3d.M44];
        out[Matrix3d.M11] = sm11 * m11 + sm12 * m21 + sm13 * m31;
        out[Matrix3d.M12] = sm11 * m12 + sm12 * m22 + sm13 * m32;
        out[Matrix3d.M13] = sm11 * m13 + sm12 * m23 + sm13 * m33;
        out[Matrix3d.M14] = sm11 * m14 + sm12 * m24 + sm13 * m34;

        out[Matrix3d.M21] = sm21 * m11 + sm22 * m21 + sm23 * m31;
        out[Matrix3d.M22] = sm21 * m12 + sm22 * m22 + sm23 * m32;
        out[Matrix3d.M23] = sm21 * m13 + sm22 * m23 + sm23 * m33;
        out[Matrix3d.M24] = sm21 * m14 + sm22 * m24 + sm23 * m34;

        out[Matrix3d.M31] = sm31 * m11 + sm32 * m21 + sm33 * m31;
        out[Matrix3d.M32] = sm31 * m12 + sm32 * m22 + sm33 * m32;
        out[Matrix3d.M33] = sm31 * m13 + sm32 * m23 + sm33 * m33;
        out[Matrix3d.M34] = sm31 * m14 + sm32 * m24 + sm33 * m34;

        out[Matrix3d.M41] = m41;
        out[Matrix3d.M42] = m42;
        out[Matrix3d.M43] = m43;
        out[Matrix3d.M44] = m44;
        return out;
    }

    /**
     * Recompose a matrix from transform and transform-origin
     * @param t
     * @param pivot
     * @param out
     */
    static recompose(t: ITransform3d, pivot: Vec3d, out: Mat3d) {
        Matrix3d.reset(out);
        Matrix3d.translate(out, [-pivot[0], -pivot[1], -pivot[2]]);
        Matrix3d.rotateQuaternions(out, t.rotation);
        Matrix3d.skew(out, t.skew);
        Matrix3d.scale(out, t.scale);
        Matrix3d.translate(out, pivot);
        Matrix3d.translate(out, t.translation);
        return out;
    }

    // W3C css-transform-2
    // https://drafts.csswg.org/css-transforms-2/#decomposing-a-3d-matrix
    static decompose<T extends ITransform3d>(m: Mat3d, out: T) {
        if (m[Matrix3d.M44] === 0) return out;
        const invM44 = 1 / m[Matrix3d.M44];
        let row0 = [0, 0, 0];
        let row1 = [0, 0, 0];
        let row2 = [0, 0, 0];
        let pdum3 = [0, 0, 0];
        let m11 = m[Matrix3d.M11] * invM44; let m12 = m[Matrix3d.M12] * invM44; let m13 = m[Matrix3d.M13] * invM44;
        let m21 = m[Matrix3d.M21] * invM44; let m22 = m[Matrix3d.M22] * invM44; let m23 = m[Matrix3d.M23] * invM44;
        let m31 = m[Matrix3d.M21] * invM44; let m32 = m[Matrix3d.M22] * invM44; let m33 = m[Matrix3d.M23] * invM44;
        let m41 = m[Matrix3d.M21] * invM44; let m42 = m[Matrix3d.M22] * invM44; let
            m43 = m[Matrix3d.M23] * invM44;
        out.translation[0] = m41;
        out.translation[1] = m42;
        out.translation[2] = m43;
        Vector3d.set(m11, m12, m13, row0);
        Vector3d.set(m21, m22, m23, row1);
        Vector3d.set(m31, m32, m33, row2);
        // Compute X scale factor and normalize first row.
        out.scale[0] = Vector3d.len(row0);
        Vector3d.normalize(row0);
        // Compute XY shear factor and make 2nd row orthogonal to 1st.
        out.skew[0] = Vector3d.dot(row0, row1);
        Vector3d.add(Vector3d.add(row1, row0), 1 - out.skew[0]);
        // Now, compute Y scale and normalize 2nd row.
        out.scale[1] = Vector3d.len(row1);
        Vector3d.normalize(row1);
        out.skew[0] /= out.scale[1];
        // Compute XZ and YZ shears, orthogonalize 3rd row
        out.skew[1] = Vector3d.dot(row0, row2);
        Vector3d.add(Vector3d.add(row2, row0), 1 - out.skew[1]);
        out.skew[2] = Vector3d.dot(row1, row2);
        Vector3d.add(Vector3d.add(row2, row1), 1 - out.skew[2]);
        // Next, get Z scale and normalize 3rd row.
        out.scale[2] = Vector3d.len(row2);
        Vector3d.normalize(row2);
        out.skew[1] /= out.scale[2];
        out.skew[2] /= out.scale[2];
        // At this point, the matrix (in rows) is orthonormal.
        // Check for a coordinate system flip.  If the determinant
        // is -1, then negate the matrix and the scaling factors.
        Vector3d.cross(row1, row2, pdum3);
        if (Vector3d.dot(row0, pdum3) < 0) {
            Vector3d.neg(out.scale);
            Vector3d.neg(row0);
            Vector3d.neg(row1);
            Vector3d.neg(row2);
        }
        // Now, get the rotations out
        out.rotation[0] = 0.5 * Math.sqrt(Math.max(1 + row0[0] - row1[1] - row2[2], 0));
        out.rotation[1] = 0.5 * Math.sqrt(Math.max(1 - row0[0] + row1[1] - row2[2], 0));
        out.rotation[2] = 0.5 * Math.sqrt(Math.max(1 - row0[0] - row1[1] + row2[2], 0));
        out.rotation[3] = 0.5 * Math.sqrt(Math.max(1 + row0[0] + row1[1] + row2[2], 0));
        if (row2[1] > row1[2]) {
            out.rotation[0] *= -1;
        }
        if (row0[2] > row2[0]) {
            out.rotation[1] *= -1;
        }
        if (row1[0] > row0[1]) {
            out.rotation[2] *= -1;
        }
        return out;
    }
}