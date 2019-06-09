// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default (n: number) => {
    return (n & (n - 1)) === 0;
};