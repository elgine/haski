// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default (parent: {x: number; y: number}, children: Dictionary<{x: number; y: number}>) => {
    for (let p in children) {
        let b = children[p];
        b.x += parent.x;
        b.y += parent.y;
    }
};