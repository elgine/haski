// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Pattern from './pattern';
import { Gradient } from './gradient';

export type FillStyle = ColorRawData | Pattern | Gradient;

export enum FillStyleType{
    COLOR,
    GRADIENT,
    PATTERN
}

export const isGradient = (style: FillStyle) => {
    return typeof style === 'object' && style.hasOwnProperty('colors') && style.hasOwnProperty('stops');
};

export const isPattern = (style: FillStyle) => {
    return typeof style === 'object' && style.hasOwnProperty('texture');
};