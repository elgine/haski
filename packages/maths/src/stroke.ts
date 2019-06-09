// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vector2d from './vector2d';
import { EPS } from './const';

let thickness = 0;
let line1: Vec2d = [0, 0];
let n1: Vec2d = [0, 0];
let line2: Vec2d = [0, 0];
let n2: Vec2d = [0, 0];
let l1: Vec2d = [0, 0];
let l2: Vec2d = [0, 0];
let temp1: Vec2d = [0, 0];
let temp2: Vec2d = [0, 0];
let temp3: Vec2d = [0, 0];
let temp4: Vec2d = [0, 0];
let temp5: Vec2d = [0, 0];
let temp6: Vec2d = [0, 0];
let temp7: Vec2d = [0, 0];
let temp8: Vec2d = [0, 0];
let temp9: Vec2d = [0, 0];
let temp10: Vec2d = [0, 0];
let temp11: Vec2d = [0, 0];
let temp12: Vec2d = [0, 0];
let temp13: Vec2d = [0, 0];

let indiceCount = 0;
let indiceMap: Dictionary<number> = {};

const push = (v: Vec2d, output: Vec2d[]) => {
    let key = `${v[0]}-${v[1]}`;
    if (!indiceMap[key]) {
        output.push(v.slice());
        indiceMap[key] = indiceCount++;
    }
    return getVerticeIndice(v);
};

const getVerticeIndice = (v: Vec2d) => {
    return indiceMap[`${v[0]}-${v[1]}`];
};

const createSquareCap = (p0: Vec2d, p1: Vec2d, dir: Vec2d, vertices: Vec2d[], indices: number[]) => {
    indices.push(
        push(p0, vertices),
        push(Vector2d.add(p0, dir, temp12), vertices),
        push(Vector2d.add(p1, dir, temp12), vertices),

        push(p1, vertices),
        push(Vector2d.add(p1, dir, temp12), vertices),
        push(p0, vertices),
    );
};

const createRoundCap = (center: Vec2d, p0: Vec2d, p1: Vec2d, nextPointInLine: Vec2d, vertices: Vec2d[], indices: number[]) => {
    let radius = Vector2d.len(Vector2d.sub(center, p0, temp12));

    let angle0 = Math.atan2((p1[1] - center[1]), (p1[0] - center[0]));
    let angle1 = Math.atan2((p0[1] - center[1]), (p0[0] - center[0]));

    let orgAngle0 = angle0;

    // make the round caps point in the right direction.

    // calculate minimum angle between two given angles.
    // for example: -Math.PI, Math.PI = 0, -Math.PI/2, Math.PI= Math.PI/2, etc.
    if (angle1 > angle0) {
        while (angle1 - angle0 >= Math.PI - EPS) {
            angle1 = angle1 - 2 * Math.PI;
        }
    }
    else {
        while (angle0 - angle1 >= Math.PI - EPS) {
            angle0 = angle0 - 2 * Math.PI;
        }
    }

    let angleDiff = angle1 - angle0;

    // for angles equal Math.PI, make the round point in the right direction.
    if (Math.abs(angleDiff) >= Math.PI - EPS && Math.abs(angleDiff) <= Math.PI + EPS) {
        let r1 = Vector2d.sub(center, nextPointInLine, temp12);
        if (r1[0] === 0) {
            if (r1[1] > 0) {
                angleDiff = -angleDiff;
            }
        } else if (r1[0] >= -EPS) {
            angleDiff = -angleDiff;
        }
    }

    // calculate points, and make the cap.
    let nsegments = (Math.abs(angleDiff * radius) / 7) >> 0;
    nsegments++;

    let angleInc = angleDiff / nsegments;

    for (let i = 0; i < nsegments; i++) {
        indices.push(
            push(center, vertices),
            push(Vector2d.set(
                center[0] + radius * Math.cos(orgAngle0 + angleInc * i),
                center[1] + radius * Math.sin(orgAngle0 + angleInc * i), temp12
            ), vertices),
            push(Vector2d.set(
                center[0] + radius * Math.cos(orgAngle0 + angleInc * (1 + i)),
                center[1] + radius * Math.sin(orgAngle0 + angleInc * (1 + i)), temp12
            ), vertices)
        );
    }
};

const triangulate = (p0: Vec2d, p1: Vec2d, p2: Vec2d, thickness: number, lineJoin: CanvasLineJoin, miterLimit: number, vertices: Vec2d[], indices: number[]) => {
    Vector2d.normal(Vector2d.normalize(Vector2d.sub(p1, p0, line1), l1), n1);
    Vector2d.normal(Vector2d.normalize(Vector2d.sub(p2, p1, line2), l2), n2);
    if (Vector2d.cross1(p0, p1, p0, p2) > 0) {
        Vector2d.neg(n1);
        Vector2d.neg(n2);
    }
    Vector2d.add(Vector2d.mul(n1, thickness, temp1), p0);
    Vector2d.add(Vector2d.mul(n1, thickness, temp2), p1);
    Vector2d.add(Vector2d.mul(n2, thickness, temp3), p1);
    Vector2d.add(Vector2d.mul(n2, thickness, temp4), p2);
    Vector2d.add(Vector2d.mul(n1, -thickness, temp5), p0);
    Vector2d.add(Vector2d.mul(n2, -thickness, temp6), p2);
    Vector2d.add(Vector2d.mul(n1, -thickness, temp7), p1);
    Vector2d.add(Vector2d.mul(n2, -thickness, temp8), p1);
    let intersect = Vector2d.intersection(temp1, temp2, temp4, temp3, temp9);
    let anchorLen = Number.MAX_VALUE;
    if (intersect) {
        Vector2d.sub(intersect, p1, temp10);
        anchorLen = Vector2d.len(temp10);
        Vector2d.sub(p1, temp10, temp11);
    }
    let dd = (anchorLen / thickness) | 0;
    let p0p1Len = Vector2d.len(line1);
    let p1p2Len = Vector2d.len(line2);
    if (anchorLen > p0p1Len || anchorLen > p1p2Len) {
        indices.push(
            push(temp1, vertices),
            push(temp5, vertices),
            push(temp2, vertices)
        );
        indices.push(
            push(temp5, vertices),
            push(temp2, vertices),
            push(temp7, vertices)
        );
        if (lineJoin === 'round') {
            createRoundCap(p1, temp2, temp3, p2, vertices, indices);
        } else if (lineJoin === 'bevel' || (lineJoin === 'miter' && dd >= miterLimit)) {
            indices.push(
                push(p1, vertices),
                push(temp2, vertices),
                push(temp3, vertices)
            );
        } else if (lineJoin === 'miter' && dd < miterLimit && intersect) {
            indices.push(
                push(temp2, vertices),
                push(p1, vertices),
                push(intersect, vertices),

                push(temp3, vertices),
                push(p1, vertices),
                push(intersect, vertices)
            );
        }
        indices.push(
            push(temp4, vertices),
            push(temp8, vertices),
            push(temp3, vertices),

            push(temp4, vertices),
            push(temp8, vertices),
            push(temp6, vertices)
        );
    } else {
        indices.push(
            push(temp1, vertices),
            push(temp5, vertices),
            push(temp11, vertices),

            push(temp1, vertices),
            push(temp11, vertices),
            push(temp2, vertices),

            push(temp11, vertices),
            push(temp2, vertices),
            push(temp3, vertices)
        );
        if (lineJoin === 'round') {
            indices.push(
                push(temp2, vertices),
                push(p1, vertices),
                push(temp11, vertices)
            );
            createRoundCap(p1, temp2, temp3, temp11, vertices, indices);
            indices.push(
                push(p1, vertices),
                push(temp3, vertices),
                push(temp11, vertices)
            );
        } else {
            if (lineJoin === 'bevel' || (lineJoin === 'miter' && dd >= miterLimit)) {
                indices.push(
                    push(temp2, vertices),
                    push(temp3, vertices),
                    push(temp11, vertices),
                );
            }
            if (lineJoin === 'miter' && dd < miterLimit) {
                indices.push(
                    push(temp9, vertices),
                    push(temp2, vertices),
                    push(temp3, vertices),
                );
            }
        }

        indices.push(
            push(temp4, vertices),
            push(temp11, vertices),
            push(temp3, vertices),

            push(temp4, vertices),
            push(temp11, vertices),
            push(temp6, vertices),
        );
    }
};

/**
 * Implemented from Efficient WebGL stroking
 * reference: https://hypertolosana.wordpress.com/2015/03/10/efficient-webgl-stroking/
 */
export default (
    vertices: Vec2d[], output: Vec2d[], indices: number[], lineWidth: number,
    lineCap: CanvasLineCap = 'butt', lineJoin: CanvasLineJoin = 'miter', miterLimit: number = 50
) => {
    thickness = lineWidth * 0.5;
    indiceCount = 0;
    indiceMap = {};
    let verticeCount = vertices.length;
    let closed = Vector2d.equals(vertices[0], vertices[verticeCount - 1]);
    // Filter those adjacent duplicate vertices
    vertices = vertices.filter((v, i, arr) => {
        return i === verticeCount - 1 || !Vector2d.equals(v, arr[(i + 1) % verticeCount]);
    });
    verticeCount = vertices.length;
    if (verticeCount <= 1) return;
    if (verticeCount === 2) {
        triangulate(vertices[0], Vector2d.mul(Vector2d.add(vertices[0], vertices[1], temp13), 0.5), vertices[1], thickness, 'bevel', miterLimit, output, indices);
    } else {
        let i; let
            count = 0;
        let middlePoints: Vec2d[] = [];
        for (i = 0; i < verticeCount - 1; i++) {
            if (i === 0) {
                middlePoints.push(vertices[0]);
            } else if (i === verticeCount - 2) {
                middlePoints.push(vertices[verticeCount - 1]);
            } else {
                middlePoints.push(Vector2d.mul(Vector2d.add(vertices[i], vertices[i + 1], temp13), 0.5).slice());
            }
        }

        for (i = 1, count = middlePoints.length; i < count; i++) {
            triangulate(middlePoints[i - 1], vertices[i], middlePoints[i], thickness, lineJoin, miterLimit, output, indices);
        }
    }
    if (!closed) {
        let outputCount = output.length;
        if (lineCap === 'round') {
            let p00 = output[0];
            let p01 = output[1];
            let p02 = vertices[1];
            let p10 = output[outputCount - 1];
            let p11 = output[outputCount - 3];
            let p12 = vertices[verticeCount - 2];

            createRoundCap(vertices[0], p00, p01, p02, output, indices);
            createRoundCap(vertices[verticeCount - 1], p10, p11, p12, output, indices);
        } else if (lineCap === 'square') {
            let p00 = output[outputCount - 1];
            let p01 = output[outputCount - 3];
            createSquareCap(
                output[0],
                output[1],
                Vector2d.mul(Vector2d.normalize(Vector2d.sub(vertices[0], vertices[1], temp13)), Vector2d.distance(vertices[0], output[0])),
                output, indices
            );
            createSquareCap(
                p00,
                p01,
                Vector2d.mul(Vector2d.normalize(Vector2d.sub(vertices[verticeCount - 1], vertices[verticeCount - 2], temp13)), Vector2d.distance(p01, vertices[verticeCount - 1])),
                output, indices
            );
        }
    }
};