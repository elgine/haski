// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export const sgn = <T> (x: T, y: T) => {
    if (x < y) return -1;
    else if (x > y) return 1;
    return 0;
};