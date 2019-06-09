// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EPS } from './const';
import Matrix3d from './matrix3d';

export default class Vector3d extends Array<number> {

    static create(x: number = 0, y: number = 0, z: number = 0) {
        let v = new Array<number>(3);
        this.set(x, y, z, v);
        return v;
    }

    static len(v: Vec3d) {
        return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2));
    }

    static distance(v1: Vec3d, v2: Vec3d) {
        return Math.sqrt(Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2) + Math.pow(v1[2] - v2[2], 2));
    }

    static set<T extends Vec3d>(x: number, y: number, z: number, out: T) {
        out[0] = x;
        out[1] = y;
        out[2] = z;
        return out;
    }

    static clone<T extends Vec3d>(v: Vec3d, out: T) {
        out[0] = v[0];
        out[1] = v[1];
        out[2] = v[2];
        return out;
    }

    static reset<T extends Vec3d>(out: T) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        return out;
    }

    static mul<T extends Vec3d>(v1: T, v2: Vec3d|number, out?: T) {
        out = out || v1;
        if (typeof v2 === 'number') {
            out[0] = v1[0] * v2;
            out[1] = v1[1] * v2;
            out[2] = v1[2] * v2;
        } else {
            out[0] = v1[0] * v2[0];
            out[1] = v1[1] * v2[1];
            out[2] = v1[2] * v2[2];
        }
        return out;
    }

    static add<T extends Vec3d>(v1: T, v2: Vec3d|number, out?: T) {
        out = out || v1;
        if (typeof v2 === 'number') {
            out[0] = v1[0] + v2;
            out[1] = v1[1] + v2;
            out[2] = v1[2] + v2;
        } else {
            out[0] = v1[0] + v2[0];
            out[1] = v1[1] + v2[1];
            out[2] = v1[2] + v2[2];
        }
        return out;
    }

    static sub<T extends Vec3d>(v1: T, v2: Vec3d|number, out?: T) {
        out = out || v1;
        if (typeof v2 === 'number') {
            out[0] = v1[0] - v2;
            out[1] = v1[1] - v2;
            out[2] = v1[2] - v2;
        } else {
            out[0] = v1[0] - v2[0];
            out[1] = v1[1] - v2[1];
            out[2] = v1[2] - v2[2];
        }
        return out;
    }

    static dot(v1: Vec3d, v2: Vec3d) {
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    }

    static equals(v1: Vec3d, v2: Vec3d) {
        return Math.abs(v1[0] - v2[0]) <= EPS &&
                Math.abs(v1[1] - v2[1]) <= EPS &&
                Math.abs(v1[2] - v2[2]) <= EPS;
    }

    static cross<T extends Vec3d>(v1: T, v2: Vec3d, out?: T) {
        out = out || v1;
        let a1 = v1[0]; let b1 = v1[1]; let c1 = v1[2];
        let a2 = v2[0]; let b2 = v2[1]; let
            c2 = v2[2];
        out[0] = b1 * c2 - b2 * c1;
        out[1] = a2 * c1 - a1 * c2;
        out[2] = a1 * b2 - a2 * b1;
        return out;
    }

    static normalize<T extends Vec3d>(v: T, out?: T) {
        out = out || v;
        const len = Vector3d.len(v);
        out[0] = v[0] / len;
        out[1] = v[1] / len;
        out[2] = v[2] / len;
        return out;
    }

    static neg<T extends Vec3d>(v: T, out?: T) {
        out = out || v;
        out[0] = -v[0];
        out[1] = -v[1];
        out[2] = -v[2];
        return out;
    }

    static transform<T extends Vec3d>(v: T, m: Mat3d, out?: T) {
        let x = v[0]; let y = v[1]; let
            z = v[2];
        out = out || v;
        out[0] = m[Matrix3d.M11] * x + m[Matrix3d.M12] * y + m[Matrix3d.M13] * z + m[Matrix3d.M14];
        out[1] = m[Matrix3d.M21] * x + m[Matrix3d.M22] * y + m[Matrix3d.M23] * z + m[Matrix3d.M24];
        out[2] = m[Matrix3d.M31] * x + m[Matrix3d.M32] * y + m[Matrix3d.M33] * z + m[Matrix3d.M34];
        return out;
    }
}