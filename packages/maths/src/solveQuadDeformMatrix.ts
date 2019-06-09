// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const r1 = [0, 0, 0];
const r2 = [0, 0, 0];

const solveMatrixComponent = (arr1: number[], arr2: number[], arr3: number[], p: number[]) => {
    let a1 = arr1[0];
    let b1 = arr1[1];
    let c1 = arr1[2];
    let d1 = arr1[3];

    let a2 = arr2[0];
    let b2 = arr2[1];
    let c2 = arr2[2];
    let d2 = arr2[3];

    let a3 = arr3[0];
    let b3 = arr3[1];
    let c3 = arr3[2];
    let d3 = arr3[3];

    let m1 = c1 - (b1 * c2 / b2);
    let m2 = c2 - (b2 * c3 / b3);
    let m3 = d2 - (b2 * d3 / b3);
    let m4 = a2 - (b2 * a3 / b3);
    let m5 = d1 - (b1 * d2 / b2);
    let m6 = a1 - (b1 * a2 / b2);

    let x = ((m1 / m2) * m3 - m5) / ((m1 / m2) * m4 - m6);
    let z = (m3 - m4 * x) / m2;
    let y = (d1 - a1 * x - c1 * z) / b1;

    p[0] = x;
    p[1] = y;
    p[2] = z;
};

export default (v1: Vec2d, v1a: Vec2d, v2: Vec2d, v2a: Vec2d, v3: Vec2d, v3a: Vec2d, m: Mat2d) => {
    // Avoid the situation denominator equals to zero result in matrix params
    // equals to NaN, so we plus 1 here
    let arr1 = [v1[0] + 1, v1[1] + 1, 1, v1a[0] + 1];
    let arr2 = [v2[0] + 1, v2[1] + 1, 1, v2a[0] + 1];
    let arr3 = [v3[0] + 1, v3[1] + 1, 1, v3a[0] + 1];
    solveMatrixComponent(arr1, arr2, arr3, r1);

    arr1[3] = v1a[1] + 1;
    arr2[3] = v2a[1] + 1;
    arr3[3] = v3a[1] + 1;

    solveMatrixComponent(arr1, arr2, arr3, r2);
    m[0] = r1[0];
    m[1] = r2[0];
    m[2] = r1[1];
    m[3] = r2[1];
    m[4] = r1[2];
    m[5] = r2[2];
};