// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export const BOOL = 0;
export const UNSIGNED_BYTE = 1;
export const BYTE = 2;
export const UNSIGNED_SHORT = 3;
export const SHORT = 4;
export const UNSIGNED_INT = 5;
export const INT = 6;
export const FLOAT = 7;

export const FLOAT_VEC2 = 8;
export const FLOAT_VEC3 = 9;
export const FLOAT_VEC4 = 10;

export const INT_VEC2 = 11;
export const INT_VEC3 = 12;
export const INT_VEC4 = 13;

export const MAT2 = 14;
export const MAT3 = 15;
export const MAT4 = 16;

export default interface GLShaderDataType{
    unit: number;
    array: boolean;
}