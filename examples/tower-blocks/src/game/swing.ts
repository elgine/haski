// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default interface Swing{
    time: number;
    swingDirection: Vec3d;
    swingTripDuration: number;
    swingTripLengthRatio: number;
}

export interface SwingParams{
    swingTripDuration?: number;
    swingTripLengthRatio?: number;
}

export const createSwing = () => {
    return {
        time: 0,
        swingDirection: [0, 0, 0],
        swingTripDuration: 0,
        swingTripLengthRatio: 1.0
    };
};

export const defaultSwing = () => {
    return {
        time: 0,
        swingDirection: [0, 0, 0],
        swingTripDuration: 200,
        swingTripLengthRatio: 1.2
    };
};

export const swingDirection = (level: number) => {
    return level % 2 === 0 ? 0 : 2;
};

export const swingForward = (level: number) => {
    return level % 4 === 0 ? 1 : -1;
};