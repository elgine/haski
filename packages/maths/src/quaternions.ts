// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Matrix3d from './matrix3d';
import { EPS } from './const';
import clamp from './clamp';
import Vector3d from './vector3d';

export default class Quaternions extends Array<number> {

    static create(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        let q = new Array<number>(4);
        this.set(x, y, z, w, q);
        return q;
    }

    static set(x: number, y: number, z: number, w: number, out: Quat) {
        out[0] = x;
        out[1] = y;
        out[2] = z;
        out[3] = w;
        return out;
    }

    static equals(q1: Quat, q2: Quat) {
        return Math.abs(q1[0] - q2[0]) <= EPS &&
            Math.abs(q1[1] - q2[1]) <= EPS &&
            Math.abs(q1[2] - q2[2]) <= EPS &&
            Math.abs(q1[3] - q2[3]) <= EPS;
    }

    static reset<T extends Quat>(out: T) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        return out;
    }

    static clone<T extends Quat>(q: Quat, out: T) {
        out[0] = q[0];
        out[1] = q[1];
        out[2] = q[2];
        out[3] = q[3];
        return out;
    }

    static neg<T extends Quat>(q: T, out?: T) {
        out = out || q;
        out[0] = -q[0];
        out[1] = -q[1];
        out[2] = -q[2];
        out[3] = -q[3];
        return out;
    }

    static mul<T extends Quat>(q1: T, q2: Quat|number, out?: T) {
        out = out || q1;
        if (typeof q2 === 'number') {
            out[0] = q1[0] * q2;
            out[1] = q1[1] * q2;
            out[2] = q1[2] * q2;
            out[3] = q1[3] * q2;
        } else {
            let w1 = q1[3]; let x1 = q1[0]; let y1 = q1[1]; let z1 = q1[2];
            let w2 = q2[3]; let x2 = q2[0]; let y2 = q2[1]; let
                z2 = q2[2];
            out[3] = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
            out[0] = w1 * x2 + w2 * x1 + y1 * z2 - y2 * z1;
            out[1] = w1 * y2 + w2 * y1 + z1 * x2 - z2 * x1;
            out[2] = w1 * z2 + w2 * z1 + x1 * y2 - x2 * y1;
        }
        return out;
    }

    static conjugate<T extends Quat>(q: Quat, out: T) {
        out[3] = q[3];
        out[0] = -q[0];
        out[1] = -q[1];
        out[2] = -q[2];
        return out;
    }

    static add<T extends Quat>(q1: T, q2: Quat, out?: T) {
        out = out || q1;
        out[0] = q1[0] + q2[0];
        out[1] = q1[1] + q2[1];
        out[2] = q1[2] + q2[2];
        out[3] = q1[3] + q2[3];
        return out;
    }

    static invert<T extends Quat>(q: Quat, out: T) {
        return this.mul(this.conjugate(q, out), 1 / this.abs(q));
    }

    static dot(q1: Quat, q2: Quat) {
        return q1[3] * q2[3] + q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2];
    }

    static abs(q: Quat) {
        return Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);
    }

    static slerp<T extends Quat>(s: Quat, e: Quat, t: number, out: T) {
        const p = clamp(0, 1, t);
        let cosa = this.dot(s, e);
        // If the dot product is negative, the quaternions have
        // opposite handed-ness and slerp won't take the shorter path.
        // Fixed by reversing one quaternion.
        if (cosa < 0) {
            this.neg(e);
            cosa = -cosa;
        }
        let k0; let
            k1;
        // If the inputs are too close for comfort, linearly interpolate
        if (cosa > 0.9995) {
            k0 = 1 - p;
            k1 = p;
        } else {
            let sina = Math.sqrt(1 - cosa * cosa);
            let a = Math.atan2(sina, cosa);
            k0 = Math.sin((1 - p) * a) / sina;
            k1 = Math.sin(t * a) / sina;
        }
        out[0] = s[0] * k0 + e[0] * k1;
        out[1] = s[1] * k0 + e[1] * k1;
        out[2] = s[2] * k0 + e[2] * k1;
        out[3] = s[3] * k0 + e[3] * k1;
        return out;
    }

    static addAxis<T extends Quat>(q: T, e: AxisRad, out?: T) {
        out = out || q;
        out[0] = q[0] + e[0] * Math.sin(e[3] * 0.5);
        out[1] = q[1] + e[1] * Math.sin(e[3] * 0.5);
        out[2] = q[2] + e[2] * Math.sin(e[3] * 0.5);
        out[3] = q[3] + Math.cos(e[3] * 0.5);
        return out;
    }

    static fromAxisRotation<T extends Quat>(e: AxisRad, out: T) {
        const len = Vector3d.len(e) || 1;
        out[0] = e[0] / len * Math.sin(e[3] * 0.5);
        out[1] = e[1] / len * Math.sin(e[3] * 0.5);
        out[2] = e[2] / len * Math.sin(e[3] * 0.5);
        out[3] = Math.cos(e[3] * 0.5);
        return out;
    }

    static toAxisRotation<T extends AxisRad>(q: Quat, out: T) {
        let rad = Math.acos(q[3]) * 2;
        out[3] = rad;
        out[0] = q[0] / Math.sin(rad * 0.5);
        out[1] = q[1] / Math.sin(rad * 0.5);
        out[2] = q[2] / Math.sin(rad * 0.5);
    }

    static toMatrix<T extends Mat3d>(q: Quat, out: T) {
        Matrix3d.reset(out);
        out[Matrix3d.M11] = 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2];
        out[Matrix3d.M12] = 2 * q[0] * q[1] - 2 * q[2] * q[3];
        out[Matrix3d.M13] = 2 * q[0] * q[2] + 2 * q[1] * q[3];
        out[Matrix3d.M21] = 2 * q[0] * q[1] + 2 * q[2] * q[3];
        out[Matrix3d.M22] = 1 - 2 * q[0] * q[0] - 2 * q[2] * q[2];
        out[Matrix3d.M23] = 2 * q[1] * q[2] - 2 * q[0] * q[3];
        out[Matrix3d.M31] = 2 * q[0] * q[2] - 2 * q[1] * q[3];
        out[Matrix3d.M32] = 2 * q[1] * q[2] + 2 * q[0] * q[3];
        out[Matrix3d.M33] = 1 - 2 * q[0] * q[0] - 2 * q[1] * q[1];
        return out;
    }
}