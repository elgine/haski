// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default (min: number, max: number, n: number) => {
    return Math.max(Math.min(n, max), min);
};