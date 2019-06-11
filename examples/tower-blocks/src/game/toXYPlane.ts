// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const SQRT3 = Math.sqrt(3); const
    iSQRT6 = 1 / Math.sqrt(6);
export default (pos: Vec3d, out?: Vec2d) => {
    out = out || [0, 0];
    out[0] = (SQRT3 * pos[0] - SQRT3 * pos[2]) * iSQRT6;
    out[1] = -(pos[0] + 2 * pos[1] + pos[2]) * iSQRT6;
    return out;
};