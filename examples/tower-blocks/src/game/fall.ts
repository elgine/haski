// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default interface Fall{
    rotationSpeed: number;
    height: number;
}

export interface FallParams{
    rotationSpeed?: number;
    height?: number;
}

export const createFall = () => {
    return {
        rotationSpeed: 0,
        height: 0
    };
};

export const defaultFall = () => {
    return {
        rotationSpeed: 0.1,
        height: 600
    };
};