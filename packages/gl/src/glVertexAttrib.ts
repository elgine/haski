// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default interface GLVertexAttrib{
    name: string;
    // Location, call gl.getAttribLocation to get it
    location: number;
    // 1, 2, 3, 4, 9, 16
    size: number;
    // float, int, vec2, mat2, etc...
    type: number;
    // FLOAT, UNSIGNED_SHORT, INT, UNSIGNED_INT
    unitType: number;
}