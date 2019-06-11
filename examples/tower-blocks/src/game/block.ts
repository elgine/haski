// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import IsoCube from './isoCube';

export enum BlockState{
    FREE,
    RELEASED,
    PLACED,
    DISCARD
}

export default interface Block{
    id: number;
    state: BlockState;
    pos: Vec3d;
    scale: number;
    opacity: number;
    size: {width: number; height: number; depth: number};
    rotation: AxisRad;
    rotationSpeed: number;
    color: ColorRawData;
    view: IsoCube;
}