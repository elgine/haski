// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vector2d from './vector2d';
import { EPS } from './const';

export class AABB2d {

    public static readonly axises: Vec2d[] = [
        [1, 0],
        [0, -1],
        [-1, 0],
        [0, 1]
    ];

    private static _tempPoints: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];

    private static _corners: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];

    static compose<T extends IAABB2d>(vecs: Vec2d[], out: T) {
        let minX = Number.MAX_VALUE; let minY = Number.MAX_VALUE;
        let maxX = -Number.MAX_VALUE; let
            maxY = -Number.MAX_VALUE;
        return vecs.reduce((o, v) => {
            minX = Math.min(minX, v[0]);
            maxX = Math.max(maxX, v[0]);
            minY = Math.min(minY, v[1]);
            maxY = Math.max(maxY, v[1]);
            out.x = minX;
            out.y = minY;
            out.width = maxX - minX;
            out.height = maxY - minY;
            return o;
        }, out);
    }

    static set<T extends IAABB2d>(x: number, y: number, width: number, height: number, out: T) {
        out.x = x;
        out.y = y;
        out.width = width;
        out.height = height;
        return out;
    }

    static clone<T extends IAABB2d>(a: IAABB2d, out: T) {
        out.x = a.x;
        out.y = a.y;
        out.width = a.width;
        out.height = a.height;
        return out;
    }

    static equals(a: IAABB2d, b: IAABB2d) {
        return Math.abs(a.x - b.x) <= EPS &&
            Math.abs(a.y - b.y) <= EPS &&
            Math.abs(a.width - b.width) <= EPS &&
            Math.abs(a.height - b.height) <= EPS;
    }


    static transform<T extends IAABB2d>(b: T, m: Mat2d, out?: T) {
        out = out || b;
        let left = b.x; let top = b.y; let right = b.x + b.width; let
            bottom = b.y + b.height;
        let minX = Number.MAX_VALUE; let minY = Number.MAX_VALUE; let maxX = -Number.MAX_VALUE; let
            maxY = -Number.MAX_VALUE;
        this._tempPoints[0][0] = left;
        this._tempPoints[0][1] = top;
        this._tempPoints[1][0] = right;
        this._tempPoints[1][1] = top;
        this._tempPoints[2][0] = right;
        this._tempPoints[2][1] = bottom;
        this._tempPoints[3][0] = left;
        this._tempPoints[3][1] = bottom;
        for (let i = 0; i < 4; i++) {
            let p = Vector2d.transform(this._tempPoints[i], m);
            minX = Math.min(minX, p[0]);
            maxX = Math.max(maxX, p[0]);
            minY = Math.min(minY, p[1]);
            maxY = Math.max(maxY, p[1]);
        }
        return AABB2d.set(minX, minY, maxX - minX, maxY - minY, out);
    }

    static union<T extends IAABB2d>(a: T, b: IAABB2d, out?: T) {
        out = out || a;
        let left = a.x < b.x ? a.x : b.x;
        let top = a.y < b.y ? a.y : b.y;
        let right = a.x + a.width > b.x + b.width ? a.x + a.width : b.x + b.width;
        let bottom = a.y + a.height > b.y + b.height ? a.y + a.height : b.y + b.height;
        return AABB2d.set(left, top, right - left, bottom - top, out);
    }

    static right(b: IAABB2d) {
        return b.x + b.width;
    }

    static bottom(b: IAABB2d) {
        return b.y + b.height;
    }

    static contains(a: IAABB2d, b: IObject2d) {
        let aTop = a.y; let aLeft = a.x;
        let aRight = this.right(a); let aBottom = this.bottom(a);
        let bTop = b.y; let bLeft = b.x;
        let bRight = b.width ? b.width + b.x : bLeft; let
            bBottom = b.height ? b.y + b.height : bTop;
        return ((bTop - aTop >= 0 || Math.abs(aTop - bTop) <= EPS) &&
            (aRight - bRight >= 0 || Math.abs(aRight - bRight) <= EPS) &&
            (bLeft - aLeft >= 0 || Math.abs(bLeft - aLeft) <= EPS) &&
            (aBottom - bBottom >= 0 || Math.abs(aBottom - bBottom) <= EPS));
    }

    static overlap(a: IOBB2d|IAABB2d, b: IOBB2d|IAABB2d) {
        return overlap(a, b);
    }

    static intersect<T extends IAABB2d>(a: T, b: IAABB2d, out?: T) {
        out = out || a;
        if (overlap(a, b)) {
            let left = (a.x > b.x) ? a.x : b.x;
            let right = (this.right(a) < this.right(b)) ? this.right(a) : this.right(b);
            let top = (a.y > b.y) ? a.y : b.y;
            let bottom = (this.bottom(a) < this.bottom(b)) ? this.bottom(a) : this.bottom(b);
            out.x = left;
            out.y = top;
            out.width = right - left;
            out.height = bottom - top;
        }
        return out;
    }

    static round<T extends IAABB2d>(out: T) {
        let right = this.right(out); let
            bottom = this.bottom(out);
        out.x = ~~out.x;
        out.y = ~~out.y;
        out.width = Math.ceil(right) - out.x;
        out.height = Math.ceil(bottom) - out.y;
        return out;
    }



    static interval(a: IAABB2d, axis: Vec2d) {
        let vertices = this._setCorners(a, this._corners);
        let d; let min = Number.MAX_VALUE; let
            max = -Number.MIN_VALUE;
        vertices.forEach((v) => {
            d = Vector2d.dot(v, axis);
            if (d > max) {
                max = d;
            }
            if (d < min) {
                min = d;
            }
        });
        return {
            min, max
        };
    }

    static padding<T extends IAABB2d>(a: T, n: number, out?: T) {
        out = out || a;
        out.x = a.x - n;
        out.y = a.y - n;
        out.width = a.width + 2 * n;
        out.height = a.height + 2 * n;
        return out;
    }

    static reset<T extends IAABB2d>(out: T) {
        out.x = 0;
        out.y = 0;
        out.width = 0;
        out.height = 0;
        return out;
    }

    private static _setCorners(a: IAABB2d, cs: Vec2d[]) {
        cs[0][0] = a.x;
        cs[0][1] = a.y;
        cs[1][0] = a.x + a.width;
        cs[1][1] = a.y;
        cs[2][0] = a.x + a.width;
        cs[2][1] = a.y + a.height;
        cs[3][0] = a.x;
        cs[3][1] = a.y + a.height;
        return cs;
    }

    private _x: number = 0;
    private _y: number = 0;
    private _width: number = 0;
    private _height: number = 0;
    private _cornersDirty: boolean = false;
    private _corners: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    private _segments: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    private _segmentsDirty: boolean = false;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    compose(vs: Vec2d[]) {
        return AABB2d.compose(vs, this);
    }

    overlap(b: IOBB2d|IAABB2d) {
        return AABB2d.overlap(this, b);
    }

    set(x: number, y: number, width: number, height: number) {
        return AABB2d.set(x, y, width, height, this);
    }

    clone(a: IAABB2d) {
        return AABB2d.clone(a, this);
    }

    reset() {
        return AABB2d.reset(this);
    }

    round() {
        return AABB2d.round(this);
    }

    transform(m: Mat2d) {
        return AABB2d.transform(this, m);
    }

    intersect(a: IAABB2d, out?: IAABB2d) {
        return AABB2d.intersect(this, a, out);
    }

    contains(a: IAABB2d) {
        return AABB2d.contains(this, a);
    }

    union(a: IAABB2d) {
        return AABB2d.union(this, a);
    }

    padding(n: number) {
        return AABB2d.padding(this, n);
    }

    private _updateCorners() {
        AABB2d._setCorners(this, this._corners);
    }

    private _updateSegments() {
        this.corners.forEach((corner, index, arr) => {
            let nextIndex = (index + 1) % 4;
            Vector2d.sub(arr[nextIndex], corner, this._segments[index]);
        });
    }

    get center() {
        return [this.cx, this.cy];
    }

    get right() {
        return this.x + this.width;
    }

    get bottom() {
        return this.y + this.height;
    }

    get cx() {
        return this.x + this.width * 0.5;
    }

    get cy() {
        return this.y + this.height * 0.5;
    }

    get axises() {
        return AABB2d.axises;
    }

    get corners() {
        if (this._cornersDirty) {
            this._updateCorners();
            this._cornersDirty = false;
        }
        return this._corners;
    }

    get segments() {
        if (this._segmentsDirty) {
            this._updateSegments();
            this._segmentsDirty = false;
        }
        return this._segments;
    }

    set x(v: number) {
        if (this._x === v) return;
        this._x = v;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get x() {
        return this._x;
    }

    set y(v: number) {
        if (this._y === v) return;
        this._y = v;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get y() {
        return this._y;
    }

    set width(v: number) {
        if (this._width === v) return;
        this._width = v;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get width() {
        return this._width;
    }

    set height(v: number) {
        if (this._height === v) return;
        this._height = v;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get height() {
        return this._height;
    }
}

export class OBB2d {

    static create(width: number = 0, height: number = 0, rotation: number = 0, center: Vec2d = [0, 0]) {
        return new OBB2d(width, height, rotation, center);
    }

    static set<T extends IOBB2d>(width: number, height: number, rotation: number, center: Vec2d, out: T) {
        Vector2d.clone(center, out.center);
        out.width = width;
        out.height = height;
        out.rotation = rotation;
        return out;
    }

    static clone<T extends IOBB2d>(a: IOBB2d, out: T) {
        Vector2d.clone(a.center, out.center);
        out.width = a.width;
        out.height = a.height;
        out.rotation = a.rotation;
        return out;
    }

    static rotate(a: IOBB2d, r: number, out?: IOBB2d) {
        out = out || a;
        out.rotation = a.rotation + r;
        return out;
    }

    static overlap(a: IAABB2d|IOBB2d, b: IAABB2d|IOBB2d) {
        return overlap(a, b);
    }

    private _center: Vec2d = [0, 0];
    private _width: number = 0;
    private _height: number = 0;
    private _rotation: number = 0;
    private _axisesDirty: boolean = false;
    private _cornersDirty: boolean = false;
    private _extents: Vec2d[] = [
        [0, 0],
        [0, 0]
    ];
    private _corners: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    private _axises: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    private _segments: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    private _segmentsDirty: boolean = false;

    constructor(width: number = 0, height: number = 0, rotation: number = 0, center: Vec2d = [0, 0]) {
        this.set(width, height, rotation, center);
    }

    overlap(b: IOBB2d|IAABB2d) {
        return overlap(this, b);
    }

    set(width: number, height: number, rotation: number, center: Vec2d) {
        return OBB2d.set(width, height, rotation, center, this);
    }

    rotate(r: number) {
        return OBB2d.rotate(this, r);
    }

    private _updateAxises() {
        this._axises[0][0] = Math.cos(this._rotation);
        this._axises[0][1] = Math.sin(this._rotation);
        this._axises[1][0] = -Math.sin(this._rotation);
        this._axises[1][1] = Math.cos(this._rotation);
        this._axises[2][0] = -this._axises[0][0];
        this._axises[2][1] = -this._axises[0][1];
        this._axises[3][0] = -this._axises[1][0];
        this._axises[3][1] = -this._axises[1][1];
    }

    private _updateCorners() {
        Vector2d.mul(Vector2d.clone(this.axises[0], this._extents[0]), this._width * 0.5);
        Vector2d.mul(Vector2d.clone(this._axises[1], this._extents[1]), this._height * 0.5);
        Vector2d.sub(Vector2d.sub(Vector2d.clone(this._center, this._corners[0]), this._extents[0]), this._extents[1]);
        Vector2d.add(Vector2d.sub(Vector2d.clone(this._center, this._corners[1]), this._extents[0]), this._extents[1]);
        Vector2d.add(Vector2d.add(Vector2d.clone(this._center, this._corners[2]), this._extents[0]), this._extents[1]);
        Vector2d.sub(Vector2d.add(Vector2d.clone(this._center, this._corners[3]), this._extents[0]), this._extents[1]);
    }

    private _updateSegments() {
        this.corners.forEach((corner, index, arr) => {
            let nextIndex = (index + 1) % 4;
            Vector2d.sub(arr[nextIndex], corner, this._segments[index]);
        });
    }

    get axises() {
        if (this._axisesDirty) {
            this._updateAxises();
            this._axisesDirty = false;
        }
        return this._axises;
    }

    get corners() {
        if (this._cornersDirty) {
            this._updateCorners();
            this._cornersDirty = false;
        }
        return this._corners;
    }

    get segments() {
        if (this._segmentsDirty) {
            this._updateSegments();
            this._segmentsDirty = false;
        }
        return this._segments;
    }

    set rotation(v: number) {
        if (this._rotation === v) return;
        this._rotation = v;
        this._axisesDirty = true;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get rotation() {
        return this._rotation;
    }

    set center(v: Vec2d) {
        if (Vector2d.equals(this._center, v)) return;
        Vector2d.clone(this._center, v);
        this._axisesDirty = true;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get center() {
        return this._center;
    }

    set cx(v: number) {
        if (this._center[0] === v) return;
        this._center[0] = v;
        this._axisesDirty = true;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get cx() {
        return this._center[0];
    }

    set cy(v: number) {
        if (this._center[1] === v) return;
        this._center[1] = v;
        this._axisesDirty = true;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get cy() {
        return this._center[1];
    }

    set width(v: number) {
        if (this._width === v) return;
        this._width = v;
        this._axisesDirty = true;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get width() {
        return this._width;
    }

    set height(v: number) {
        if (this._height === v) return;
        this._height = v;
        this._axisesDirty = true;
        this._cornersDirty = true;
        this._segmentsDirty = true;
    }

    get height() {
        return this._height;
    }
}

const mtd = { normal: [0, 0], permeation: 0 };
const aAABB: AABB2d = new AABB2d(); const bAABB = new AABB2d();
const aOBB: OBB2d = new OBB2d(); const
    bOBB = new OBB2d();

const toBoundObj = (a: IAABB2d|IOBB2d, aabb: AABB2d, obb: OBB2d): AABB2d|OBB2d => {
    if (a instanceof AABB2d) { return a }
    else if (a instanceof OBB2d) { return a }
    else if ((a as any).x !== undefined && (a as any).y !== undefined) {
        return AABB2d.clone(a as IAABB2d, aabb);
    } else {
        return OBB2d.clone(a as IOBB2d, obb);
    }
};

export const overlap = (b1: IAABB2d|IOBB2d, b2: IAABB2d|IOBB2d) => {
    const a = toBoundObj(b1, aAABB, aOBB);
    const b = toBoundObj(b2, bAABB, bOBB);
    if (a instanceof AABB2d && b instanceof AABB2d) {
        let nMaxLeft = 0;
        let nMaxTop = 0;
        let nMinRight = 0;
        let nMinBottom = 0;
        // Get the max left.
        if (a.x >= b.x) {
            nMaxLeft = a.x;
        } else {
            nMaxLeft = b.x;
        }
        // Get the max top.
        if (a.y >= b.y) {
            nMaxTop = a.y;
        } else {
            nMaxTop = b.y;
        }
        // Get the min right.
        if (AABB2d.right(a) <= AABB2d.right(b)) {
            nMinRight = AABB2d.right(a);
        } else {
            nMinRight = AABB2d.right(b);
        }
        // Get the min bottom.
        if (AABB2d.bottom(a) <= AABB2d.bottom(b)) {
            nMinBottom = AABB2d.bottom(a);
        } else {
            nMinBottom = AABB2d.bottom(b);
        }
        // Judge whether intersects.
        if (nMaxLeft > nMinRight || nMaxTop > nMinBottom) {
            return false;
        }
        else {
            return true;
        }
    } else {
        return getMTD(a, b, mtd) !== null;
    }
};

export const getInterval = (vertices: Vec2d[], axis: Vec2d, range: {min: number; max: number}) => {
    let d = 0;
    range.min = Number.MAX_VALUE;
    range.max = -Number.MIN_VALUE;
    return vertices.reduce((range, v) => {
        d = Vector2d.dot(v, axis);
        if (d > range.max) {
            range.max = d;
        }
        if (d < range.min) {
            range.min = d;
        }
        return range;
    }, range);
};

let vec = [0, 0];
export const getMTD = (a: ICollider2d, b: ICollider2d, out: {normal: Vec2d; permeation: number}) => {
    Vector2d.sub(b.center, a.center, vec);
    const axises1 = a.axises; const axises2 = b.axises;
    const axisCount1 = axises1.length; const axisCount2 = axises2.length;
    const allCount = axisCount1 + axisCount2;
    out.permeation = Number.MAX_VALUE;
    // Normal
    let normal;
    // Minus distance
    let permeation;
    let interval1 = { min: 0, max: 0 }; let
        interval2 = { min: 0, max: 0 };
    for (let i = 0; i < allCount; i++) {
        if (i < axisCount1) {
            normal = axises1[i];
        } else {
            normal = axises2[i - axisCount1];
        }
        getInterval(a.corners, normal, interval1);
        getInterval(b.corners, normal, interval2);
        if (interval1.min < interval2.min && interval1.max < interval2.min ||
            (interval2.min < interval1.min && interval2.max < interval1.min)) {
            return null;
        } else {
            permeation = interval1.min < interval2.min ?
                interval1.max - interval2.min :
                interval2.max - interval1.min;
            if (out.permeation > permeation) {
                Vector2d.clone(normal, out.normal);
                if (Vector2d.dot(vec, normal) <= 0) {
                    Vector2d.neg(out.normal);
                }
                out.permeation = permeation;
            }
        }
    }
    return out;
};