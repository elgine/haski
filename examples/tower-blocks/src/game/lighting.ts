// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default interface Lighting{
    ambientLightOffset: Vec3d;
    ambientLightColorDiff: number;
}

export interface LightingParams{
    ambientLightOffset?: Vec3d;
    ambientLightColorDiff?: number;
}

export const createLighting = () => {
    return {
        ambientLightColorDiff: 0.35,
        ambientLightOffset: [0, 0, 0]
    };
};

export const defaultLighting = () => {
    return { ambientLightOffset: [-5, 1, 0], ambientLightColorDiff: 0.35 };
};