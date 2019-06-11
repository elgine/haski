// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default interface Physics{
    gravity: number;
}

export interface PhysicsParams{
    gravity?: number;
}

export const createPhysics = () => {
    return {
        gravity: 0
    };
};

export const defaultPhysics = () => {
    return {
        gravity: 500
    };
};