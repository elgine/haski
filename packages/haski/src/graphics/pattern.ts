// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Texture from '../core/texture';

export type PatternRepeation = 'repeat-x' | 'repeat-y' | 'repeat' | 'no-repeat';

export default interface Pattern{
    texture: Texture;
    matrix?: Mat2d;
    repeat?: PatternRepeation;
}