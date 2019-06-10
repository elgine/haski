// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface Gradient{
    colors: string[];
    stops: number[];
}

export interface LinearGradient extends Gradient{
    s: Vec2d;
    e: Vec2d;
}

export interface RadialGradient extends Gradient{
    sc: Vec2d;
    sr: number;
    ec: Vec2d;
    er: number;
}

export const isLinearGradient = (v: Gradient) => {
    return v.hasOwnProperty('s') && v.hasOwnProperty('e');
};

export const isRadialGradient = (v: Gradient) => {
    return v.hasOwnProperty('sc') && v.hasOwnProperty('sr') &&
        v.hasOwnProperty('ec') && v.hasOwnProperty('er');
};